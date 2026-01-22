import { ramadanData } from "@/data/ramadan";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(ramadanData);
}
