import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ==========================================
// FUNGSI BANTUAN: Kalkulasi Waktu
// ==========================================
function parseTime(timeStr: string) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return (h * 60) + m;
}

// ==========================================
// GET: Mengambil Riwayat Absensi (Guru & Siswa Digabung)
// ==========================================
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal") || new Date().toISOString().split("T")[0];
    const jenisKegiatan = searchParams.get("jenisKegiatan") || "KBM Harian";

    // Ambil data Siswa & Guru sekaligus
    const dataSantri = await prisma.absensiSantri.findMany({
      where: { tanggal, jenisKegiatan },
      include: { santri: true }
    });

    const dataGuru = await prisma.absensiGuru.findMany({
      where: { tanggal, jenisKegiatan },
      include: { guru: true }
    });

    // Gabungkan, seragamkan formatnya, dan urutkan dari yang terbaru
    const combinedData = [
      ...dataSantri.map(d => ({ ...d, namaLengkap: d.santri.namaLengkap, role: "Siswa" })),
      ...dataGuru.map(d => ({ ...d, namaLengkap: d.guru.namaLengkap, role: "Guru" }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, data: combinedData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ==========================================
// POST: Proses Scan Masuk / Keluar Terpadu
// ==========================================
export async function POST(request: Request) {
  try {
    const textBody = await request.text();
    if (!textBody) return NextResponse.json({ success: false, message: "Data kosong." }, { status: 400 });

    let body;
    try { body = JSON.parse(textBody); } catch (e) { return NextResponse.json({ success: false, message: "Format tidak valid." }, { status: 400 }); }

    const { identifier, status = "Hadir", jenisKegiatan = "KBM Harian", namaKegiatan, jadwalId, keterangan } = body;
    if (!identifier) return NextResponse.json({ success: false, message: "Barcode kosong." }, { status: 400 });

    const today = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
    const currentMinutes = parseTime(currentTime);

    let jadwalAcuan = null;
    if (jadwalId) jadwalAcuan = await prisma.jadwalKegiatan.findUnique({ where: { id: jadwalId } });

    // ==========================================
    // SKENARIO 1: YANG SCAN ADALAH GURU
    // ==========================================
    const guru = await prisma.guru.findFirst({
      where: { OR: [{ id: identifier }, { nip: identifier }, { nik: identifier }] }
    });

    if (guru) {
      let whereClause: any = { guruId: guru.id, tanggal: today };
      if (jadwalId) whereClause.jadwalId = jadwalId;
      else whereClause.jenisKegiatan = jenisKegiatan;

      const existingAbsen = await prisma.absensiGuru.findFirst({ where: whereClause });

      if (existingAbsen) {
        if (!existingAbsen.waktuKeluar) {
          if (jadwalAcuan && currentMinutes < parseTime(jadwalAcuan.jamSelesai)) {
            return NextResponse.json({ success: false, message: `⛔ DITOLAK: Sesi ${jadwalAcuan.namaKegiatan} belum selesai!` }, { status: 400 });
          }
          if ((currentMinutes - parseTime(existingAbsen.waktu)) < 1) {
            return NextResponse.json({ success: false, message: `⏳ Tunggu sebentar. Guru baru saja absen MASUK.` }, { status: 400 });
          }
          
          const updatedAbsen = await prisma.absensiGuru.update({ where: { id: existingAbsen.id }, data: { waktuKeluar: currentTime } });
          return NextResponse.json({ success: true, message: `👋 Berhasil KELUAR: Guru ${guru.namaLengkap}` });
        }
        return NextResponse.json({ success: false, message: `✅ Guru ${guru.namaLengkap} sudah tuntas sesi ini.` }, { status: 400 });
      }

      let statusHadir = status;
      if (jadwalAcuan && currentMinutes > parseTime(jadwalAcuan.jamMulai)) statusHadir = "Terlambat";

      await prisma.absensiGuru.create({
        data: { guruId: guru.id, jadwalId: jadwalId || null, tanggal: today, waktu: currentTime, status: statusHadir, jenisKegiatan, namaKegiatan: namaKegiatan || null }
      });
      return NextResponse.json({ success: true, message: `🔓 SESI DIBUKA: Guru ${guru.namaLengkap} (${statusHadir})` });
    }

    // ==========================================
    // SKENARIO 2: YANG SCAN ADALAH SISWA
    // ==========================================
    const santri = await prisma.santri.findFirst({
      where: { OR: [{ nisn: identifier }, { id: identifier }] }
    });

    if (santri) {
      // ATURAN WAJIB: Cek apakah Guru sudah membuka sesi ini
      let whereGuru: any = { tanggal: today };
      if (jadwalId) whereGuru.jadwalId = jadwalId;
      else whereGuru.jenisKegiatan = jenisKegiatan;

      const guruHadir = await prisma.absensiGuru.findFirst({ where: whereGuru });
      if (!guruHadir) {
        return NextResponse.json({ 
          success: false, 
          message: `⛔ AKSES DITOLAK: Guru belum membuka sesi ini! Silakan scan barcode di meja Guru terlebih dahulu.` 
        }, { status: 400 });
      }

      let whereClause: any = { santriId: santri.id, tanggal: today };
      if (jadwalId) whereClause.jadwalId = jadwalId;
      else whereClause.jenisKegiatan = jenisKegiatan;

      const existingAbsen = await prisma.absensiSantri.findFirst({ where: whereClause });

      if (existingAbsen) {
        if (!existingAbsen.waktuKeluar) {
          if (jadwalAcuan && currentMinutes < parseTime(jadwalAcuan.jamSelesai)) {
            return NextResponse.json({ success: false, message: `⛔ DITOLAK: Sesi ${jadwalAcuan.namaKegiatan} belum selesai!` }, { status: 400 });
          }
          if ((currentMinutes - parseTime(existingAbsen.waktu)) < 1) {
            return NextResponse.json({ success: false, message: `⏳ Tunggu sebentar. ${santri.namaLengkap} baru saja absen MASUK.` }, { status: 400 });
          }
          
          await prisma.absensiSantri.update({ where: { id: existingAbsen.id }, data: { waktuKeluar: currentTime } });
          return NextResponse.json({ success: true, message: `👋 Berhasil KELUAR: ${santri.namaLengkap}` });
        }
        return NextResponse.json({ success: false, message: `✅ ${santri.namaLengkap} sudah tuntas sesi ini.` }, { status: 400 });
      }

      let statusHadir = status;
      if (jadwalAcuan && currentMinutes > parseTime(jadwalAcuan.jamMulai)) statusHadir = "Terlambat";

      await prisma.absensiSantri.create({
        data: { santriId: santri.id, jadwalId: jadwalId || null, tanggal: today, waktu: currentTime, status: statusHadir, jenisKegiatan, namaKegiatan: namaKegiatan || null }
      });
      return NextResponse.json({ success: true, message: `✅ Berhasil MASUK: ${santri.namaLengkap} (${statusHadir})` });
    }

    // Jika Barcode Tidak Dikenali Sama Sekali
    return NextResponse.json({ success: false, message: "❌ Barcode tidak dikenali sebagai Siswa maupun Guru." }, { status: 404 });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Kesalahan server database." }, { status: 500 });
  }
}