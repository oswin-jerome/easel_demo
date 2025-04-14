import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function useUpdateOnBroadcast(excalidrawAPI: ExcalidrawImperativeAPI | null, board: any, versions: any, server: any) {
  const [rC, setRC] = useState<null | RealtimeChannel>(null);

  useEffect(() => {
    if (!excalidrawAPI) return;
    const channel = server.channel("test:" + board.id);
    channel
      .on("broadcast", { event: "test" }, (payload: any) => {
        console.log("Received update:", payload.payload.elements);
        if (payload.version <= versions.current.get("board") + 10) return;
        versions.current.set("board", payload.version + 10);
        // console.log("Updating elements", payload.payload.elements);
        const elements = [...excalidrawAPI.getSceneElementsIncludingDeleted()];
        const files = excalidrawAPI.getFiles();
        const elementsMap = new Map(elements.map((el, i) => [el.id, i]));
        payload.payload.elements.forEach((el: any) => {
          if (elementsMap.has(el.id) && elements[elementsMap.get(el.id) as number].version < el.version) {
            elements[elementsMap.get(el.id) as number] = el.element;
          } else if (!elementsMap.has(el.id)) {
            elements.push(el.element);
            if (el.file) {
              files[el.file.id] = el.file;
            }
            elementsMap.set(el.id, 10);
          }
        });
        console.log("Updated elements", elements);
        excalidrawAPI?.updateScene({
          elements: elements,

          // captureUpdate: CaptureUpdateAction.NEVER,
          appState: {
            viewBackgroundColor: "#fff",
            name: "test",
          },
        });
      })
      .subscribe();
    setRC(channel);
    return () => {
      channel.unsubscribe();
    };
  }, [excalidrawAPI]);

  return [rC];
}
