import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.ruangan.findMany({ orderBy: { namaRuangan: 'asc' } });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ruanganBaru = await prisma.ruangan.create({ 
      data: { ...body, kapasitas: body.kapasitas ? parseInt(body.kapasitas) : null }
    });
    return NextResponse.json({ success: true, data: ruanganBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}