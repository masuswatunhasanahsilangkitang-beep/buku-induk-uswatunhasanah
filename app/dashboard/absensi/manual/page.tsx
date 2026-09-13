"use client";
import { useState, useEffect } from "react";

export default function InputManualAbsensiPage() {
  const [role, setRole] = useState<"siswa" | "guru">("siswa");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jadwalId, setJadwalId] = useState("manual");
  const [jenisKegiatan, setJenisKegiatan] = useState("KBM Harian");
  const [status, setStatus] = useState("Sakit");
  const [keterangan, setKeterangan] = useState("");
  const [targetId, setTargetId] = useState("");
  
  // State Data
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [dataGuru, setDataGuru] = useState<any[]>([]);
  const [dataJadwal, setDataJadwal] = useState<any[]>([]);
  
  // Filter Rombel untuk mempermudah pencarian Siswa
  const [filterRombel, setFilterRombel] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/absensi/manual").then(res => res.json()).then(res => {
      if (res.success) {
        setDataSiswa(res.data.siswa);
        setDataGuru(res.data.guru);
        setDataJadwal(res.data.jadwal);
      }
    });
  }, []);

  // Logika penyaringan nama siswa berdasarkan rombel
  const siswaTertampil = filterRombel === "all" 
    ? dataSiswa 
    : dataSiswa.filter(s => s.rombelId === filterRombel);

  // Daftar unik Rombel dari data siswa
  const daftarRombelUnik = Array.from(new Set(dataSiswa.map(s => s.rombel?.namaRombel).filter(Boolean)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) { setMessage({ type: "error", text: "Pilih target (Siswa/Guru) terlebih dahulu!" }); return; }
    
    setLoading(true); setMessage(null);
    
    // Ambil nama kegiatan berdasarkan jadwalId
    let namaKegiatan = "";
    if (jadwalId !== "manual") {
      const jdwl = dataJadwal.find(j => j.id === jadwalId);
      if (jdwl) { namaKegiatan = jdwl.namaKegiatan; setJenisKegiatan(jdwl.jenisKegiatan); }
    }

    try {
      const res = await fetch("/api/absensi/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, targetId, tanggal, jadwalId: jadwalId !== "manual" ? jadwalId : null, jenisKegiatan, namaKegiatan, status, keterangan })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage({ type: "success", text: json.message });
        setTargetId(""); setKeterangan("");
      } else {
        setMessage({ type: "error", text: json.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Gagal menyimpan data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <nav className="text-xs text-gray-400 space-x-1 mb-2">
            <span>Absensi</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Input Manual</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Form Izin, Sakit, & Alfa</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
          
          <div className="flex bg-gray-100 p-1 rounded-lg w-full">
            <button type="button" onClick={() => { setRole("siswa"); setTargetId(""); }} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${role === 'siswa' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Siswa</button>
            <button type="button" onClick={() => { setRole("guru"); setTargetId(""); }} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${role === 'guru' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Guru & Tendik</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal</label>
              <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status Kehadiran</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500">
                <option value="Sakit">Sakit</option>
                <option value="Izin">Izin / Dinas Luar</option>
                <option value="Alfa">Alfa / Tanpa Keterangan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pilih Sesi / Jadwal</label>
            <select value={jadwalId} onChange={e => setJadwalId(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500">
              <option value="manual">Semua Sesi / KBM Harian (Tanpa Jadwal Spesifik)</option>
              {dataJadwal.map(j => <option key={j.id} value={j.id}>{j.hari} - {j.namaKegiatan} ({j.jamMulai}-{j.jamSelesai})</option>)}
            </select>
          </div>

          {role === "siswa" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filter Rombel (Opsional)</label>
              <select value={filterRombel} onChange={e => setFilterRombel(e.target.value)} className="w-full px-3 py-2 border bg-gray-50 rounded-lg text-sm outline-none focus:border-blue-500">
                <option value="all">Semua Rombel</option>
                {daftarRombelUnik.map(r => {
                  const rObj = dataSiswa.find(s => s.rombel?.namaRombel === r)?.rombel;
                  return rObj ? <option key={rObj.id} value={rObj.id}>{rObj.namaRombel}</option> : null;
                })}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pilih {role === 'siswa' ? 'Siswa' : 'Guru'}</label>
            <select value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 font-bold" required>
              <option value="" disabled>-- Pilih Nama --</option>
              {role === "siswa" 
                ? siswaTertampil.map(s => <option key={s.id} value={s.id}>{s.namaLengkap} {s.rombel ? `(${s.rombel.namaRombel})` : ''}</option>)
                : dataGuru.map(g => <option key={g.id} value={g.id}>{g.namaLengkap}</option>)
              }
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Keterangan (Surat Dokter, dll)</label>
            <textarea value={keterangan} onChange={e => setKeterangan(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500 h-20" placeholder="Opsional..." />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors text-sm disabled:opacity-50">
            {loading ? "Menyimpan..." : "Simpan Status Absensi"}
          </button>
          
          {message && (
            <div className={`p-3 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </form>

      </div>
    </div>
  );
}