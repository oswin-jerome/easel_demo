"use client";
import { BoardJSON } from "@/types";
import { Excalidraw, LiveCollaborationTrigger, convertToExcalidrawElements } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { on } from "events";
import { useRef } from "react";

const ExcalidrawWrapper = ({ initData, onChange, onGetApi }: { initData: any; onChange?: (json: BoardJSON) => void; onGetApi?: (api: ExcalidrawImperativeAPI) => void }) => {
  const version = useRef(initData.version ?? 1);
  const updateElement = (el: any) => {};
  const currentApi = useRef<ExcalidrawImperativeAPI>(null);
  return (
    <div className="h-full" style={{ width: "100vw" }}>
      <Excalidraw
        excalidrawAPI={(api) => {
          onGetApi && onGetApi(api);
          currentApi.current = api;
        }}
        validateEmbeddable={(el) => {
          return true;
        }}
        renderEmbeddable={(el: any, state) => {
          const files = currentApi.current?.getFiles();
          if (!files) {
            return <div>File not found</div>;
          }
          const file = files[el.fileId];
          return (
            <div style={{ width: "100%", height: "100%" }}>
              <img style={{ width: "100%", height: "100%" }} src={file.dataURL} />
            </div>
          );
        }}
        initialData={{
          ...initData,
          appState: {
            ...initData?.appState,
            collaborators: new Map(),
          },
        }}
        onChange={(elements, appState, files) => {
          if (appState.name == "test") {
            // console.log("test");
            appState.name = "test2";
            return;
          }
          const json = {
            type: "excalidraw",
            version: version.current++,
            source: "your-app",
            elements,
            appState,
            files,
          };

          onChange && onChange(json);
        }}
      />
    </div>
  );
};
export default ExcalidrawWrapper;
