import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/superbase/server";
import { useSupabaseUser } from "@/superbase/hook";
import { useState } from "react";
import CreateBoardButton from "./createButton";
import { getMyBoards } from "@/actions/boards";
import Link from "next/link";
import BoardCard from "./BoardCard";

const BoardsPage = async () => {
  const boards = await getMyBoards();
  const server = await createClient();

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Boards</h3>
        <CreateBoardButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {boards?.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;
