import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function GedungPage() {
  const listGedung = await prisma.gedung.findMany({ orderBy: { namaGedung: 'asc' } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Sarpras</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Gedung</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Data Gedung & Bangunan</h1>
          </div>
          <Link href="/dashboard/sarpras/gedung/tambah" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Gedung
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">NAMA GEDUNG</th>
                <th className="p-4 font-bold">TAHUN BANGUN</th>
                <th className="p-4 font-bold">LUAS TANAH</th>
                <th className="p-4 font-bold">KONDISI FISIK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listGedung.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data gedung.</td></tr>
              ) : (
                listGedung.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800 uppercase">{g.namaGedung}</td>
                    <td className="p-4 text-gray-600">{g.tahunBangun || "-"}</td>
                    <td className="p-4 text-gray-600">{g.luasTanah || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        g.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 
                        g.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
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