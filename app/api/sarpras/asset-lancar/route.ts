import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.asetLancar.findMany({ 
      orderBy: { namaBarang: 'asc' } 
    });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const asetBaru = await prisma.asetLancar.create({ 
      data: {
        kodeBarang: body.kodeBarang || null,
        namaBarang: body.namaBarang,
        kategori: body.kategori,
        jumlahStok: Number(body.jumlahStok) || 0,
        satuan: body.satuan,
        sumberDana: body.sumberDana,
        keterangan: body.keterangan
      }
    });
    return NextResponse.json({ success: true, data: asetBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}