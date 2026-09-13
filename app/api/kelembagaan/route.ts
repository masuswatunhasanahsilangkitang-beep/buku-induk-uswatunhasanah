import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.kelembagaan.findFirst();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await prisma.kelembagaan.findFirst();

    let result;
    if (existing) {
      // Jika data sudah ada, lakukan Update
      result = await prisma.kelembagaan.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      // Jika data kosong, buat baru (Insert)
      result = await prisma.kelembagaan.create({
        data: body,
      });
    }

    return NextResponse.json({ success: true, message: "Profil kelembagaan berhasil diperbarui", data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}