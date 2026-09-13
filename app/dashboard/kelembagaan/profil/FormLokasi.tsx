"use client";
import { useState, useEffect } from "react";

export default function FormLokasi() {
  const [formData, setFormData] = useState({ 
    alamatLengkap: "", desaKelurahan: "", kecamatan: "", 
    kabupatenKota: "", provinsi: "", kodePos: "",
    lintang: "", bujur: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data lokasi dari database
  useEffect(() => {
    fetch("/api/kelembagaan")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFormData({
            alamatLengkap: json.data.alamatLengkap || "",
            desaKelurahan: json.data.desaKelurahan || "",
            kecamatan: json.data.kecamatan || "",
            kabupatenKota: json.data.kabupatenKota || "",
            provinsi: json.data.provinsi || "",
            kodePos: json.data.kodePos || "",
            lintang: json.data.lintang || "",
            bujur: json.data.bujur || "",
          });
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) alert("Sukses! Data Lokasi & Koordinat berhasil disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // LOGIKA PETA YANG DIPERBARUI
  // Default titik tengah Indonesia jika koordinat belum diisi
  const lat = formData.lintang || "-0.789275"; 
  const lng = formData.bujur || "113.921327";
  const zoom = (formData.lintang && formData.bujur) ? "17" : "5";
  
  // Format URL Embed resmi Google Maps yang paling stabil
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&t=m&z=${zoom}&output=embed&iwloc=Near`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      
      {/* Bagian 1: Alamat Teks */}
      <div className="relative">
        <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">ALAMAT LENGKAP (JALAN, RT/RW, DUSUN)</label>
        <textarea 
          value={formData.alamatLengkap} 
          onChange={e => setFormData({...formData, alamatLengkap: e.target.value})} 
          placeholder="Contoh: Jl. Lintas Timur Sumatera Km. 50" 
          className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" 
          rows={3} required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">DESA / KELURAHAN</label>
          <input type="text" value={formData.desaKelurahan} onChange={e => setFormData({...formData, desaKelurahan: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" required />
        </div>
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">KECAMATAN</label>
          <input type="text" value={formData.kecamatan} onChange={e => setFormData({...formData, kecamatan: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">KABUPATEN / KOTA</label>
          <input type="text" value={formData.kabupatenKota} onChange={e => setFormData({...formData, kabupatenKota: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" required />
        </div>
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">PROVINSI</label>
          <input type="text" value={formData.provinsi} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">KODE POS</label>
          <input type="text" value={formData.kodePos} onChange={e => setFormData({...formData, kodePos: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-mono font-bold tracking-widest" required />
        </div>
      </div>

      {/* Bagian 2: Koordinat & Google Maps */}
      <div className="pt-6 mt-6 border-t border-gray-100">
        <h3 className="text-md font-bold text-gray-800 mb-6">Penentuan Titik Koordinat</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Koordinat */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-blue-500">LINTANG (LATITUDE)</label>
              <input 
                type="text" 
                value={formData.lintang} 
                onChange={e => setFormData({...formData, lintang: e.target.value})} 
                placeholder="Contoh: -6.2088" 
                className="w-full px-4 py-3 border-2 border-blue-100 rounded focus:border-blue-500 focus:outline-none text-sm font-mono" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-blue-500">BUJUR (LONGITUDE)</label>
              <input 
                type="text" 
                value={formData.bujur} 
                onChange={e => setFormData({...formData, bujur: e.target.value})} 
                placeholder="Contoh: 106.8456" 
                className="w-full px-4 py-3 border-2 border-blue-100 rounded focus:border-blue-500 focus:outline-none text-sm font-mono" 
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800 leading-relaxed shadow-sm">
              <strong>Cara Mengisi:</strong> Buka aplikasi Google Maps, cari lokasi Madrasah, klik tahan pada titik lokasi, lalu salin angka koordinat yang muncul.
            </div>
          </div>

          {/* Pratinjau Google Maps */}
          <div className="lg:col-span-2 w-full h-[300px] lg:h-full min-h-[300px] relative rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center">
            {/* Teks fallback jika map sedang loading lambat */}
            <span className="absolute text-gray-400 text-sm font-bold z-0 animate-pulse">Memuat Peta...</span>
            
            <iframe
              title="Google Maps Preview"
              className="absolute inset-0 w-full h-full z-10"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={mapSrc}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 pb-4">
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded shadow-sm text-sm transition-colors">
          {isSubmitting ? "MENYIMPAN..." : "SIMPAN LOKASI"}
        </button>
      </div>
    </form>
  );
}