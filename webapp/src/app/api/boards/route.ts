import { createClient } from "@/superbase/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boards").select("id, title");
  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
  return NextResponse.json(data);
};
