import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Menarik daftar guru dari database, diurutkan sesuai abjad
    const guruList = await prisma.guru.findMany({
      orderBy: { namaLengkap: 'asc' },
      select: { 
        id: true, 
        namaLengkap: true, 
        kategoriTugas: true 
      }
    });

    return NextResponse.json({ success: true, data: guruList }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}