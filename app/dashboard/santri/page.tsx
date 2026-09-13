import prisma from "@/lib/prisma";
import Link from "next/link";
import TombolAksi from "./TombolAksi";

export default async function DaftarSantriPage() {
  // Menarik seluruh data santri/siswa dari database
  const daftarSantri = await prisma.santri.findMany({
    orderBy: { createdAt: 'desc' }
  }).catch(() => []); // .catch agar tidak error jika tabel kosong/belum siap

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Tabel */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800">Data Siswa (Buku Induk)</h1>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Kelola informasi profil, mutasi, dan kelulusan siswa.
            </p>
          </div>
          <Link 
            href="/dashboard/santri/tambah" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            + Tambah Data Siswa
          </Link>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-bold">Nama Lengkap</th>
                <th className="p-4 font-bold">NISN / NIS</th>
                <th className="p-4 font-bold">Jenis Kelamin</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {daftarSantri.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-gray-500 font-bold">Belum ada data siswa.</p>
                    <p className="text-sm text-gray-400 mt-1">Silakan klik tombol "Tambah Data Siswa" di kanan atas.</p>
                  </td>
                </tr>
              ) : (
                daftarSantri.map((siswa: any) => (
                  <tr key={siswa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-gray-800 text-sm">
                      {siswa.namaLengkap || siswa.nama || "-"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {siswa.nisn || "-"} / {siswa.nis || "-"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {siswa.jenisKelamin || "-"}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs rounded font-bold uppercase">
                        Aktif
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <TombolAksi id={siswa.id} />
                      </div>
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