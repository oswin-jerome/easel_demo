import { createClient } from "@/superbase/client";
import { Board } from "@/types";
import { useEffect, useRef } from "react";

export default function useBoardInitialization(board: Board) {
  const versions = useRef(new Map());
  const filesID = useRef(new Map());
  const clientIdRef = useRef(crypto.randomUUID()); // unique per session
  const server = createClient();

  useEffect(() => {
    board.board_data.elements.forEach((el: any) => {
      versions.current.set(el.id, el.version);
    });
    Object.keys(board.board_data.files).forEach((el: any) => {
      filesID.current.set(el, el);
    });
    server.auth.getUser().then((user) => {
      if (user) {
        clientIdRef.current = user.data.user?.email ?? crypto.randomUUID();
      }
    });
    versions.current.set("board", board.board_data.version);
  }, [board, server]);

  return { versions, filesID, clientIdRef, server };
}
