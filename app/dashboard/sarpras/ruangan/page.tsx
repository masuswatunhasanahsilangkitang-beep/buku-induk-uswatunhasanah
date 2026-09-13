import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function RuanganPage() {
  const listRuangan = await prisma.ruangan.findMany({ 
    include: { gedung: true },
    orderBy: { namaRuangan: 'asc' } 
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Sarpras</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Ruangan</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Manajemen Ruangan</h1>
          </div>
          <Link href="/dashboard/sarpras/ruangan/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Ruangan
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">NAMA RUANGAN</th>
                <th className="p-4 font-bold">JENIS</th>
                <th className="p-4 font-bold">LOKASI GEDUNG</th>
                <th className="p-4 font-bold text-center">KAPASITAS</th>
                <th className="p-4 font-bold">KONDISI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listRuangan.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data ruangan.</td></tr>
              ) : (
                listRuangan.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800 uppercase">{r.namaRuangan}</td>
                    <td className="p-4 text-blue-700 font-semibold">{r.jenisRuangan}</td>
                    <td className="p-4 text-gray-600">{r.gedung?.namaGedung || <span className="text-red-400 italic">Tanpa Gedung</span>}</td>
                    <td className="p-4 text-gray-800 font-bold text-center">{r.kapasitas ? `${r.kapasitas} Org` : "-"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        r.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' : 
                        r.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {r.kondisi}
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