import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function RombelPage() {
  // 1. Ambil semua data Rombel beserta Wali Kelas dan jumlah siswa di dalamnya
  const listRombel = await prisma.rombel.findMany({
    include: {
      waliKelas: true,
      siswa: true,
    },
    orderBy: { namaRombel: 'asc' }
  });

  // 2. Ambil siswa yang BELUM dimasukkan ke rombel mana pun (rombelId === null)
  const siswaBelumMasuk = await prisma.santri.findMany({
    where: { rombelId: null },
    select: { id: true, namaLengkap: true, nisn: true }
  });

  return (
    <div className="p-8 bg-gray-50/50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= HEADER & NAVIGASI ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <span>Dashboard</span>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Rombongan Belajar</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Manajemen Rombongan Belajar (Rombel)</h1>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/rombel/tambah" 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Buat Rombel Baru
            </Link>
          </div>
        </div>

        {/* ================= STATISTIK KELAS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">🏫</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Rombel</p>
              <h3 className="text-2xl font-black text-gray-800">{listRombel.length} Kelas</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">⚠️</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Belum Masuk Kelas</p>
              <h3 className="text-2xl font-black text-amber-600">{siswaBelumMasuk.length} Siswa</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">📅</div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tahun Ajaran Aktif</p>
              <h3 className="text-lg font-black text-gray-800">2026/2027 - Ganjil</h3>
            </div>
          </div>
        </div>

        {/* ================= KARTU DAFTAR KELAS (ROMBEL) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* KARTU KHUSUS: SISWA BELUM MASUK KELAS */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-amber-200 overflow-hidden flex flex-col justify-between">
            <div className="p-6 bg-amber-50/50 border-b border-amber-100">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black tracking-wider uppercase rounded-md">Perlu Tindakan</span>
              <h3 className="text-xl font-black text-gray-800 mt-2">BELUM MASUK KELAS</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Siswa yang belum ditempatkan di rombel mana pun</p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
              <span className="text-4xl font-black text-amber-600 mb-1">{siswaBelumMasuk.length}</span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Siswa Terdaftar</p>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
              <Link 
                href="/dashboard/rombel/belum-masuk" 
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold text-center shadow-sm transition-colors"
              >
                Kelola & Masukkan ke Kelas →
              </Link>
            </div>
          </div>

          {/* KARTU DAFTAR ROMBEL AKTIF */}
          {listRombel.map((rombel) => (
            <div key={rombel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:border-blue-200 transition-all">
              <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black tracking-wider uppercase rounded-md border border-blue-100">
                    {rombel.tingkat}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">{rombel.tahunAjaran}</span>
                </div>
                <h3 className="text-xl font-black text-gray-800 mt-2 uppercase">{rombel.namaRombel}</h3>
                <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
                  👨‍🏫 Wali Kelas: <span className="text-gray-800">{rombel.waliKelas?.namaLengkap || <span className="italic text-amber-500">Belum ditentukan</span>}</span>
                </p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
                <span className="text-4xl font-black text-blue-600 mb-1">{rombel.siswa.length}</span>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Siswa di Kelas Ini</p>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                <Link 
                  href={`/dashboard/rombel/detail/${rombel.id}`} 
                  className="w-full py-2.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Lihat Daftar Siswa
                </Link>
              </div>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}