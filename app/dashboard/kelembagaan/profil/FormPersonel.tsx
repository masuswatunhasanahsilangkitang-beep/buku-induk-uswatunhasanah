"use client";
import { useState, useEffect } from "react";

export default function FormPersonel() {
  const [formData, setFormData] = useState({ 
    namaKepalaMadrasah: "", nipKepalaMadrasah: "", noHpKepalaMadrasah: "",
    namaKetuaKomite: "", noHpKetuaKomite: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/kelembagaan")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFormData({
            namaKepalaMadrasah: json.data.namaKepalaMadrasah || "",
            nipKepalaMadrasah: json.data.nipKepalaMadrasah || "",
            noHpKepalaMadrasah: json.data.noHpKepalaMadrasah || "",
            namaKetuaKomite: json.data.namaKetuaKomite || "",
            noHpKetuaKomite: json.data.noHpKetuaKomite || "",
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
      if (res.ok) alert("Sukses! Data Personel Inti berhasil diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-4 animate-in fade-in duration-300">
      
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-blue-700 border-b border-blue-100 pb-2 flex items-center gap-2">
          <span>👔</span> A. Kepala Madrasah
        </h3>
        
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NAMA LENGKAP & GELAR</label>
          <input type="text" value={formData.namaKepalaMadrasah} onChange={e => setFormData({...formData, namaKepalaMadrasah: e.target.value})} placeholder="Contoh: H. Ahmad Dahlan, S.Pd., M.Pd." className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-bold uppercase text-gray-800" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NIP / PEG ID</label>
            <input type="text" value={formData.nipKepalaMadrasah} onChange={e => setFormData({...formData, nipKepalaMadrasah: e.target.value})} placeholder="Kosongkan jika berstatus Non-PNS" className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR HP / WHATSAPP AKTIF</label>
            <input type="text" value={formData.noHpKepalaMadrasah} onChange={e => setFormData({...formData, noHpKepalaMadrasah: e.target.value})} placeholder="Contoh: 081234567890" className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h3 className="text-sm font-bold text-amber-600 border-b border-amber-100 pb-2 flex items-center gap-2">
          <span>🤝</span> B. Ketua Komite Madrasah
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NAMA KETUA KOMITE</label>
            <input type="text" value={formData.namaKetuaKomite} onChange={e => setFormData({...formData, namaKetuaKomite: e.target.value})} placeholder="Nama lengkap ketua komite" className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-bold uppercase text-gray-800" />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR HP / WHATSAPP</label>
            <input type="text" value={formData.noHpKetuaKomite} onChange={e => setFormData({...formData, noHpKetuaKomite: e.target.value})} placeholder="Contoh: 081234567890" className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded shadow-sm text-sm transition-colors">
          {isSubmitting ? "MENYIMPAN..." : "SIMPAN DATA PERSONEL"}
        </button>
      </div>
    </form>
  );
}