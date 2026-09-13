import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

// Kamus untuk menerjemahkan URL menjadi Nama Kategori Database
const mapKategori: Record<string, string> = {
  "air-sanitasi": "Air Sanitasi",
  "mebel": "Mebel",
  "administrasi": "Sarana Administrasi",
  "penunjang": "Perlengkapan Penunjang",
  "olahraga-seni": "Olah Raga & Seni",
  "laboratorium": "Perlengkapan Laboratorium",
  "keterampilan": "Fasilitas Keterampilan",
  "listrik-internet": "Listrik dan Internet",
  "tambahan": "Kebutuhan Tambahan",
  "pembelajaran": "Sarana Pembelajaran",
};

export default async function KategoriAsetPage({ params }: { params: { kategori: string } }) {
  const { kategori } = await params;
  const namaKategori = mapKategori[kategori];

  if (!namaKategori) return notFound(); // Jika URL ngawur, tampilkan halaman 404

  // Ambil data aset hanya untuk kategori yang sedang diklik
  const listAset = await prisma.asetRuangan.findMany({ 
    where: { kategori: namaKategori },
    include: { ruangan: { include: { gedung: true } } },
    orderBy: { namaAset: 'asc' } 
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/sarpras/asset-tetap" className="hover:text-blue-600">Asset Tetap</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600 uppercase">{namaKategori}</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800 uppercase">Data {namaKategori}</h1>
          </div>
          <Link href={`/dashboard/sarpras/asset-tetap/${kategori}/tambah`} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Data
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">NAMA ASET / BARANG</th>
                <th className="p-4 font-bold">LOKASI PENEMPATAN</th>
                <th className="p-4 font-bold text-center">TOTAL</th>
                <th className="p-4 font-bold text-center text-emerald-600">BAIK</th>
                <th className="p-4 font-bold text-center text-red-600">RUSAK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listAset.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data tercatat.</td></tr>
              ) : (
                listAset.map((aset) => (
                  <tr key={aset.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-bold text-gray-800 uppercase">{aset.namaAset}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{aset.keterangan || "-"}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-blue-700">{aset.ruangan?.namaRuangan || "Tanpa Ruangan"}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{aset.ruangan?.gedung?.namaGedung || "Tidak Diketahui"}</p>
                    </td>
                    <td className="p-4 text-center font-black text-gray-800 text-lg bg-gray-50/50">{aset.jumlahTotal}</td>
                    <td className="p-4 text-center font-bold text-emerald-600 bg-emerald-50/30">{aset.kondisiBaik}</td>
                    <td className="p-4 text-center font-bold text-red-600 bg-red-50/30">{aset.kondisiRusak}</td>
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