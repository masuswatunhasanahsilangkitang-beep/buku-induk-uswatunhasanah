import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const hariIniString = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());

    // 1. Hitung Total Data Master
    const totalSiswa = await prisma.santri.count();
    const totalGuru = await prisma.guru.count();
    const totalRombel = await prisma.rombel.count();

    // 2. Ambil Jadwal Hari Ini
    const jadwalHariIni = await prisma.jadwalKegiatan.findMany({
      where: { hari: hariIniString, isActive: true },
      orderBy: { jamMulai: 'asc' }
    });

    // 3. Hitung Kehadiran Siswa Hari Ini (Dikelompokkan per status)
    const absenSiswa = await prisma.absensiSantri.groupBy({
      by: ['status'],
      where: { tanggal: today },
      _count: true
    });

    // 4. Hitung Kehadiran Guru Hari Ini
    const absenGuru = await prisma.absensiGuru.groupBy({
      by: ['status'],
      where: { tanggal: today },
      _count: true
    });

    // Fungsi Format Data Kehadiran
    const formatAbsen = (data: any[]) => {
      const result = { Hadir: 0, Terlambat: 0, Sakit: 0, Izin: 0, Alfa: 0 };
      data.forEach(item => {
        if (result[item.status as keyof typeof result] !== undefined) {
          result[item.status as keyof typeof result] = item._count;
        }
      });
      return result;
    };

    return NextResponse.json({
      success: true,
      data: {
        master: { totalSiswa, totalGuru, totalRombel },
        jadwal: jadwalHariIni,
        kehadiran: {
          siswa: formatAbsen(absenSiswa),
          guru: formatAbsen(absenGuru)
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Gagal memuat dashboard." }, { status: 500 });
  }
}