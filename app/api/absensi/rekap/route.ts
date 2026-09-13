import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // 1. Jika frontend hanya meminta daftar Rombel untuk dropdown filter
    if (action === "get_rombel") {
      const rombel = await prisma.rombel.findMany({ orderBy: { namaRombel: "asc" } });
      return NextResponse.json({ success: true, data: rombel });
    }

    // 2. Ambil parameter filter dari frontend
    const kategori = searchParams.get("kategori") || "siswa"; // "siswa" atau "guru"
    const mode = searchParams.get("mode") || "tanggal"; // "tanggal" atau "bulan"
    const filterValue = searchParams.get("filterValue"); // Format: "YYYY-MM-DD" atau "YYYY-MM"
    const rombelId = searchParams.get("rombelId"); // Khusus untuk siswa

    if (!filterValue) {
      return NextResponse.json({ success: false, message: "Parameter tanggal/bulan wajib diisi." }, { status: 400 });
    }

    // ==========================================
    // REKAPITULASI SISWA
    // ==========================================
    if (kategori === "siswa") {
      let whereClause: any = {};
      
      // Filter Tanggal / Bulan
      if (mode === "tanggal") {
        whereClause.tanggal = filterValue;
      } else if (mode === "bulan") {
        whereClause.tanggal = { startsWith: filterValue }; // Mencari awalan "2026-09"
      }

      // Filter Rombel
      if (rombelId && rombelId !== "all") {
        whereClause.santri = { rombelId: rombelId };
      }

      const data = await prisma.absensiSantri.findMany({
        where: whereClause,
        include: { 
          santri: { include: { rombel: true } }, 
          jadwal: true 
        },
        orderBy: [{ tanggal: "desc" }, { waktu: "asc" }]
      });
      return NextResponse.json({ success: true, data });
    } 
    
    // ==========================================
    // REKAPITULASI GURU
    // ==========================================
    if (kategori === "guru") {
      let whereClause: any = {};
      
      if (mode === "tanggal") {
        whereClause.tanggal = filterValue;
      } else if (mode === "bulan") {
        whereClause.tanggal = { startsWith: filterValue };
      }

      const data = await prisma.absensiGuru.findMany({
        where: whereClause,
        include: { guru: true, jadwal: true },
        orderBy: [{ tanggal: "desc" }, { waktu: "asc" }]
      });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, message: "Kategori tidak valid." }, { status: 400 });
  } catch (error: any) {
    console.error("GET Rekap Error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}