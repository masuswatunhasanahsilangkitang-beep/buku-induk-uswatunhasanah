import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function GedungPage() {
  const listGedung = await prisma.gedung.findMany({ 
    include: { lahan: true },
    orderBy: { namaGedung: 'asc' } 
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/sarpras/asset-tetap" className="hover:text-blue-600">Asset Tetap</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Gedung</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Data Gedung & Bangunan</h1>
          </div>
          <Link href="/dashboard/sarpras/asset-tetap/gedung/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Gedung
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">NAMA GEDUNG & TAHUN</th>
                {/* LABEL DIUBAH DI SINI */}
                <th className="p-4 font-bold">LOKASI (NAMA LEMBAGA / LAHAN)</th>
                <th className="p-4 font-bold text-center">SPESIFIKASI</th>
                <th className="p-4 font-bold text-center">KONDISI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listGedung.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data gedung tercatat.</td></tr>
              ) : (
                listGedung.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold text-gray-800 uppercase">{g.namaGedung}</p>
                      <p className="text-xs text-gray-500 mt-1">Berdiri Tahun: {g.tahunDibangun || "-"}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-blue-700">{g.lahan?.namaLahan || "Tidak ada Lokasi"}</p>
                      <p className="text-[10px] text-gray-400 uppercase mt-0.5">Status: {g.kepemilikan}</p>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex gap-2 text-xs font-semibold text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">PxL: {g.panjang || 0}x{g.lebar || 0}m</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{g.jumlahLantai} Lantai</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        g.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 
                        g.kondisi?.includes('Ringan') ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {g.kondisi}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}