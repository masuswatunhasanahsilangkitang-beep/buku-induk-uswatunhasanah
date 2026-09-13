import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. GET: Ambil daftar siswa aktif (yang belum dimutasi / masih punya rombel)
export async function GET() {
  try {
    const siswaAktif = await prisma.santri.findMany({
      where: { rombelId: { not: null } }, // Hanya yang masih punya kelas
      include: { rombel: true },
      orderBy: { namaLengkap: 'asc' }
    });
    return NextResponse.json({ success: true, data: siswaAktif }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Gagal memuat data siswa." }, { status: 500 });
  }
}

// 2. POST: Simpan Catatan Mutasi (Kode asli Anda dengan tambahan update status)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { santriId, jenisMutasi, tanggalMutasi, alasan, sekolahTujuan, noSuratMutasi } = body;

    // Validasi data wajib
    if (!santriId || !jenisMutasi || !tanggalMutasi) {
      return NextResponse.json({ success: false, message: "Siswa, jenis mutasi, dan tanggal wajib diisi!" }, { status: 400 });
    }

    // A. Simpan ke tabel MutasiSiswa
    const mutasiBaru = await prisma.mutasiSiswa.create({
      data: {
        santriId: String(santriId),
        jenisMutasi: String(jenisMutasi),
        tanggalMutasi: String(tanggalMutasi),
        alasan: alasan ? String(alasan) : null,
        sekolahTujuan: sekolahTujuan ? String(sekolahTujuan) : null,
        noSuratMutasi: noSuratMutasi ? String(noSuratMutasi) : null,
      }
    });

    // B. (TAMBAHAN PENTING): Cabut siswa dari kelas aktif agar absennya berhenti
    await prisma.santri.update({
      where: { id: String(santriId) },
      data: { rombelId: null }
    });

    return NextResponse.json({ success: true, message: "Data mutasi berhasil dicatat.", data: mutasiBaru }, { status: 201 });

  } catch (error: any) {
    let errorMsg = error?.message || String(error);
    if (errorMsg.includes("Unique constraint failed")) {
      errorMsg = "Gagal! Siswa ini sudah memiliki catatan mutasi sebelumnya.";
    }
    return NextResponse.json({ success: false, message: errorMsg, errorDetail: String(error) }, { status: 500 });
  }
}