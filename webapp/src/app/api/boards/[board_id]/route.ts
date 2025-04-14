import { createClient } from "@/superbase/server";
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "./payload";
import { now } from "lodash";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { FileId } from "@excalidraw/excalidraw/element/types";
import { calculateNewElementPosition } from "./gridLogic";
import { customGridLogic } from "./customLogic";
const { imageSize } = require("image-size");

export async function POST(request: NextRequest, { params }: { params: Promise<any> }) {
  const data = await request.json();
  const supabase = await createClient();
  // request.headers.get("Authorization");
  // await supabase.auth.setSession({
  //   access_token: request.headers.get("Authorization") ?? "",
  //   refresh_token: "QoQirCiAXB0cs57uTy8Prg",
  // });
  const session = await supabase.auth.getUser();
  if (!session.data.user) {
    console.log("session");
    return new NextResponse("No session");
  }
  const board_id = (await params).board_id;
  const image_id = crypto.randomUUID();
  const file_id = crypto.randomUUID();

  const buffer = Buffer.from(data.file.split(",")[1].trim(), "base64");
  const dimensions = imageSize(buffer);
  if (!dimensions || !dimensions.width || !dimensions.height) {
    throw new Error("Could not determine image dimensions.");
  }

  const fileData = {
    id: file_id,
    board_id: board_id,
    mimeType: "image/png",
    dataURL: data.file,
    created: now(),
    lastRetrieved: now(),
  };

  // get all board elements where is_deleted is false

  const { data: elements, error: elementsError } = await supabase.from("board_elements").select().eq("board_id", board_id).eq("is_deleted", false);
  // const { data: elements, error: elementsError } = await supabase.from("board_elements").select().eq("board_id", board_id);
  const oldElements = elements?.map((el) => {
    return {
      width: el.element.width,
      height: el.element.height,
      x: el.element.x,
      y: el.element.y,
    };
  });

  console.log("oldElements", oldElements);
  const { x, y, height, width } = customGridLogic(
    oldElements ?? [],
    {
      width: dimensions.width,
      height: dimensions.height,
    },
    1000,
    15,
  );

  const { data: file, error: fileError } = await supabase.from("board_files").insert(fileData).select().single();
  console.log(data.url);
  const newElement = getPayload(width, height, image_id, file_id, x, y, data.url);
  console.log("newElement", newElement);
  const { data: board, error } = await supabase.from("board_elements").insert({ id: image_id, board_id: board_id, version: 1, version_nonce: 1, is_deleted: false, element: newElement }).select().single();

  if (error) {
    console.log("error", error);
    return new NextResponse(error.message);
  }

  // Need to trigger a event to update any active clients
  const channel = supabase.channel("test:" + board_id);
  channel.subscribe();

  channel.send({
    type: "broadcast",
    event: "test",
    payload: {
      elements: [
        {
          element: board.element,
          board_id: board_id,
          version: 1,
          version_nonce: 1,
          is_deleted: false,
          file: file,
        },
      ],
      version: 1000000,
      selectedElements: [],
    },
  });

  return new NextResponse("");
}
