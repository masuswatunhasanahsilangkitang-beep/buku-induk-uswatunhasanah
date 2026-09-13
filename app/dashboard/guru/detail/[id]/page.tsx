import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DetailGuruPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: paramId } = await params;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);

  const pegawai = await prisma.guru.findUnique({
    where: { id: id as any },
    include: {
      riwayatKepegawaian: true,
      riwayatPendidikan: true,
      tugasPembelajaran: true,
      riwayatDiklat: true,
    }
  }).catch(() => null);

  if (!pegawai) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans space-y-6">
      
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black">
            {pegawai.namaLengkap.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800">{pegawai.namaLengkap}</h1>
            <p className="text-sm font-medium text-gray-500">{pegawai.jabatan} | NIK: {pegawai.nik || "-"}</p>
          </div>
        </div>
        <Link href="/dashboard/guru" className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm">Kembali</Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-800 border-b pb-3 mb-4 uppercase tracking-wider">Data Diri</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">NUPTK</span><span className="font-bold text-gray-800">{pegawai.nuptk || "-"}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">TTL</span><span className="font-bold text-gray-800">{pegawai.tempatLahir}, {pegawai.tanggalLahir}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">Agama</span><span className="font-bold text-gray-800">{pegawai.agama}</span></div>
              <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 font-medium">No. HP</span><span className="font-bold text-gray-800">{pegawai.noHp || "-"}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 font-medium">Status</span><span className="font-bold text-emerald-600">{pegawai.statusPegawai || "-"}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Riwayat Kepegawaian</h2>
              {/* Link Tambah Kepegawaian Sudah Dinyalakan */}
              <Link href={`/dashboard/guru/detail/${id}/tambah-kepegawaian`} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded font-bold transition-colors">+ Tambah</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <th className="p-3 font-bold">Tgl Efektif</th>
                    <th className="p-3 font-bold">Jabatan</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold">Jenis SK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pegawai.riwayatKepegawaian.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-400 font-medium">Tidak ada data riwayat kepegawaian</td></tr>
                  ) : (
                    pegawai.riwayatKepegawaian.map((rw: any) => (
                      <tr key={rw.id}>
                        <td className="p-3 font-medium text-gray-800">{rw.tanggalEfektif}</td>
                        <td className="p-3 text-gray-600">{rw.fungsiJabatan}</td>
                        <td className="p-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] rounded uppercase font-bold">{rw.statusKeaktifan}</span></td>
                        <td className="p-3 text-gray-600">{rw.jenisSk}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Riwayat Pendidikan</h2>
              {/* Link Tambah Pendidikan Sudah Dinyalakan */}
              <Link href={`/dashboard/guru/detail/${id}/tambah-pendidikan`} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded font-bold transition-colors">+ Tambah</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                    <th className="p-3 font-bold">Jenjang</th>
                    <th className="p-3 font-bold">Nama Sekolah / PT</th>
                    <th className="p-3 font-bold">Jurusan</th>
                    <th className="p-3 font-bold">Lulus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pegawai.riwayatPendidikan.length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-400 font-medium">Tidak ada data riwayat pendidikan</td></tr>
                  ) : (
                    pegawai.riwayatPendidikan.map((rw: any) => (
                      <tr key={rw.id}>
                        <td className="p-3 font-bold text-gray-800">{rw.jenjang}</td>
                        <td className="p-3 text-gray-600">{rw.namaSekolah}</td>
                        <td className="p-3 text-gray-600">{rw.jurusan}</td>
                        <td className="p-3 text-gray-600">{rw.tahunLulus}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}