import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PerpustakaanPage() {
  const listBuku = await prisma.perpustakaan.findMany({ 
    orderBy: { judulBuku: 'asc' } 
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/sarpras" className="hover:text-emerald-600">Sarpras</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Perpustakaan</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Koleksi Perpustakaan</h1>
          </div>
          <Link href="/dashboard/sarpras/perpustakaan/tambah" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Koleksi Buku
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">JUDUL BUKU & KATEGORI</th>
                <th className="p-4 font-bold">PENULIS / PENERBIT</th>
                <th className="p-4 font-bold text-center">TAHUN</th>
                <th className="p-4 font-bold text-center border-l border-gray-100">TOTAL</th>
                <th className="p-4 font-bold text-center text-emerald-600">BAIK</th>
                <th className="p-4 font-bold text-center text-red-600">RUSAK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listBuku.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada koleksi buku tercatat.</td></tr>
              ) : (
                listBuku.map((buku) => (
                  <tr key={buku.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold text-gray-800 uppercase">{buku.judulBuku}</p>
                      <p className="text-[10px] font-semibold text-emerald-600 mt-1">{buku.kategori}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-700">{buku.pengarang || "Anonim"}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{buku.penerbit || "-"}</p>
                    </td>
                    <td className="p-4 text-center font-mono text-xs text-gray-600">{buku.tahunTerbit || "-"}</td>
                    <td className="p-4 text-center font-black text-gray-800 text-lg bg-gray-50/50 border-l border-gray-100">{buku.jumlahTotal}</td>
                    <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/30">{buku.kondisiBaik}</td>
                    <td className="p-4 text-center font-bold text-red-600 bg-red-50/30">{buku.kondisiRusak}</td>
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