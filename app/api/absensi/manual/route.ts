import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Ambil daftar Siswa, Guru, dan Jadwal untuk form dropdown
export async function GET() {
  try {
    const siswa = await prisma.santri.findMany({ include: { rombel: true }, orderBy: { namaLengkap: "asc" } });
    const guru = await prisma.guru.findMany({ orderBy: { namaLengkap: "asc" } });
    const jadwal = await prisma.jadwalKegiatan.findMany({ orderBy: { jamMulai: "asc" } });
    
    return NextResponse.json({ success: true, data: { siswa, guru, jadwal } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Simpan absen manual (Bypass aturan kunci sesi)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, targetId, tanggal, jadwalId, jenisKegiatan, namaKegiatan, status, keterangan } = body;

    if (!targetId || !tanggal || !status) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap." }, { status: 400 });
    }

    const waktu = new Date().toLocaleTimeString("id-ID", { hour12: false });

    if (role === "siswa") {
      const existing = await prisma.absensiSantri.findFirst({ 
        where: { santriId: targetId, tanggal, jadwalId: jadwalId || undefined } 
      });
      
      if (existing) {
        await prisma.absensiSantri.update({ where: { id: existing.id }, data: { status, keterangan } });
        return NextResponse.json({ success: true, message: `Status diperbarui menjadi ${status}` });
      }
      await prisma.absensiSantri.create({ 
        data: { santriId: targetId, tanggal, waktu, status, jenisKegiatan, namaKegiatan, jadwalId, keterangan } 
      });
    } else {
      const existing = await prisma.absensiGuru.findFirst({ 
        where: { guruId: targetId, tanggal, jadwalId: jadwalId || undefined } 
      });
      
      if (existing) {
        await prisma.absensiGuru.update({ where: { id: existing.id }, data: { status, keterangan } });
        return NextResponse.json({ success: true, message: `Status diperbarui menjadi ${status}` });
      }
      await prisma.absensiGuru.create({ 
        data: { guruId: targetId, tanggal, waktu, status, jenisKegiatan, namaKegiatan, jadwalId, keterangan } 
      });
    }

    return NextResponse.json({ success: true, message: `Berhasil mencatat status: ${status}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem." }, { status: 500 });
  }
}