import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function InventarisPage() {
  const listBarang = await prisma.barangInventaris.findMany({ 
    include: { ruangan: true },
    orderBy: { namaBarang: 'asc' } 
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Sarpras</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Inventaris</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Inventaris Barang</h1>
          </div>
          <Link href="/dashboard/sarpras/inventaris/tambah" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Catat Barang
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">KODE & NAMA BARANG</th>
                <th className="p-4 font-bold">LOKASI RUANGAN</th>
                <th className="p-4 font-bold text-center">TOTAL</th>
                <th className="p-4 font-bold text-center bg-emerald-50 text-emerald-700">BAIK</th>
                <th className="p-4 font-bold text-center bg-amber-50 text-amber-700">RUSAK RINGAN</th>
                <th className="p-4 font-bold text-center bg-red-50 text-red-700">RUSAK BERAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listBarang.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data inventaris.</td></tr>
              ) : (
                listBarang.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold text-gray-800 uppercase">{b.namaBarang}</p>
                      <p className="text-[10px] text-gray-400">{b.kodeBarang || "Tanpa Kode"}</p>
                    </td>
                    <td className="p-4 text-gray-600">{b.ruangan?.namaRuangan || <span className="italic text-gray-400">Belum Ditempatkan</span>}</td>
                    <td className="p-4 font-black text-center text-gray-800">{b.jumlahTotal}</td>
                    <td className="p-4 font-bold text-center text-emerald-600 bg-emerald-50/30">{b.kondisiBaik}</td>
                    <td className="p-4 font-bold text-center text-amber-600 bg-amber-50/30">{b.kondisiRusakRingan}</td>
                    <td className="p-4 font-bold text-center text-red-600 bg-red-50/30">{b.kondisiRusakBerat}</td>
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