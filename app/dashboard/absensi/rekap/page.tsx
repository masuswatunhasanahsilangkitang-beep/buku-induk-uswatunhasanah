"use client";
import { useState, useEffect } from "react";

export default function RekapAbsensiPage() {
  // State Pengaturan Filter
  const [kategori, setKategori] = useState<"siswa" | "guru">("siswa");
  const [mode, setMode] = useState<"tanggal" | "bulan">("tanggal");
  
  // Setup Default Value (Hari ini & Bulan ini)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const monthStr = todayStr.substring(0, 7); // YYYY-MM

  const [filterValue, setFilterValue] = useState(todayStr);
  const [rombelId, setRombelId] = useState("all");
  
  // State Data
  const [dataRombel, setDataRombel] = useState<any[]>([]);
  const [dataRekap, setDataRekap] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Ambil daftar Rombel saat halaman pertama dimuat
  useEffect(() => {
    fetch("/api/absensi/rekap?action=get_rombel")
      .then(res => res.json())
      .then(res => { if (res.success) setDataRombel(res.data); });
  }, []);

  // Sesuaikan nilai input kalender jika mode berganti (Hari <-> Bulan)
  useEffect(() => {
    if (mode === "tanggal") setFilterValue(todayStr);
    else setFilterValue(monthStr);
  }, [mode]);

  // Fungsi utama mengambil data rekap dari API
  const fetchRekap = async () => {
    setLoading(true);
    try {
      const url = `/api/absensi/rekap?kategori=${kategori}&mode=${mode}&filterValue=${filterValue}&rombelId=${rombelId}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setDataRekap(json.data);
      else setDataRekap([]);
    } catch (error) {
      console.error("Gagal memuat rekap", error);
      setDataRekap([]);
    } finally {
      setLoading(false);
    }
  };

  // Otomatis muat ulang data jika salah satu filter diubah pengguna
  useEffect(() => {
    fetchRekap();
  }, [kategori, mode, filterValue, rombelId]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER & PRINT BUTTON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-2">
              <span>Absensi</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Rekapitulasi</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-800">Laporan Rekapitulasi Absensi</h1>
            <p className="text-sm text-gray-500 mt-1">Saring dan pantau kehadiran Siswa dan Guru secara komprehensif.</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-5 py-2.5 bg-gray-800 hover:bg-black text-white font-bold text-sm rounded-lg shadow transition-colors flex items-center gap-2"
          >
            🖨️ Cetak / Simpan PDF
          </button>
        </div>

        {/* AREA FILTER (Sembunyi saat di-print) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 print:hidden space-y-5">
          
          {/* TAB GURU / SISWA */}
          <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setKategori("siswa")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${kategori === 'siswa' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              🎓 Data Siswa
            </button>
            <button 
              onClick={() => setKategori("guru")}
              className={`px-6 py-2 text-sm font-bold rounded-md transition-colors ${kategori === 'guru' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              👨‍🏫 Data Guru
            </button>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            {/* TIPE WAKTU */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Periode</label>
              <select 
                value={mode} 
                onChange={e => setMode(e.target.value as "tanggal" | "bulan")}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
              >
                <option value="tanggal">Per Tanggal / Hari</option>
                <option value="bulan">Per Bulan</option>
              </select>
            </div>

            {/* INPUT KALENDER */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Pilih {mode === 'tanggal' ? 'Tanggal' : 'Bulan'}</label>
              <input 
                type={mode === 'tanggal' ? 'date' : 'month'}
                value={filterValue}
                onChange={e => setFilterValue(e.target.value)}
                className="w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
              />
            </div>

            {/* DROPDOWN ROMBEL (Hanya muncul jika tab Siswa) */}
            {kategori === "siswa" && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Filter Rombel / Kelas</label>
                <select 
                  value={rombelId} 
                  onChange={e => setRombelId(e.target.value)}
                  className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                >
                  <option value="all">Semua Rombel</option>
                  {dataRombel.map(r => (
                    <option key={r.id} value={r.id}>{r.namaRombel} (Tk. {r.tingkat})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* HEADER PRINT (Hanya muncul saat dicetak) */}
        <div className="hidden print:block text-center mb-6 border-b-2 border-black pb-4">
          <h2 className="text-xl font-bold uppercase">Laporan Kehadiran {kategori === 'siswa' ? 'Siswa' : 'Guru'}</h2>
          <p className="text-sm">Periode: {filterValue} {kategori === 'siswa' && rombelId !== 'all' ? `| Rombel Tersaring` : ''}</p>
        </div>

        {/* TABEL DATA REKAPITULASI */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">
          {loading ? (
            <div className="text-center py-16 text-gray-400 font-bold animate-pulse">Memuat Data...</div>
          ) : dataRekap.length === 0 ? (
            <div className="text-center py-16 text-gray-400 italic">Tidak ada data kehadiran pada periode ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 print:text-xs">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b print:bg-white print:border-black print:text-black">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Jadwal / Sesi</th>
                    <th className="px-4 py-3">Nama Lengkap</th>
                    {kategori === "siswa" && <th className="px-4 py-3">Rombel</th>}
                    <th className="px-4 py-3">Jam Masuk</th>
                    <th className="px-4 py-3">Jam Keluar</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 print:divide-black">
                  {dataRekap.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 print:border-b print:border-gray-300">
                      <td className="px-4 py-2.5 font-mono whitespace-nowrap">{item.tanggal}</td>
                      <td className="px-4 py-2.5">
                        <div className="font-bold text-gray-800">{item.jadwal ? item.jadwal.namaKegiatan : item.namaKegiatan}</div>
                        <div className="text-[10px] text-gray-400">{item.jenisKegiatan}</div>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-gray-800">
                        {kategori === "siswa" ? item.santri?.namaLengkap : item.guru?.namaLengkap}
                      </td>
                      {kategori === "siswa" && (
                        <td className="px-4 py-2.5">
                          {item.santri?.rombel?.namaRombel || "-"}
                        </td>
                      )}
                      <td className="px-4 py-2.5 font-mono font-bold text-emerald-600">{item.waktu}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-rose-600">
                        {item.waktuKeluar || <span className="italic text-gray-400 font-normal">Belum</span>}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`px-2 py-1 font-bold rounded text-[9px] uppercase shadow-sm print:shadow-none print:border print:border-black ${
                          item.status === 'Hadir' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}