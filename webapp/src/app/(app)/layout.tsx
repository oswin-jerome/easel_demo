import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createClient } from "@/superbase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const AppLayout = async ({ children }: { children: ReactNode }) => {
  // This layout is shared across all pages in the app
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  return (
    <div>
      <div>
        <nav className="p-4 flex justify-between items-center container mx-auto">
          <h1 className="font-bold text-xl italic">Easel</h1>
          <div className="flex items-center gap-4">
            <Link href="/boards">
              <Button className="cursor-pointer" variant={"link"}>
                Boards
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={"https://github.com/shadcn.png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default AppLayout;
