import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function BantuanPage() {
  const listBantuan = await prisma.bantuanLembaga.findMany({ orderBy: { tahun: 'desc' } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Kelembagaan</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Bantuan</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Riwayat Bantuan Lembaga</h1>
          </div>
          <Link href="/dashboard/kelembagaan/bantuan/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Catat Bantuan
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">TAHUN</th>
                <th className="p-4 font-bold">NAMA BANTUAN</th>
                <th className="p-4 font-bold">SUMBER INSTANSI</th>
                <th className="p-4 font-bold">NOMINAL / WUJUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listBantuan.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada riwayat bantuan tercatat.</td></tr>
              ) : (
                listBantuan.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{b.tahun}</td>
                    <td className="p-4 font-bold text-blue-700 uppercase">{b.namaBantuan}</td>
                    <td className="p-4 text-gray-700">{b.sumberBantuan}</td>
                    <td className="p-4 font-semibold text-gray-800">{b.nominalWujud}</td>
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