import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CetakButton from "./CetakButton";

export default async function DetailRombelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const rombelId = resolvedParams.id;

  // Menarik data rombel beserta wali kelas dan daftar siswa di dalamnya
  const rombel = await prisma.rombel.findUnique({
    where: { id: rombelId },
    include: {
      waliKelas: true,
      siswa: {
        orderBy: { namaLengkap: 'asc' } // Mengurutkan siswa berdasarkan abjad
      },
    }
  });

  if (!rombel) {
    notFound();
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans print:p-0 print:bg-white">
      <div className="max-w-5xl mx-auto space-y-6 print:space-y-0">
        
        {/* ================= HEADER NAVIGASI (Sembunyi saat dicetak) ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4 print:hidden">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/rombel" className="hover:text-blue-600 transition-colors">Rombongan Belajar</Link> 
              <span>&gt;</span> 
              <span className="font-semibold text-gray-600">Detail Kelas</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">
              Daftar Siswa <span className="uppercase text-blue-700">{rombel.namaRombel}</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/rombel" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
              Kembali
            </Link>
            <CetakButton />
          </div>
        </div>

        {/* ================= KOP DOKUMEN CETAK ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:border-none print:shadow-none">
          
          <div className="p-6 border-b border-gray-200 bg-blue-50/30 print:bg-white print:border-b-2 print:border-black flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-wider text-gray-800 print:text-black">
                {rombel.namaRombel}
              </h2>
              <p className="text-sm font-bold text-gray-500 mt-1 print:text-black uppercase">
                Tingkat: {rombel.tingkat} | Tahun Ajaran: {rombel.tahunAjaran}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider print:text-gray-600">Wali Kelas</p>
              <p className="font-bold text-gray-800 print:text-black">{rombel.waliKelas?.namaLengkap || "Belum Ditentukan"}</p>
              <p className="text-xs text-gray-500 print:text-gray-700">{rombel.waliKelas?.nip ? `NIP. ${rombel.waliKelas.nip}` : "-"}</p>
            </div>
          </div>

          {/* ================= TABEL DAFTAR SISWA ================= */}
          <div className="p-0 print:pt-4">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider border-b border-gray-200 print:bg-gray-100 print:text-black">
                  <th className="p-4 w-12 text-center font-bold print:border print:border-gray-400">NO</th>
                  <th className="p-4 font-bold print:border print:border-gray-400">NAMA LENGKAP</th>
                  <th className="p-4 font-bold text-center print:border print:border-gray-400">NISN</th>
                  <th className="p-4 font-bold text-center print:border print:border-gray-400">L/P</th>
                  <th className="p-4 font-bold text-center w-32 print:border print:border-gray-400 print:table-cell hidden">KETERANGAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 print:divide-gray-400">
                {rombel.siswa.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-semibold print:border print:border-gray-400">
                      Belum ada siswa di kelas ini.
                    </td>
                  </tr>
                ) : (
                  rombel.siswa.map((s, index) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-center font-semibold text-gray-500 print:border print:border-gray-400 print:text-black">{index + 1}</td>
                      <td className="p-3 font-bold text-gray-800 uppercase print:border print:border-gray-400 print:text-black">{s.namaLengkap}</td>
                      <td className="p-3 text-center text-gray-600 font-medium print:border print:border-gray-400 print:text-black">{s.nisn}</td>
                      <td className="p-3 text-center text-gray-600 font-bold print:border print:border-gray-400 print:text-black">
                        {s.jenisKelamin === "Laki-laki" ? "L" : s.jenisKelamin === "Perempuan" ? "P" : "-"}
                      </td>
                      <td className="p-3 print:border print:border-gray-400 print:table-cell hidden"></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Ringkasan Jumlah (Hanya muncul saat dicetak atau di layar) */}
          <div className="p-6 bg-white flex justify-between text-xs font-bold text-gray-600 print:text-black">
            <p>Total Siswa: {rombel.siswa.length} Orang</p>
            <p>Laki-laki: {rombel.siswa.filter(s => s.jenisKelamin === 'Laki-laki').length} | Perempuan: {rombel.siswa.filter(s => s.jenisKelamin === 'Perempuan').length}</p>
          </div>

        </div>
      </div>
    </div>
  );
}