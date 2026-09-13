import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.pelanggaran.findMany({
      include: { santri: { select: { namaLengkap: true, nisn: true, rombel: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.santriId || !body.bentuk || !body.tanggal) {
      return NextResponse.json({ success: false, message: "Data wajib belum lengkap!" }, { status: 400 });
    }

    const baru = await prisma.pelanggaran.create({
      data: {
        santriId: body.santriId,
        tanggal: body.tanggal,
        kategori: body.kategori,
        bentuk: body.bentuk,
        poin: Number(body.poin || 0),
        tindakan: body.tindakan,
        petugas: body.petugas,
      }
    });
    return NextResponse.json({ success: true, message: "Catatan pelanggaran berhasil disimpan!", data: baru });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Gagal menyimpan data." }, { status: 500 });
  }
}