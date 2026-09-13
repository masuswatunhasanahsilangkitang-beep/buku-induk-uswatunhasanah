import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Sesuaikan jika path import prisma Anda berbeda (misal: "../../../lib/prisma")

// 1. FUNGSI UNTUK MENGAMBIL JADWAL (GET)
export async function GET(request: Request) {
  try {
    // Menangkap parameter hari dari URL (misal: ?hari=Senin)
    const { searchParams } = new URL(request.url);
    const hari = searchParams.get("hari");

    // Jika ada parameter hari, filter berdasarkan hari tersebut. Jika tidak, ambil semua jadwal aktif.
    const whereClause = hari ? { hari, isActive: true } : { isActive: true };

    const jadwal = await prisma.jadwalKegiatan.findMany({
      where: whereClause,
      orderBy: { jamMulai: "asc" }, // Urutkan dari jam paling pagi
    });

    return NextResponse.json({ success: true, data: jadwal });
  } catch (error) {
    console.error("Gagal mengambil jadwal:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat mengambil jadwal." },
      { status: 500 }
    );
  }
}

// 2. FUNGSI UNTUK MENAMBAH JADWAL BARU (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { namaKegiatan, jenisKegiatan, hari, jamMulai, jamSelesai } = body;

    // Validasi data kosong
    if (!namaKegiatan || !hari || !jamMulai || !jamSelesai) {
      return NextResponse.json(
        { success: false, message: "Data jadwal tidak boleh ada yang kosong." },
        { status: 400 }
      );
    }

    // Simpan ke database
    const jadwalBaru = await prisma.jadwalKegiatan.create({
      data: {
        namaKegiatan: namaKegiatan.trim(),
        jenisKegiatan: jenisKegiatan || "KBM Harian",
        hari: hari.trim(),
        jamMulai: jamMulai.trim(),
        jamSelesai: jamSelesai.trim(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Jadwal berhasil ditambahkan!", 
      data: jadwalBaru 
    });
  } catch (error) {
    console.error("Gagal menyimpan jadwal:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat menyimpan jadwal." },
      { status: 500 }
    );
  }
}