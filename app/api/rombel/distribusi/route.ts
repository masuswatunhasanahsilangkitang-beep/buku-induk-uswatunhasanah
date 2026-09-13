import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mengambil daftar Siswa yang belum masuk kelas & daftar Kelas yang tersedia
export async function GET() {
  try {
    const santriBelumMasuk = await prisma.santri.findMany({
      where: { rombelId: null }, // Memfilter siswa yang kolom rombel-nya masih kosong
      orderBy: { namaLengkap: 'asc' },
      select: { id: true, namaLengkap: true, nisn: true, jenisKelamin: true }
    });
    
    const rombelList = await prisma.rombel.findMany({
      orderBy: { namaRombel: 'asc' },
      select: { id: true, namaRombel: true, tingkat: true }
    });

    return NextResponse.json({ success: true, data: { santriBelumMasuk, rombelList } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Mengeksekusi penempatan siswa secara massal
export async function PUT(request: Request) {
  try {
    const { rombelId, santriIds } = await request.json();

    if (!rombelId || !santriIds || santriIds.length === 0) {
      return NextResponse.json({ success: false, message: "Pilih kelas tujuan dan centang minimal 1 siswa!" }, { status: 400 });
    }

    // Melakukan update massal (bulk update) pada tabel Santri
    const update = await prisma.santri.updateMany({
      where: { id: { in: santriIds } },
      data: { rombelId: String(rombelId) }
    });

    return NextResponse.json({ success: true, message: `${update.count} siswa berhasil dimasukkan ke kelas.` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}