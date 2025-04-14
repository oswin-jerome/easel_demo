"use server";

import { createClient } from "@/superbase/server";
import { Board, BoardJSON } from "@/types";
import { encodedRedirect } from "@/utils";
import { redirect } from "next/navigation";

export const createBoardAction = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("boards").insert({ title });
  if (error) {
    return encodedRedirect("error", "/boards", error.message);
  }
  return redirect("/boards");
};

export const getMyBoards = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boards").select("id,title").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return null;
    // return encodedRedirect("error", "/boards", error.message);
  }
  return data;
};

export const getBoardById = async (boardId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boards").select("*, board_elements(element), board_files(*)").eq("id", boardId).eq("board_elements.is_deleted", false).single();
  if (error) {
    console.error(error);
    return null;
  }
  const board = {
    ...data,
    board_data: {
      ...data.board_data,
      elements: data.board_elements.map((el: any) => el.element),
      files: Object.fromEntries(data.board_files.map((file: any) => [file.id, file])),
    },
    board_elements: undefined,
    board_files: undefined,
  } as Board;

  return board;
};

export const updateBoardContent = async (boardId: string, content: BoardJSON) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boards").update({ board_data: content }).eq("id", boardId);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const updateBoardName = async (boardId: string, name: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boards").update({ title: name }).eq("id", boardId);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const updateCollaboratorsEmails = async (boardId: string, emails: string) => {
  const supabase = await createClient();
  const emailsArray = emails.split(",").map((email) => email.trim());
  const { data, error } = await supabase.from("boards").update({ collaborators_emails: emailsArray }).eq("id", boardId);
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const deleteBoard = async (boardId: string) => {
  const supabase = await createClient();
  try {
    await supabase.from("board_elements").delete().eq("board_id", boardId);
    await supabase.from("board_files").delete().eq("board_id", boardId);
    const { data, error, statusText, status } = await supabase.from("boards").delete().eq("id", boardId);
    console.log(data, error, statusText, status);
  } catch (e) {
    console.log(e);
  }
  // console.log("deleteBoard", boardId);
  // if (error) {
  //   console.error(error);
  //   return null;
  // }
  // return data;
};
