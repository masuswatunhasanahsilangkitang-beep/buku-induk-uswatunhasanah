import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function PengawasPage() {
  const listPengawas = await prisma.pengawas.findMany({ orderBy: { namaLengkap: 'asc' } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Kelembagaan</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Pengawas</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Pengawas & Komite</h1>
          </div>
          <Link href="/dashboard/kelembagaan/pengawas/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Data
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">NAMA LENGKAP</th>
                <th className="p-4 font-bold">JABATAN</th>
                <th className="p-4 font-bold">INSTANSI</th>
                <th className="p-4 font-bold">KONTAK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listPengawas.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data pengawas/komite.</td></tr>
              ) : (
                listPengawas.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800 uppercase">{p.namaLengkap} <br/><span className="text-[10px] text-gray-400">{p.nip ? `NIP. ${p.nip}` : ""}</span></td>
                    <td className="p-4 text-blue-700 font-semibold">{p.jabatan}</td>
                    <td className="p-4 text-gray-600">{p.instansi || "-"}</td>
                    <td className="p-4 font-medium text-gray-800">{p.noHp || "-"}</td>
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