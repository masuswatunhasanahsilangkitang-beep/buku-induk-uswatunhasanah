"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";

export default function LaporanPelanggaranPage() {
  const [listSantri, setListSantri] = useState<any[]>([]);
  const [listRombel, setListRombel] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"semua" | "santri" | "rombel">("semua");
  const [selectedSantriId, setSelectedSantriId] = useState("");
  const [selectedRombelId, setSelectedRombelId] = useState("");
  
  const [laporanData, setLaporanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Tarik data awal (Daftar siswa & rombel untuk opsi filter)
  useEffect(() => {
    async function initData() {
      try {
        const resSantri = await fetch("/api/santri");
        const jsonSantri = await resSantri.json();
        if (jsonSantri.success) {
          const sData = jsonSantri.data.santri ? jsonSantri.data.santri : jsonSantri.data;
          setListSantri(sData || []);
        }

        const resRombel = await fetch("/api/rombel"); // Menyesuaikan jika ada API rombel, atau ambil dari santri
        // Fallback ambil rombel unik dari santri jika endpoint rombel berbeda
        const rombels = Array.from(new Set(sData?.map((s: any) => s.rombel?.id).filter(Boolean))).map(id => {
          return sData.find((s: any) => s.rombel?.id === id)?.rombel;
        });
        setListRombel(rombels || []);
      } catch (e) {
        console.error(e);
      }
    }
    initData();
  }, []);

  // Fungsi Ambil Data Laporan Berdasarkan Filter
  const handleTampilkanLaporan = async () => {
    setLoading(true);
    try {
      let url = "/api/pelanggaran/laporan?";
      if (filterType === "santri" && selectedSantriId) {
        url += `santriId=${selectedSantriId}`;
      } else if (filterType === "rombel" && selectedRombelId) {
        url += `rombelId=${selectedRombelId}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setLaporanData(json.data);
      }
    } catch (error) {
      alert("Gagal memuat laporan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCetak = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* CSS KHUSUS CETAK A4 */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #print-section, #print-section * { visibility: visible; }
          #print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 15mm;
            background: white;
          }
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER & KONTROL FILTER (Hilang saat diprint) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 no-print">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Pusat Cetak Laporan Kedisiplinan (BK)</h1>
            <p className="text-xs text-gray-500">Pilih parameter cetak untuk rekapitulasi per siswa atau per rombel/kelas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end pt-2 border-t">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Kategori Filter</label>
              <select 
                value={filterType} 
                onChange={(e: any) => { setFilterType(e.target.value); setLaporanData([]); }}
                className="w-full px-3 py-2 border rounded-lg text-sm font-semibold"
              >
                <option value="semua">Semua Rekap Pelanggaran</option>
                <option value="santri">Per Siswa Spesifik</option>
                <option value="rombel">Per Rombel / Kelas</option>
              </select>
            </div>

            {filterType === "santri" && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Pilih Siswa</label>
                <select 
                  value={selectedSantriId} 
                  onChange={(e) => setSelectedSantriId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">-- Pilih Nama Siswa --</option>
                  {listSantri.map(s => <option key={s.id} value={s.id}>{s.namaLengkap} (NISN: {s.nisn})</option>)}
                </select>
              </div>
            )}

            {filterType === "rombel" && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Pilih Rombel / Kelas</label>
                <select 
                  value={selectedRombelId} 
                  onChange={(e) => setSelectedRombelId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {listRombel.map((r: any) => <option key={r?.id} value={r?.id}>{r?.namaRombel} (Tingkat {r?.tingkat})</option>)}
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={handleTampilkanLaporan} 
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow transition-colors"
              >
                {loading ? "Memuat..." : "Tampilkan"}
              </button>
              {laporanData.length > 0 && (
                <button 
                  onClick={handleCetak} 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow transition-colors"
                  title="Cetak Laporan"
                >
                  🖨️ Cetak
                </button>
              )}
            </div>
          </div>
        </div>

        {/* AREA HASIL & FORMAT CETAK KERTAS A4 */}
        <div id="print-section" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
          
          {/* KOP SURAT LAPORAN */}
          <div className="border-b-2 border-black pb-4 mb-6 text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider">Kementerian Agama Republik Indonesia</h2>
            <h1 className="text-lg font-black uppercase">Rekapitulasi Catatan Pelanggaran Siswa (BK)</h1>
            <h3 className="text-xs font-semibold uppercase">Madrasah Aliyah PP Uswatun Hasanah</h3>
          </div>

          {laporanData.length === 0 ? (
            <div className="text-center py-20 text-gray-400 italic text-sm">
              Silakan pilih filter di atas dan klik tombol &quot;Tampilkan&quot; untuk memuat data laporan.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-gray-600 flex justify-between">
                <span>Total Catatan Ditemukan: <strong className="text-black">{laporanData.length} pelanggaran</strong></span>
                <span>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>

              <table className="w-full text-left text-xs border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-100 text-black uppercase font-bold text-[10px]">
                    <th className="border border-gray-400 p-2 text-center w-10">No</th>
                    <th className="border border-gray-400 p-2">Tanggal</th>
                    <th className="border border-gray-400 p-2">Nama Siswa</th>
                    <th className="border border-gray-400 p-2">Kelas</th>
                    <th className="border border-gray-400 p-2">Bentuk Pelanggaran</th>
                    <th className="border border-gray-400 p-2 text-center">Kategori (Poin)</th>
                    <th className="border border-gray-400 p-2">Tindakan / Pembinaan</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanData.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-400 p-2 whitespace-nowrap">{item.tanggal}</td>
                      <td className="border border-gray-400 p-2 font-bold uppercase">{item.santri?.namaLengkap}</td>
                      <td className="border border-gray-400 p-2">{item.santri?.rombel?.namaRombel || "-"}</td>
                      <td className="border border-gray-400 p-2">{item.bentuk}</td>
                      <td className="border border-gray-400 p-2 text-center font-bold">
                        {item.kategori} ({item.poin})
                      </td>
                      <td className="border border-gray-400 p-2">{item.tindakan || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TANDA TANGAN PEJABAT MADRASAH / GURU BK */}
              <div className="mt-16 pt-4 flex justify-end page-break-inside-avoid">
                <div className="text-center text-xs">
                  <p>Mengetahui,</p>
                  <p>Guru Bimbingan Konseling (BK)</p>
                  <div className="h-20"></div>
                  <p className="font-bold underline uppercase">___________________________</p>
                  <p className="text-[10px] text-gray-500">NIP. ..........................................</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}