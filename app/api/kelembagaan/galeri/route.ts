import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mengambil semua foto
export async function GET() {
  try {
    const data = await prisma.galeriSarpras.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Menambah foto baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newData = await prisma.galeriSarpras.create({ data: body });
    return NextResponse.json({ success: true, data: newData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Menghapus foto
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if(id) await prisma.galeriSarpras.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}