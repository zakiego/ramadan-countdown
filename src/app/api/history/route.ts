import { getAllRamadanData } from "@/utils/ramadan-data";
import { NextResponse } from "next/server";

export async function GET() {
  const data = getAllRamadanData();
  return NextResponse.json(data);
}
