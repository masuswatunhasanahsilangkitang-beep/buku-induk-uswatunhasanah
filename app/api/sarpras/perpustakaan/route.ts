import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.perpustakaan.findMany({ 
      orderBy: { judulBuku: 'asc' } 
    });
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bukuBaru = await prisma.perpustakaan.create({ 
      data: {
        kodeBuku: body.kodeBuku || null,
        judulBuku: body.judulBuku,
        kategori: body.kategori,
        pengarang: body.pengarang,
        penerbit: body.penerbit,
        tahunTerbit: body.tahunTerbit,
        jumlahTotal: Number(body.jumlahTotal) || 0,
        kondisiBaik: Number(body.kondisiBaik) || 0,
        kondisiRusak: Number(body.kondisiRusak) || 0
      }
    });
    return NextResponse.json({ success: true, data: bukuBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}