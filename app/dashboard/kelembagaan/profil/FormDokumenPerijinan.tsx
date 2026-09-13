"use client";
import { useState, useEffect } from "react";

export default function FormDokumenPerijinan() {
  const [formData, setFormData] = useState({ 
    skPendirian: "", tanggalSkPendirian: "", 
    skIzinOperasional: "", tanggalSkIzinOperasional: "", 
    akreditasi: "Belum Terakreditasi", skAkreditasi: "", tahunAkreditasi: "",
    skKemenkumham: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/kelembagaan")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFormData({
            skPendirian: json.data.skPendirian || "",
            tanggalSkPendirian: json.data.tanggalSkPendirian || "",
            skIzinOperasional: json.data.skIzinOperasional || "",
            tanggalSkIzinOperasional: json.data.tanggalSkIzinOperasional || "",
            akreditasi: json.data.akreditasi || "Belum Terakreditasi",
            skAkreditasi: json.data.skAkreditasi || "",
            tahunAkreditasi: json.data.tahunAkreditasi || "",
            skKemenkumham: json.data.skKemenkumham || "",
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
      if (res.ok) alert("Sukses! Data Dokumen Perijinan berhasil diperbarui.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-4 animate-in fade-in duration-300">
      
      {/* Bagian 1: Izin Operasional & Pendirian */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 border-b pb-2">A. Izin Operasional & Pendirian Madrasah</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR SK PENDIRIAN MADRASAH</label>
            <input type="text" value={formData.skPendirian} onChange={e => setFormData({...formData, skPendirian: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">TANGGAL SK PENDIRIAN</label>
            <input type="date" value={formData.tanggalSkPendirian} onChange={e => setFormData({...formData, tanggalSkPendirian: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR SK IZIN OPERASIONAL</label>
            <input type="text" value={formData.skIzinOperasional} onChange={e => setFormData({...formData, skIzinOperasional: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">TANGGAL SK IZIN OPERASIONAL</label>
            <input type="date" value={formData.tanggalSkIzinOperasional} onChange={e => setFormData({...formData, tanggalSkIzinOperasional: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-700" />
          </div>
        </div>
      </div>

      {/* Bagian 2: Status Akreditasi */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 border-b pb-2">B. Status Akreditasi (BAN-S/M)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NILAI / PERINGKAT AKREDITASI</label>
            <select value={formData.akreditasi} onChange={e => setFormData({...formData, akreditasi: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-black text-gray-800">
              <option value="A">A (Unggul)</option>
              <option value="B">B (Baik)</option>
              <option value="C">C (Cukup)</option>
              <option value="Belum Terakreditasi">Belum Terakreditasi</option>
            </select>
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR SK AKREDITASI</label>
            <input type="text" value={formData.skAkreditasi} onChange={e => setFormData({...formData, skAkreditasi: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">TAHUN DITETAPKAN</label>
            <input type="number" placeholder="Contoh: 2024" value={formData.tahunAkreditasi} onChange={e => setFormData({...formData, tahunAkreditasi: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
        </div>
      </div>

      {/* Bagian 3: Legalitas Yayasan (Opsional untuk Swasta) */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-gray-800 border-b pb-2">C. Legalitas Penyelenggara (Khusus Swasta)</h3>
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR SK KEMENKUMHAM YAYASAN</label>
          <input type="text" placeholder="Kosongkan jika Madrasah Negeri" value={formData.skKemenkumham} onChange={e => setFormData({...formData, skKemenkumham: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded shadow-sm text-sm transition-colors">
          {isSubmitting ? "MENYIMPAN..." : "SIMPAN DOKUMEN"}
        </button>
      </div>
    </form>
  );
}