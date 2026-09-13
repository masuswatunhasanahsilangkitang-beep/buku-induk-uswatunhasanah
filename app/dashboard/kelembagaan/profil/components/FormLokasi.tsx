"use client";
import { useState, useEffect } from "react";

export default function FormLokasi() {
  const [formData, setFormData] = useState({ 
    alamatLengkap: "", rtRw: "", desaKelurahan: "", 
    kecamatan: "", kabupatenKota: "", provinsi: "", 
    kodePos: "", lintang: "", bujur: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kelembagaan/profil")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFormData({
            alamatLengkap: json.data.alamatLengkap || "",
            rtRw: json.data.rtRw || "",
            desaKelurahan: json.data.desaKelurahan || "",
            kecamatan: json.data.kecamatan || "",
            kabupatenKota: json.data.kabupatenKota || "",
            provinsi: json.data.provinsi || "",
            kodePos: json.data.kodePos || "",
            lintang: json.data.lintang || "",
            bujur: json.data.bujur || "",
          });
        }
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/profil", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) alert("Data Lokasi berhasil disimpan!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 font-semibold">Memuat form lokasi...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">ALAMAT JALAN</label>
          <input type="text" value={formData.alamatLengkap} onChange={e => setFormData({...formData, alamatLengkap: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" placeholder="Contoh: Jl. Lintas Timur Sumatera Km. 50" required />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">RT / RW</label>
          <input type="text" value={formData.rtRw} onChange={e => setFormData({...formData, rtRw: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" placeholder="Contoh: 01 / 02" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">DESA / KELURAHAN</label>
          <input type="text" value={formData.desaKelurahan} onChange={e => setFormData({...formData, desaKelurahan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KECAMATAN</label>
          <input type="text" value={formData.kecamatan} onChange={e => setFormData({...formData, kecamatan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KABUPATEN / KOTA</label>
          <input type="text" value={formData.kabupatenKota} onChange={e => setFormData({...formData, kabupatenKota: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">PROVINSI</label>
          <input type="text" value={formData.provinsi} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KODE POS</label>
          <input type="text" value={formData.kodePos} onChange={e => setFormData({...formData, kodePos: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-mono font-bold tracking-widest" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div>
          <label className="text-[10px] font-bold text-blue-600 mb-1 block tracking-wider">TITIK KOORDINAT (LINTANG)</label>
          <input type="text" value={formData.lintang} onChange={e => setFormData({...formData, lintang: e.target.value})} className="w-full p-3 border border-blue-100 rounded-lg bg-blue-50/30 font-mono text-sm" placeholder="Contoh: -6.2088" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-blue-600 mb-1 block tracking-wider">TITIK KOORDINAT (BUJUR)</label>
          <input type="text" value={formData.bujur} onChange={e => setFormData({...formData, bujur: e.target.value})} className="w-full p-3 border border-blue-100 rounded-lg bg-blue-50/30 font-mono text-sm" placeholder="Contoh: 106.8456" />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
        {isSubmitting ? "MENYIMPAN..." : "SIMPAN LOKASI"}
      </button>
    </form>
  );
}