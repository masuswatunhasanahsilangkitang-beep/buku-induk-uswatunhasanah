import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AssetLancarPage() {
  const listAset = await prisma.asetLancar.findMany({ 
    orderBy: { namaBarang: 'asc' } 
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/sarpras" className="hover:text-amber-600">Sarpras</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Asset Lancar</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Data Persediaan (Asset Lancar)</h1>
          </div>
          <Link href="/dashboard/sarpras/asset-lancar/tambah" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Stok
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">KODE & NAMA BARANG</th>
                <th className="p-4 font-bold">KATEGORI</th>
                <th className="p-4 font-bold text-center border-l border-gray-100">SISA STOK</th>
                <th className="p-4 font-bold">SUMBER DANA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listAset.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data persediaan tercatat.</td></tr>
              ) : (
                listAset.map((aset) => (
                  <tr key={aset.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-mono text-xs text-gray-500 mb-0.5">{aset.kodeBarang || "TANPA KODE"}</p>
                      <p className="font-bold text-gray-800 uppercase">{aset.namaBarang}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">{aset.kategori}</span>
                    </td>
                    <td className="p-4 text-center border-l border-gray-100">
                      <span className="font-black text-amber-600 text-lg">{aset.jumlahStok}</span>
                      <span className="text-xs text-gray-500 ml-1 font-semibold">{aset.satuan}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-700">{aset.sumberDana || "-"}</p>
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] truncate">{aset.keterangan}</p>
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