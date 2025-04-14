import { ExcalidrawImperativeAPI, SocketId } from "@excalidraw/excalidraw/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { RefObject, useEffect } from "react";

export default function useCollaboratorSync(rC: RealtimeChannel | null, excalidrawAPI: ExcalidrawImperativeAPI | null, clientIdRef: RefObject<string>) {
  useEffect(() => {
    if (!excalidrawAPI) return;
    if (!rC) return;

    rC.on("broadcast", { event: "pointer" }, async (payload: any) => {
      if (payload.payload.clientId === clientIdRef.current) return;
      const collaborators = excalidrawAPI.getAppState().collaborators;
      collaborators.set(payload.payload.clientId as SocketId, {
        username: payload.payload.clientId,
        id: payload.payload.clientId,
        isCurrentUser: payload.payload.clientId === clientIdRef.current,
        pointer: {
          x: payload.payload.x ?? 0,
          y: payload.payload.y ?? 0,
          tool: "pointer",
        },
        selectedElementIds: payload.payload.selectedElements,
      });

      excalidrawAPI.updateScene({
        appState: {
          collaborators: collaborators,
          name: "test",
        },
      });
    });
  }, [rC, excalidrawAPI, clientIdRef]);
}
