import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.gedung.findMany({ 
      include: { lahan: true },
      orderBy: { namaGedung: 'asc' } 
    });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const gedungBaru = await prisma.gedung.create({ 
      data: {
        namaGedung: body.namaGedung,
        lahanId: body.lahanId || null,
        jumlahLantai: body.jumlahLantai,
        kepemilikan: body.kepemilikan,
        tahunDibangun: body.tahunDibangun,
        panjang: body.panjang,
        lebar: body.lebar,
        kondisi: body.kondisi
      }
    });
    return NextResponse.json({ success: true, data: gedungBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}