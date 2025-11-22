import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://ipapi.com/ip_api.php?type=json");
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "GeoIP lookup failed" }, { status: 500 });
  }
}
