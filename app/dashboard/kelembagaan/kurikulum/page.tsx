import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function KurikulumPage() {
  const listKurikulum = await prisma.kurikulum.findMany({ orderBy: { tahunAjaran: 'desc' } });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Kelembagaan</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Kurikulum</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Manajemen Kurikulum</h1>
          </div>
          <Link href="/dashboard/kelembagaan/kurikulum/tambah" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
            + Tambah Kurikulum
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">TAHUN AJARAN</th>
                <th className="p-4 font-bold">JENIS KURIKULUM</th>
                <th className="p-4 font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listKurikulum.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-gray-400 text-xs font-semibold">Belum ada data kurikulum.</td></tr>
              ) : (
                listKurikulum.map((k) => (
                  <tr key={k.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{k.tahunAjaran}</td>
                    <td className="p-4 text-gray-700 uppercase">{k.jenisKurikulum}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${k.statusAktif ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {k.statusAktif ? "AKTIF" : "TIDAK AKTIF"}
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