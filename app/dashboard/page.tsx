import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardUtama() {
  // 1. Menarik seluruh data dari database
  const totalSiswa = await prisma.santri.count().catch(() => 0); 
  const totalGuru = await prisma.guru.count({ where: { kategoriTugas: "Guru" } }).catch(() => 0);
  const totalTendik = await prisma.guru.count({ where: { kategoriTugas: "Tendik" } }).catch(() => 0);
  
  const totalPegawai = totalGuru + totalTendik;
  const totalWargaSekolah = totalSiswa + totalGuru + totalTendik;

  // 2. Kalkulasi persentase untuk Grafik
  const persenGuruPegawai = totalPegawai > 0 ? ((totalGuru / totalPegawai) * 100).toFixed(1) : "0.0";
  const persenTendikPegawai = totalPegawai > 0 ? ((totalTendik / totalPegawai) * 100).toFixed(1) : "0.0";

  const persenSiswa = totalWargaSekolah > 0 ? (totalSiswa / totalWargaSekolah) * 100 : 0;
  const persenGuru = totalWargaSekolah > 0 ? (totalGuru / totalWargaSekolah) * 100 : 0;
  const persenTendik = totalWargaSekolah > 0 ? (totalTendik / totalWargaSekolah) * 100 : 0;

  const pieChartStyle = {
    background: totalWargaSekolah > 0 
      ? `conic-gradient(
          #3b82f6 0% ${persenSiswa}%, 
          #10b981 ${persenSiswa}% ${persenSiswa + persenGuru}%, 
          #f59e0b ${persenSiswa + persenGuru}% 100%
        )`
      : '#f3f4f6' 
  };

  // =========================================================
  // DATA BARU: JADWAL & ABSENSI HARI INI
  // =========================================================
  const today = new Date();
  const todayStrDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const hariIniString = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(today);
  const tanggalLengkap = new Intl.DateTimeFormat('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(today);

  const jadwalHariIni = await prisma.jadwalKegiatan.findMany({
    where: { hari: hariIniString, isActive: true },
    orderBy: { jamMulai: 'asc' }
  }).catch(() => []);

 // Ambil Data Absen Hari Ini (Group By Status) - Dilengkapi Safe Check
  const absenSiswa = prisma.absensiSantri 
    ? await prisma.absensiSantri.groupBy({ by: ['status'], where: { tanggal: todayStrDate }, _count: true }).catch(() => []) 
    : [];
    
  const absenGuru = prisma.absensiGuru 
    ? await prisma.absensiGuru.groupBy({ by: ['status'], where: { tanggal: todayStrDate }, _count: true }).catch(() => []) 
    : [];
  const formatAbsen = (data: any[]) => {
    const res = { Hadir: 0, Terlambat: 0, Sakit: 0, Izin: 0, Alfa: 0 };
    data.forEach(item => { if (res[item.status as keyof typeof res] !== undefined) res[item.status as keyof typeof res] = item._count; });
    return res;
  };

  const rekapSiswa = formatAbsen(absenSiswa);
  const rekapGuru = formatAbsen(absenGuru);

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen font-sans">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Dashboard Utama</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Sistem Informasi Buku Induk • Yayasan Pondok Pesantren Salafiyah Uswatun Hasanah
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">{tanggalLengkap}</p>
        </div>
      </div>

      {/* ===================================================== */}
      {/* SECTION WIDGET ABSENSI BARU */}
      {/* ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Jadwal Hari Ini */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
          <h3 className="font-bold text-gray-800 border-b pb-3 mb-4 flex justify-between items-center">
            <span>🗓️ Jadwal Sesi Hari Ini</span>
            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold">{jadwalHariIni.length} Sesi Aktif</span>
          </h3>
          
          {jadwalHariIni.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">Tidak ada jadwal tercatat hari ini.</div>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
              {jadwalHariIni.map((j) => (
                <div key={j.id} className="p-3 border border-gray-100 rounded-xl bg-gray-50 flex gap-3 items-center">
                  <div className="text-center bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm min-w-[65px]">
                    <div className="text-xs font-bold text-blue-600">{j.jamMulai}</div>
                    <div className="text-[9px] text-gray-400 font-mono">s/d {j.jamSelesai}</div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{j.namaKegiatan}</p>
                    <p className="text-[10px] text-gray-500">{j.jenisKegiatan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Rekap Absensi Hari Ini */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 border-b pb-3 mb-4 flex justify-between items-center">
            <span>📊 Monitor Kehadiran Real-time</span>
            <Link href="/dashboard/absensi/rekap" className="text-xs text-blue-600 hover:underline">Lihat Detail Rekap &rarr;</Link>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rekap Siswa */}
            <div className="space-y-3 border-r md:border-gray-100 md:pr-4">
              <p className="text-xs font-bold text-blue-600 bg-blue-50 py-1 px-2 rounded inline-block uppercase tracking-wide">Status Siswa</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Hadir</span> <span className="font-black text-emerald-600">{rekapSiswa.Hadir}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Terlambat</span> <span className="font-black text-orange-500">{rekapSiswa.Terlambat}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Sakit</span> <span className="font-black text-blue-500">{rekapSiswa.Sakit}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Izin</span> <span className="font-black text-purple-500">{rekapSiswa.Izin}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between col-span-2"><span className="text-gray-500 text-xs font-bold">Alfa / Tanpa Keterangan</span> <span className="font-black text-red-500">{rekapSiswa.Alfa}</span></div>
              </div>
            </div>

            {/* Rekap Guru */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-purple-600 bg-purple-50 py-1 px-2 rounded inline-block uppercase tracking-wide">Status Guru & Tendik</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Hadir</span> <span className="font-black text-emerald-600">{rekapGuru.Hadir}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Terlambat</span> <span className="font-black text-orange-500">{rekapGuru.Terlambat}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Sakit</span> <span className="font-black text-blue-500">{rekapGuru.Sakit}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between"><span className="text-gray-500 text-xs font-bold">Izin</span> <span className="font-black text-purple-500">{rekapGuru.Izin}</span></div>
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between col-span-2"><span className="text-gray-500 text-xs font-bold">Alfa / Tanpa Keterangan</span> <span className="font-black text-red-500">{rekapGuru.Alfa}</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* ===================================================== */}

      {/* Kartu Statistik Utama (Asli) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Kartu Siswa */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center text-2xl">🎓</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Siswa</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-800">{totalSiswa}</span>
            </div>
          </div>
        </div>

        {/* Kartu Guru */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center text-2xl">👨‍🏫</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dewan Guru</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-800">{totalGuru}</span>
            </div>
          </div>
        </div>

        {/* Kartu Tendik */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-2xl">💼</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Tendik</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-800">{totalTendik}</span>
            </div>
          </div>
        </div>

        {/* Kartu Warga Sekolah */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Populasi</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-800">{totalWargaSekolah}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bagian Bawah: Grafik Batang & Grafik Lingkaran (Asli) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom Kiri: Komposisi Pegawai (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-1">Komposisi Pegawai</h2>
          <p className="text-xs font-medium text-gray-500 mb-8">Distribusi internal antara Dewan Guru dan Tendik aktif</p>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">Dewan Guru</span>
                <span className="text-emerald-600">{totalGuru} Orang ({persenGuruPegawai}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${persenGuruPegawai}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">Tenaga Kependidikan</span>
                <span className="text-amber-500">{totalTendik} Orang ({persenTendikPegawai}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-amber-400 h-3 rounded-full transition-all duration-1000" style={{ width: `${persenTendikPegawai}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
             <Link href="/dashboard/guru" className="text-sm font-bold text-blue-600 hover:text-blue-800">Kelola Data Pegawai →</Link>
          </div>
        </div>

        {/* Kolom Kanan: Demografi Keseluruhan (Pie Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-black text-gray-800 mb-1">Demografi Warga Sekolah</h2>
          <p className="text-xs font-medium text-gray-500 mb-8">Perbandingan proporsi Siswa, Guru, dan Tendik</p>
          
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
            
            {/* Lingkaran (Pie) */}
            <div 
              className="w-48 h-48 rounded-full shadow-inner transform transition-transform hover:scale-105"
              style={pieChartStyle}
            ></div>

            {/* Keterangan Warna (Legend) */}
            <div className="space-y-4 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                <div className="text-sm font-bold text-gray-700 flex-1">Siswa</div>
                <div className="text-sm font-black text-gray-900">{persenSiswa.toFixed(1)}%</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
                <div className="text-sm font-bold text-gray-700 flex-1">Guru</div>
                <div className="text-sm font-black text-gray-900">{persenGuru.toFixed(1)}%</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
                <div className="text-sm font-bold text-gray-700 flex-1">Tendik</div>
                <div className="text-sm font-black text-gray-900">{persenTendik.toFixed(1)}%</div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}