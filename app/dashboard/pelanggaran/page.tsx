"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PelanggaranPage() {
  const [dataPelanggaran, setDataPelanggaran] = useState<any[]>([]);
  const [siswaAktif, setSiswaAktif] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    santriId: "", tanggal: new Date().toISOString().split("T")[0], 
    kategori: "Ringan", bentuk: "", poin: 5, tindakan: "", petugas: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil riwayat pelanggaran
      const resP = await fetch("/api/pelanggaran");
      const jsonP = await resP.json();
      if (jsonP.success) setDataPelanggaran(jsonP.data);
      
      // 2. Ambil daftar siswa langsung dari /api/santri (aman & lengkap)
      const resS = await fetch("/api/santri"); 
      const jsonS = await resS.json();
      if (jsonS.success && jsonS.data) {
        const list = jsonS.data.santri ? jsonS.data.santri : jsonS.data;
        setSiswaAktif(list || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.santriId) {
      alert("Silakan pilih siswa terlebih dahulu!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pelanggaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (res.ok && json.success) {
        alert(json.message);
        fetchData(); // Refresh tabel
        setIsModalOpen(false);
        setFormData({ ...formData, bentuk: "", tindakan: "", poin: 5, santriId: "" });
      } else {
        alert(json.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Logika Warna Badge Kategori
  const getBadgeColor = (kategori: string) => {
    if (kategori === "Berat") return "bg-red-100 text-red-700";
    if (kategori === "Sedang") return "bg-amber-100 text-amber-700";
    return "bg-blue-100 text-blue-700"; // Ringan
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER DENGAN 3 TOMBOL AKSI UTAMA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Buku Saku / Kedisiplinan</h1>
            <p className="text-sm text-gray-500 mt-1">Catat dan pantau rekam jejak pelanggaran siswa (BK).</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/pelanggaran/scan" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg shadow flex items-center gap-2 transition-colors">
              📷 Scan Kartu
            </Link>
            <Link href="/dashboard/pelanggaran/laporan" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow flex items-center gap-2 transition-colors">
              📊 Cetak Laporan
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow flex items-center gap-2 transition-colors">
              + Catat Pelanggaran
            </button>
          </div>
        </div>

        {/* TABEL */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400 font-bold animate-pulse">Memuat Data Kedisiplinan...</div>
          ) : dataPelanggaran.length === 0 ? (
            <div className="text-center py-16 text-gray-400 italic">Belum ada catatan pelanggaran yang terekam.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b">
                  <tr>
                    <th className="px-5 py-4">Tanggal</th>
                    <th className="px-5 py-4">Nama Siswa / Kelas</th>
                    <th className="px-5 py-4">Bentuk Pelanggaran</th>
                    <th className="px-5 py-4 text-center">Kategori (Poin)</th>
                    <th className="px-5 py-4">Tindakan / Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dataPelanggaran.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 whitespace-nowrap">{p.tanggal}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-800 uppercase">{p.santri?.namaLengkap}</div>
                        <div className="text-[10px] text-gray-500">{p.santri?.rombel?.namaRombel || "Belum ada kelas"}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{p.bentuk}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getBadgeColor(p.kategori)}`}>
                          {p.kategori} ({p.poin})
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        <div className="font-bold text-gray-700">{p.tindakan || "-"}</div>
                        <div className="text-[10px] text-gray-400">Oleh: {p.petugas || "-"}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL TAMBAH MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50">
              <h2 className="text-lg font-bold text-red-800">Catat Pelanggaran Baru (Manual)</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            
            <form id="form-pelanggaran" onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Pilih Siswa <span className="text-red-500">*</span></label>
                <select name="santriId" value={formData.santriId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm font-bold bg-white">
                  <option value="" disabled>-- Pilih Siswa --</option>
                  {siswaAktif.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.namaLengkap} (NISN: {s.nisn || "-"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Tanggal Kejadian <span className="text-red-500">*</span></label>
                  <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Kategori</label>
                  <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm font-bold text-red-600 bg-white">
                    <option value="Ringan">Ringan</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Berat">Berat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-gray-500 mb-1">Bentuk Pelanggaran <span className="text-red-500">*</span></label>
                  <input type="text" name="bentuk" value={formData.bentuk} onChange={handleChange} placeholder="Misal: Membolos / Terlambat" required className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Poin</label>
                  <input type="number" name="poin" value={formData.poin} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Tindakan / Hukuman (Opsional)</label>
                <input type="text" name="tindakan" value={formData.tindakan} onChange={handleChange} placeholder="Misal: Pemanggilan Orang Tua" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nama Petugas / Guru BK</label>
                <input type="text" name="petugas" value={formData.petugas} onChange={handleChange} placeholder="Nama Anda" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </form>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Batal</button>
              <button type="submit" form="form-pelanggaran" disabled={isSubmitting} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow">
                {isSubmitting ? "Menyimpan..." : "Simpan Catatan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}