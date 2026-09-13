import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaRombel, tingkat, tahunAjaran, waliKelasId } = body;

    if (!namaRombel || !tingkat || !tahunAjaran) {
      return NextResponse.json({ success: false, message: "Nama Rombel, Tingkat, dan Tahun Ajaran wajib diisi!" }, { status: 400 });
    }

    const rombelBaru = await prisma.rombel.create({
      data: {
        namaRombel: String(namaRombel),
        tingkat: String(tingkat),
        tahunAjaran: String(tahunAjaran),
        waliKelasId: waliKelasId ? String(waliKelasId) : null,
      }
    });

    return NextResponse.json({ success: true, message: "Rombel berhasil dibuat", data: rombelBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}