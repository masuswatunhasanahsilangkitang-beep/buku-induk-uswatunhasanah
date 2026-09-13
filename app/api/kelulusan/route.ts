import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { santriId, tanggalLulus, tahunAjaran, noSuratKelulusan, noIjazah, melanjutkanKe, keterangan } = body;

    // Validasi data wajib
    if (!santriId || !tanggalLulus || !tahunAjaran) {
      return NextResponse.json({ success: false, message: "Pilih siswa, tanggal lulus, dan tahun ajaran wajib diisi!" }, { status: 400 });
    }

    // Simpan ke tabel Kelulusan
    const kelulusanBaru = await prisma.kelulusan.create({
      data: {
        santriId: String(santriId),
        tanggalLulus: String(tanggalLulus),
        tahunAjaran: String(tahunAjaran),
        noSuratKelulusan: noSuratKelulusan ? String(noSuratKelulusan) : null,
        noIjazah: noIjazah ? String(noIjazah) : null,
        melanjutkanKe: melanjutkanKe ? String(melanjutkanKe) : null,
        keterangan: keterangan ? String(keterangan) : null,
      }
    });

    return NextResponse.json({ success: true, message: "Data kelulusan berhasil diproses.", data: kelulusanBaru }, { status: 201 });

  } catch (error: any) {
    let errorMsg = error?.message || String(error);
    // Jika santriId sudah ada di tabel kelulusan (karena relasinya @unique)
    if (errorMsg.includes("Unique constraint failed")) {
      errorMsg = "Gagal! Siswa ini sudah pernah diproses kelulusannya.";
    }
    return NextResponse.json({ success: false, message: errorMsg, errorDetail: String(error) }, { status: 500 });
  }
}