import { supabase } from "@/supabase";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const id = params.id;

  const { data, error } = await supabase
    .from("generqrcodes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "QR Code not found", details: error?.message },
      { status: 404 }
    );
  }

  const updatedScans = updateScan(data.scans);

  const { error: updateError } = await supabase
    .from("generqrcodes")
    .update({ scans: updatedScans })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update scans" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(data.url);
}

function updateScan(scans) {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  scans = scans.slice(0, -1);
  const scanEntries = scans.split(",");
  let updatedScans = "";

  const lastEntry = scanEntries[scanEntries.length - 1]?.split(":");
  if (lastEntry && lastEntry[0] === `${year}.${month}`) {
    const count = parseInt(lastEntry[1]) + 1;
    scanEntries[scanEntries.length - 1] = `${year}.${month}:${count}`;
  } else {
    scanEntries.push(`${year}.${month}:1`);
  }

  updatedScans = scanEntries.join(",") + ",";
  return updatedScans;
}