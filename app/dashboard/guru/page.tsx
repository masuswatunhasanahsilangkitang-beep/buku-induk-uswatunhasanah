import prisma from "@/lib/prisma";
import Link from "next/link";
import TombolAksi from "./TombolAksi";

export default async function GuruPage() {
  const dataPegawai = await prisma.guru.findMany({
    orderBy: { id: 'desc' }
  }).catch(() => []);

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Data Guru & Tendik</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Kelola informasi dewan guru dan tenaga kependidikan MAS PP Uswatun Hasanah
          </p>
        </div>
        <Link 
          href="/dashboard/guru/tambah" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Data
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Nama Pegawai</th>
                <th className="p-4 font-bold">NIP / NIK</th>
                <th className="p-4 font-bold">Kategori</th>
                <th className="p-4 font-bold">Jabatan</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {dataPegawai.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <p className="font-bold text-gray-500">Belum Ada Data Pegawai</p>
                  </td>
                </tr>
              ) : (
                dataPegawai.map((pegawai: any) => (
                  <tr key={pegawai.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800">{pegawai.namaLengkap}</td>
                    <td className="p-4 text-gray-600 font-medium">{pegawai.nip || "-"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                        pegawai.kategoriTugas === 'Guru' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {pegawai.kategoriTugas === 'Guru' ? 'Tenaga Pendidik' : 'Tendik'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{pegawai.jabatan}</td>
                    <td className="p-4">
                      <TombolAksi id={pegawai.id} />
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