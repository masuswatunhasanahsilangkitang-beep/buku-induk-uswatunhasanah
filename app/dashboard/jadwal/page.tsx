"use client";
import { useState, useEffect } from "react";

export default function ManajemenJadwalPage() {
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [jenisKegiatan, setJenisKegiatan] = useState("KBM Harian");
  const [hari, setHari] = useState("Senin");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [daftarJadwal, setDaftarJadwal] = useState<any[]>([]);

  const fetchJadwal = async () => {
    try {
      // Mengambil semua jadwal (tanpa filter hari spesifik)
      const res = await fetch("/api/jadwal");
      const json = await res.json();
      if (json.success) setDaftarJadwal(json.data);
    } catch (error) {
      console.error("Gagal memuat jadwal:", error);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaKegiatan, jenisKegiatan, hari, jamMulai, jamSelesai }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMessage({ type: "success", text: "Jadwal baru berhasil disimpan!" });
        setNamaKegiatan("");
        setJamMulai("");
        setJamSelesai("");
        fetchJadwal(); 
      } else {
        setMessage({ type: "error", text: json.message || "Gagal menyimpan jadwal." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <nav className="text-xs text-gray-400 space-x-1 mb-2">
            <span>Dashboard</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Manajemen Jadwal</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-800">Manajemen Jadwal Kegiatan</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PANEL FORM INPUT JADWAL */}
          <div className="lg:col-span-1 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-gray-800 text-sm mb-4 border-b pb-2">➕ Tambah Jadwal Baru</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Hari</label>
                <select value={hari} onChange={e => setHari(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500">
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Jenis Kegiatan</label>
                <select value={jenisKegiatan} onChange={e => setJenisKegiatan(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500">
                  <option value="KBM Harian">KBM Harian</option>
                  <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                  <option value="Kegiatan Asrama">Kegiatan Asrama</option>
                  <option value="Acara Khusus">Acara Khusus</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Nama / Mata Pelajaran</label>
                <input type="text" value={namaKegiatan} onChange={e => setNamaKegiatan(e.target.value)} placeholder="Contoh: Matematika" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Jam Mulai</label>
                  <input type="time" value={jamMulai} onChange={e => setJamMulai(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Jam Selesai</label>
                  <input type="time" value={jamSelesai} onChange={e => setJamSelesai(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors text-sm disabled:opacity-50">
                {loading ? "Menyimpan..." : "Simpan Jadwal"}
              </button>

              {message && (
                <div className={`p-3 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>

          {/* PANEL TABEL DAFTAR JADWAL */}
          <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-bold text-gray-800 text-sm">📋 Daftar Jadwal Aktif</h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold shadow-inner">Total: {daftarJadwal.length}</span>
            </div>

            {daftarJadwal.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm font-semibold">Belum ada jadwal yang didaftarkan.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-y">
                    <tr>
                      <th className="px-3 py-3">Hari</th>
                      <th className="px-3 py-3">Waktu</th>
                      <th className="px-3 py-3">Nama Kegiatan</th>
                      <th className="px-3 py-3">Kategori</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {daftarJadwal.map((j) => (
                      <tr key={j.id} className="hover:bg-blue-50/50">
                        <td className="px-3 py-2.5 font-bold text-gray-800">{j.hari}</td>
                        <td className="px-3 py-2.5 font-mono font-bold text-blue-600 whitespace-nowrap">
                          {j.jamMulai} - {j.jamSelesai}
                        </td>
                        <td className="px-3 py-2.5 font-bold">{j.namaKegiatan}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100 text-[10px]">
                            {j.jenisKegiatan}
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
    </div>
  );
}