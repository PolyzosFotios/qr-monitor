import { supabase } from "../../../supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("generqrcodes")
    .select("*")
    .eq("private_id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ id: "0", url: "", scans: "", created_at: "" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.private_id,
    url: data.url,
    scans: data.scans,
    created_at: data.created_at,
  });
}