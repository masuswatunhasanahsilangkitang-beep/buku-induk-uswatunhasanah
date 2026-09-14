"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function RekapAbsensiPage() {
  // Set default tanggal hari ini menggunakan format lokal (WIB)
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());

  const [tanggal, setTanggal] = useState(today);
  const [jenisKegiatan, setJenisKegiatan] = useState("KBM Harian");
  const [dataAbsen, setDataAbsen] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Tarik data dari API setiap kali tanggal atau jenis kegiatan berubah
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/absensi?tanggal=${tanggal}&jenisKegiatan=${encodeURIComponent(jenisKegiatan)}`);
        const json = await res.json();
        if (json.success) {
          setDataAbsen(json.data || []);
        } else {
          setDataAbsen([]);
        }
      } catch (error) {
        console.error("Gagal menarik data absensi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tanggal, jenisKegiatan]);

  // Fungsi Export ke Excel (CSV)
  const unduhExcel = () => {
    if (dataAbsen.length === 0) {
      alert("Tidak ada data untuk diunduh pada tanggal ini.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Header Kolom
    csvContent += "Tanggal,Waktu Masuk,Waktu Keluar,Nama Lengkap,Peran,Status,Kegiatan\n";

    // Isi Data
    dataAbsen.forEach((row) => {
      const nama = `"${row.namaLengkap}"`; // Pakai kutip agar aman dari koma di nama
      const keluar = row.waktuKeluar || "Belum Keluar";
      csvContent += `${row.tanggal},${row.waktu},${keluar},${nama},${row.role},${row.status},${row.jenisKegiatan}\n`;
    });

    // Proses Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Absensi_${jenisKegiatan.replace(/\s+/g, '_')}_${tanggal}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi Cetak PDF / Print Layar
  const cetakPDF = () => {
    window.print();
  };

  // Kalkulasi Ringkasan
  const totalHadirSiswa = dataAbsen.filter(d => d.role === "Siswa" && (d.status === "Hadir" || d.status === "Terlambat")).length;
  const totalHadirGuru = dataAbsen.filter(d => d.role === "Guru").length;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER & NAVIGASI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rekap & Laporan Absensi</h1>
            <p className="text-xs text-gray-500 mt-1">Pantau riwayat kehadiran siswa dan guru secara harian.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={unduhExcel} className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
              <span>📊</span> Export Excel
            </button>
            <button onClick={cetakPDF} className="px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors print:hidden">
              <span>🖨️</span> Cetak Laporan
            </button>
            <Link href="/dashboard/absensi/scanner" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors print:hidden">
              + Buka Scanner Kamera
            </Link>
          </div>
        </div>

        {/* PANEL FILTER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end print:hidden">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Pilih Tanggal</label>
            <input 
              type="date" 
              value={tanggal} 
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Jenis Kegiatan</label>
            <select 
              value={jenisKegiatan} 
              onChange={(e) => setJenisKegiatan(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="KBM Harian">KBM Harian</option>
              <option value="Ekstrakurikuler">Ekstrakurikuler</option>
              <option value="Kegiatan Asrama">Kegiatan Asrama</option>
              <option value="Acara Khusus">Acara Khusus</option>
            </select>
          </div>
        </div>

        {/* KARTU RINGKASAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl">👥</div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Total Data Masuk</p>
              <h3 className="text-2xl font-black text-gray-800">{dataAbsen.length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 text-xl">🎓</div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Kehadiran Siswa</p>
              <h3 className="text-2xl font-black text-gray-800">{totalHadirSiswa}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 text-xl">👨‍🏫</div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase">Kehadiran Guru</p>
              <h3 className="text-2xl font-black text-gray-800">{totalHadirGuru}</h3>
            </div>
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Nama Lengkap</th>
                  <th className="px-6 py-4">Peran</th>
                  <th className="px-6 py-4">Jam Masuk</th>
                  <th className="px-6 py-4">Jam Keluar</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 font-bold animate-pulse">Memuat data absensi...</td>
                  </tr>
                ) : dataAbsen.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-gray-500 text-sm font-semibold">Tidak ada catatan kehadiran pada tanggal ini.</p>
                    </td>
                  </tr>
                ) : (
                  dataAbsen.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-medium">{index + 1}</td>
                      <td className="px-6 py-3 font-bold text-gray-800">{item.namaLengkap}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${item.role === 'Guru' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono font-bold text-emerald-600">{item.waktu}</td>
                      <td className="px-6 py-3 font-mono font-bold text-rose-600">
                        {item.waktuKeluar || <span className="text-gray-400 italic font-normal text-xs">Belum Keluar</span>}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded shadow-sm ${
                          item.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'Terlambat' ? 'bg-orange-100 text-orange-700' : 
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.status}
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
      
      {/* CSS KHUSUS PRINT */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background-color: white; }
          .shadow-sm, .shadow-md { box-shadow: none !important; }
          .border-gray-100 { border-color: #000 !important; }
          .bg-gray-50 { background-color: transparent !important; }
        }
      `}} />
    </div>
  );
}