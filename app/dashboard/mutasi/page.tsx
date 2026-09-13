import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function MutasiSiswaPage() {
  // Menarik data mutasi beserta nama santri dari relasi database
  const listMutasi = await prisma.mutasiSiswa.findMany({
    include: { santri: true },
    orderBy: { tanggalMutasi: 'desc' }
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
              <span className="font-semibold text-gray-600">Mutasi Siswa</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Daftar Mutasi Siswa</h1>
          </div>
          <Link href="/dashboard/mutasi/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Catat Mutasi Baru
          </Link>
        </div>

        {/* Tabel Data Mutasi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-bold">NAMA SISWA</th>
                  <th className="p-4 font-bold">NISN</th>
                  <th className="p-4 font-bold">JENIS MUTASI</th>
                  <th className="p-4 font-bold">TANGGAL</th>
                  <th className="p-4 font-bold">SEKOLAH TUJUAN / KET</th>
                  <th className="p-4 font-bold text-center">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listMutasi.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 text-xs font-semibold">
                      Belum ada histori mutasi siswa yang tercatat.
                    </td>
                  </tr>
                ) : (
                  listMutasi.map((mutasi) => (
                    <tr key={mutasi.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800 uppercase">{mutasi.santri.namaLengkap}</td>
                      <td className="p-4 text-gray-600 font-medium">{mutasi.santri.nisn}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black tracking-wider uppercase ${
                          mutasi.jenisMutasi === 'Pindah Sekolah' ? 'bg-blue-100 text-blue-700' :
                          mutasi.jenisMutasi === 'Dikeluarkan' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {mutasi.jenisMutasi}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{mutasi.tanggalMutasi}</td>
                      <td className="p-4 text-gray-600 text-xs max-w-xs truncate">{mutasi.sekolahTujuan || mutasi.alasan || "-"}</td>
                      <td className="p-4 flex gap-2 justify-center">
                        <Link href={`/dashboard/mutasi/detail/${mutasi.id}`} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold transition-colors">
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