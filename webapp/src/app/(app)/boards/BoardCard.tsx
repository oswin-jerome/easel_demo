"use client";

import { deleteBoard, updateBoardName, updateCollaboratorsEmails } from "@/actions/boards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSupabaseUser } from "@/superbase/hook";
import { Board } from "@/types";
import { debounce } from "lodash";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const BoardCard = ({ board }: { board: Pick<Board, "id" | "title" | "owner_id" | "collaborators_emails"> }) => {
  const router = useRouter();
  const user = useSupabaseUser();
  const handleNameChange = useCallback(
    debounce(async (name: string) => {
      toast.loading("Saving...", {
        id: "board-name-update",
      });
      await updateBoardName(board.id.toString(), name);
      toast.success("Saved", {
        id: "board-name-update",
      });
      router.refresh();
    }, 500),
    [board.id],
  );

  const handleCollaborators = useCallback(
    debounce(async (emails: string) => {
      toast.loading("Saving...", {
        id: "board-emails-update",
      });
      await updateCollaboratorsEmails(board.id.toString(), emails);
      toast.success("Saved", {
        id: "board-emails-update",
      });
      router.refresh();
    }, 500),
    [board.id],
  );

  return (
    <Card className="bg-white shadow-none cursor-pointer pt-0 overflow-clip">
      <CardContent className="p-0">
        <Link target="_blank" href={`/boards/${board.id}`}>
          <img className="aspect-video w-full object-cover" src={`https://ppmjtnhnmfwemaemwynu.supabase.co/storage/v1/object/public/boards/public/board_${board.id}.png`} />
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <CardTitle>{board.title}</CardTitle>
        <div>
          {user?.id === board.owner_id && (
            <Button
              className="cursor-pointer"
              variant={"ghost"}
              onClick={async (e) => {
                e.stopPropagation();
                await deleteBoard(board.id.toString());
                router.refresh();
              }}
            >
              <Trash2Icon />
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"ghost"} size={"icon"} onClick={(e) => e.stopPropagation()}>
                <Edit2Icon />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Board </SheetTitle>
                <SheetDescription>Edit your board information</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <div className="input-group">
                  <Label>Name</Label>
                  <Input
                    defaultValue={board.title}
                    onChange={(e) => {
                      handleNameChange(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="input-group">
                  <Label>Collaborators</Label>
                  <Input
                    defaultValue={board.collaborators_emails?.join(", ")}
                    onChange={(e) => {
                      handleCollaborators(e.target.value);
                    }}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BoardCard;
