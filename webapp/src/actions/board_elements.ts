"use server";

import { createClient } from "@/superbase/server";

export const upsetBoardElements = async (elements: any) => {
  //   console.log("upsetBoardElements", elements.length);
  const supabase = await createClient();
  const { data, error } = await supabase.from("board_elements").upsert(elements, { onConflict: "id" });
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};

export const upsetBoardFiles = async (files: any) => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("board_files").upsert(files, { onConflict: "id" });
  if (error) {
    console.error(error);
    return null;
  }
  return data;
};
