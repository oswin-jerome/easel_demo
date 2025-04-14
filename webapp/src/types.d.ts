import { BinaryFiles } from "@excalidraw/excalidraw/types";

export interface Board {
  id: number;
  created_at: Date;
  title: string;
  board_data: any;
  owner_id: string;
  collaborators_emails: string[];
}
export interface BoardJSON {
  type: string;
  version: number;
  source: string;
  elements: readonly OrderedExcalidrawElement[];
  appState: AppState;
  files: BinaryFiles;
}
// export interface BinaryFiles {
//   [key: string]: BinaryFile;
// }
// export interface BinaryFile {
//   mimeType: string;
//   id: string;
//   dataURL: string;
//   created: number;
//   lastRetrieved: number;
// }
