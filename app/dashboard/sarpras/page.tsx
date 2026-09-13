import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function SarprasRootPage() {
  // Menggunakan tabel yang benar sesuai skema 13 Menu EMIS terbaru
  const totalLahan = await prisma.lahan.count();
  const totalGedung = await prisma.gedung.count();
  const totalAsetLancar = await prisma.asetLancar.count();
  const totalBuku = await prisma.perpustakaan.aggregate({
    _sum: { jumlahTotal: true }
  });

  // Menggabungkan hitungan lahan dan gedung untuk ringkasan menu utama
  const totalAsetTetap = totalLahan + totalGedung;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Dashboard</span> &gt; <span className="font-semibold text-gray-600">Sarpras</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Sarana & Prasarana</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <Link href="/dashboard/sarpras/asset-tetap" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-lg font-black text-gray-800 group-hover:text-blue-600 transition-colors uppercase">Asset Tetap</h3>
              <p className="text-sm text-gray-500 mt-1">Kelola data 13 Kategori EMIS (Lahan, Gedung, Ruangan, Mebel, dll).</p>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs font-bold text-gray-500 uppercase">
              <span className="bg-gray-100 px-2 py-1 rounded">{totalAsetTetap} Data Utama</span>
              <span className="text-blue-600 tracking-wider">Kelola Asset →</span>
            </div>
          </Link>

          <Link href="/dashboard/sarpras/asset-lancar" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">📦</div>
              <h3 className="text-lg font-black text-gray-800 group-hover:text-amber-600 transition-colors uppercase">Asset Lancar</h3>
              <p className="text-sm text-gray-500 mt-1">Pendataan barang habis pakai seperti ATK, bahan kebersihan, dan persediaan lainnya.</p>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs font-bold text-gray-500 uppercase">
              <span className="bg-gray-100 px-2 py-1 rounded">{totalAsetLancar} Data</span>
              <span className="text-amber-600 tracking-wider">Kelola Asset →</span>
            </div>
          </Link>

          <Link href="/dashboard/sarpras/perpustakaan" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">📚</div>
              <h3 className="text-lg font-black text-gray-800 group-hover:text-emerald-600 transition-colors uppercase">Perpustakaan</h3>
              <p className="text-sm text-gray-500 mt-1">Manajemen koleksi buku teks, fiksi, jurnal, referensi, dan literatur madrasah.</p>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs font-bold text-gray-500 uppercase">
              <span className="bg-gray-100 px-2 py-1 rounded">{totalBuku._sum.jumlahTotal || 0} Buku</span>
              <span className="text-emerald-600 tracking-wider">Kelola Buku →</span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}