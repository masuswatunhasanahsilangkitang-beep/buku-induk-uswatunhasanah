import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function KelulusanPage() {
  // Menarik data kelulusan (Alumni) beserta nama siswa
  const listKelulusan = await prisma.kelulusan.findMany({
    include: { santri: true },
    orderBy: { tanggalLulus: 'desc' }
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header & Navigasi */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/santri" className="hover:text-blue-600 transition-colors">Siswa</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Kelulusan</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Daftar Kelulusan / Alumni</h1>
          </div>
          <Link href="/dashboard/kelulusan/tambah" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Proses Kelulusan Baru
          </Link>
        </div>

        {/* Tabel Data Kelulusan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-emerald-50 text-emerald-800 text-[10px] uppercase tracking-wider border-b border-emerald-100">
                  <th className="p-4 font-bold">NAMA ALUMNI</th>
                  <th className="p-4 font-bold">NISN</th>
                  <th className="p-4 font-bold">TAHUN AJARAN</th>
                  <th className="p-4 font-bold">TANGGAL LULUS</th>
                  <th className="p-4 font-bold">NOMOR IJAZAH</th>
                  <th className="p-4 font-bold text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listKelulusan.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 text-xs font-semibold">
                      Belum ada data kelulusan / alumni yang tercatat.
                    </td>
                  </tr>
                ) : (
                  listKelulusan.map((lulus) => (
                    <tr key={lulus.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800 uppercase">{lulus.santri.namaLengkap}</td>
                      <td className="p-4 text-gray-600 font-medium">{lulus.santri.nisn}</td>
                      <td className="p-4 text-gray-600 font-medium">{lulus.tahunAjaran}</td>
                      <td className="p-4 text-gray-600 font-medium">{lulus.tanggalLulus}</td>
                      <td className="p-4 text-gray-600 font-medium">{lulus.noIjazah || "-"}</td>
                      <td className="p-4 flex gap-2 justify-center">
                        <Link href={`/dashboard/kelulusan/detail/${lulus.id}`} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold transition-colors">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}