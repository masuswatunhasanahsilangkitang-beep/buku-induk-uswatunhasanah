import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get("kategori");

  try {
    const data = await prisma.asetRuangan.findMany({ 
      where: kategori ? { kategori } : undefined,
      include: { 
        ruangan: { include: { gedung: true } } // Mengambil data Ruangan beserta Gedungnya
      },
      orderBy: { namaAset: 'asc' } 
    });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Konversi nilai string ke angka (Integer) untuk database
    const asetBaru = await prisma.asetRuangan.create({ 
      data: {
        ruanganId: body.ruanganId,
        kategori: body.kategori,
        namaAset: body.namaAset,
        jumlahTotal: Number(body.jumlahTotal) || 0,
        kondisiBaik: Number(body.kondisiBaik) || 0,
        kondisiRusak: Number(body.kondisiRusak) || 0,
        keterangan: body.keterangan
      }
    });
    return NextResponse.json({ success: true, data: asetBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}