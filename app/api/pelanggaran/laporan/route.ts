import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const santriId = searchParams.get("santriId");
    const rombelId = searchParams.get("rombelId");

    let whereClause: any = {};

    if (santriId) {
      whereClause.santriId = santriId;
    } else if (rombelId) {
      // Cari semua siswa yang ada di rombel tersebut
      const santriInRombel = await prisma.santri.findMany({
        where: { rombelId: rombelId },
        select: { id: true }
      });
      const ids = santriInRombel.map(s => s.id);
      whereClause.santriId = { in: ids };
    }

    const dataPelanggaran = await prisma.pelanggaran.findMany({
      where: whereClause,
      include: { 
        santri: { 
          include: { rombel: true } 
        } 
      },
      orderBy: { tanggal: 'desc' }
    });

    return NextResponse.json({ success: true, data: dataPelanggaran }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}