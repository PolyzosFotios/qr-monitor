import qr from "qrcode";
import { supabase } from "../../../supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {

    const body = await req.json();

    if (!body || !body.url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const url = body.url;

    const id_public = generatePrivateID();
    const id_private = generatePrivateID();
    let totalUrl = `${req.headers.get("origin")}/api/follow/${id_public}`;

    let qrCodeUrl;
    try {
      qrCodeUrl = await qr.toDataURL(totalUrl);
    } catch (qrError) {
      return NextResponse.json({ error: "Failed to generate QR code", details: qrError.message }, { status: 500 });
    }

    try {
      await dbNewAdd(id_public, id_private, url);
    } catch (dbError) {
      return NextResponse.json({ error: "Failed to insert into Supabase", details: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ id_private, qrCodeUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate QR", details: error.message }, { status: 500 });
  }
}

function generatePrivateID() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 18; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

async function dbNewAdd(id_public, id_private, url) {
  const { error } = await supabase.from("generqrcodes").insert([
    {
      id: id_public,
      private_id: id_private,
      url,
      created_at: new Date().toISOString(),
      scans: getInitMonthQr(),
    },
  ]);

  if (error) {
    throw error;
  }
}

function getInitMonthQr() {
  const d = new Date();
  return `${d.getFullYear()}.${d.getMonth()}:0,`;
}