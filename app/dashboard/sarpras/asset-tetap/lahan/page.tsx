import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function LahanPage() {
  const listLahan = await prisma.lahan.findMany({ orderBy: { namaLahan: 'asc' } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/sarpras/asset-tetap" className="hover:text-blue-600">Asset Tetap</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Lokasi / Lembaga</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Data Lokasi Lembaga / Lahan</h1>
          </div>
          <Link href="/dashboard/sarpras/asset-tetap/lahan/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Lokasi
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">NAMA LEMBAGA / LOKASI & ALAMAT</th>
                <th className="p-4 font-bold">SERTIFIKAT / STATUS</th>
                <th className="p-4 font-bold text-center border-l border-gray-100">TOTAL LUAS</th>
                <th className="p-4 font-bold text-center bg-emerald-50 text-emerald-700">DIGUNAKAN</th>
                <th className="p-4 font-bold text-center bg-amber-50 text-amber-700">SISA LAHAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listLahan.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data lembaga/lokasi tercatat.</td></tr>
              ) : (
                listLahan.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-black text-blue-900 uppercase">{l.namaLahan}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">{l.alamatLahan || "-"}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-mono text-xs text-gray-600 mb-1">{l.noSertifikat || "Tanpa Sertifikat"}</p>
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-gray-200 text-gray-700">
                        {l.statusTanah}
                      </span>
                    </td>
                    <td className="p-4 text-center font-black text-gray-800 border-l border-gray-100">{l.luas ? `${l.luas} m²` : "-"}</td>
                    <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/30">{l.luasDigunakan ? `${l.luasDigunakan} m²` : "-"}</td>
                    <td className="p-4 text-center font-bold text-amber-600 bg-amber-50/30">{l.luasBelumDigunakan ? `${l.luasBelumDigunakan} m²` : "-"}</td>
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