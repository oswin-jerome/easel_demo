import { Board, BoardJSON } from "@/types";
import { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { RefObject } from "react";

export const getTouchedElements = (content: readonly OrderedExcalidrawElement[], versions: RefObject<Map<any, any>>, board: Board, shouldUpdate = false) => {
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

export const getTouchedFiles = async (content: BoardJSON, filesID: RefObject<Map<any, any>>, board: Board) => {
  return Object.entries(content.files)
    .map(([key, file]) => ({
      id: key,
      board_id: board.id,
      mimeType: file.mimeType,
      dataURL: file.dataURL,
      created: file.created,
      lastRetrieved: file.lastRetrieved,
    }))
    .filter((el) => {
      if (filesID.current.has(el.id)) {
        return false;
      }
      filesID.current.set(el.id, el);
      return true;
    });
};
