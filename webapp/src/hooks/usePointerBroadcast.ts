import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { RefObject, useEffect } from "react";

export default function usePointerBroadcast(rC: RealtimeChannel | null, excalidrawAPI: ExcalidrawImperativeAPI | null, clientIdRef: RefObject<string>, x: number, y: number) {
  useEffect(() => {
    if (!excalidrawAPI) return;
    if (!rC) return;
    // console.log("Sending pointer");
    async function newFunction() {
      if (!excalidrawAPI) return;
      if (!rC) return;
      const { viewportCoordsToSceneCoords } = await import("@excalidraw/excalidraw");
      const position = viewportCoordsToSceneCoords({ clientX: x ?? 10, clientY: y ?? 10 }, excalidrawAPI.getAppState());
      // server.auth.getUser();
      rC?.send({
        type: "broadcast",
        event: "pointer",
        payload: {
          x: position.x ?? 100,
          y: position.y ?? 100,
          clientId: clientIdRef.current,
          selectedElements: excalidrawAPI.getAppState().selectedElementIds,
        },
      });
    }
    newFunction();
  }, [rC, x, y, excalidrawAPI]);
}
