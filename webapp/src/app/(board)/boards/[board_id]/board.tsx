"use client";
import { upsetBoardElements, upsetBoardFiles } from "@/actions/board_elements";
import { updateBoardContent } from "@/actions/boards";
import useBoardInitialization from "@/hooks/useBoardInitialization";
import useCollaboratorSync from "@/hooks/useCollaboratorSync";
import usePointerBroadcast from "@/hooks/usePointerBroadcast";
import useUpdateOnBroadcast from "@/hooks/useUpdateOnBroadcast";
import { getTouchedFiles } from "@/lib/getTouchedElements";
import useMousePosition from "@/lib/useMousePosition";
import { Board, BoardJSON } from "@/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const ExcalidrawWrapper = dynamic(async () => (await import("@/components/ELWrapper")).default, {
  ssr: false,
});

const WhiteBoard = ({ board }: { board: Board }) => {
  const { x, y } = useMousePosition();
  // const user = null;
  const [excalidrawAPI, setExcalidrawAPI] = useState<null | ExcalidrawImperativeAPI>(null);
  // const [rC, setRC] = useState<null | RealtimeChannel>(null);
  const [pendingSave, setPendingSave] = useState(false);
  const router = useRouter();
  const { versions, filesID, clientIdRef, server } = useBoardInitialization(board);
  const [rC] = useUpdateOnBroadcast(excalidrawAPI, board, versions, server);
  useCollaboratorSync(rC, excalidrawAPI, clientIdRef);
  usePointerBroadcast(rC, excalidrawAPI, clientIdRef, x ?? 0, y ?? 0);
  const getTouchedElements = (content: readonly OrderedExcalidrawElement[], shouldUpdate = false) => {
    const payload = content
      .map((el) => ({
        id: el.id,
        board_id: board.id,
        version: el.version,
        version_nonce: el.versionNonce,
        element: el,
        is_deleted: el.isDeleted ?? false,
      }))
      .filter((el) => {
        if (el.version <= versions.current.get(el.id)) {
          // console.log("Skipping", el.id);
          return false;
        }
        // console.log("Adding", el.id);
        if (shouldUpdate) versions.current.set(el.id, el.version);
        return true;
      });
    return payload;
  };
  const updateBoardContentDebounced = useCallback(
    debounce(async (boardId: string, content: BoardJSON) => {
      toast.loading("Saving...", {
        id: "saving",
      });

      const payload = getTouchedElements(content.elements, true);
      await updateBoardContent(boardId, {
        ...content,
        elements: [],
        files: {},
      });

      const files = await getTouchedFiles(content, filesID, board);

      if (files.length > 0) {
        await upsetBoardFiles(files);
      }
      console.log(payload.length);
      if (payload.length > 0) {
        await upsetBoardElements(payload);
        const { exportToBlob } = await import("@excalidraw/excalidraw");
        exportToBlob({
          opts: {},
          maxWidthOrHeight: 500,
          elements: content.elements,
          appState: content.appState,
          files: content.files,
          quality: 0.1,
        }).then(async (svg: any) => {
          console.log("Uploading svg");
          // const base64 = await toBase64(svg);
          const { data, error } = await server.storage.from("boards").upload("public/board_" + boardId + ".png", svg, {
            contentType: "image/png",
            upsert: true,
          });
          if (error) {
            console.error(error);
            // return;
          }
        });
      }
      toast.success("Saved", {
        id: "saving",
      });
    }, 1000),
    [board.id],
  );

  const excalidrawWrapper = useMemo(() => {
    return (
      <ExcalidrawWrapper
        initData={board.board_data}
        onGetApi={(api) => {
          setExcalidrawAPI(api);
        }}
        onChange={(e) => {
          const elements = getTouchedElements(e.elements);
          console.log("el", elements.length);
          if (elements.length === 0) return;
          setPendingSave(true);
          // console.log("onChange", elements);
          const promise = updateBoardContentDebounced(board.id.toString(), e);

          toast.info("You have pending changes", {
            id: "saving",
          });

          rC?.send({
            type: "broadcast",
            event: "test",
            payload: {
              elements: elements,
              version: e.version,
              selectedElements: e.appState.selectedElementIds,
            },
          });
        }}
      />
    );
  }, [board.id, rC]);

  return <section className="h-screen flex flex-col">{excalidrawWrapper}</section>;
};

export default WhiteBoard;
