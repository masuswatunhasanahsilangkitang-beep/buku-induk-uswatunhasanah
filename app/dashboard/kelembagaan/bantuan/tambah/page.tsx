"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahBantuan() {
  const router = useRouter();
  const [formData, setFormData] = useState({ tahun: "2026", namaBantuan: "", sumberBantuan: "", nominalWujud: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/bantuan", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Riwayat bantuan berhasil dicatat!");
        router.push("/dashboard/kelembagaan/bantuan");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Catat Bantuan Masuk</h1>
          <Link href="/dashboard/kelembagaan/bantuan" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">TAHUN</label>
              <input type="text" value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">NOMINAL / WUJUD BANTUAN</label>
              <input type="text" placeholder="Contoh: Rp 50.000.000" value={formData.nominalWujud} onChange={e => setFormData({...formData, nominalWujud: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">NAMA PROGRAM BANTUAN</label>
            <input type="text" value={formData.namaBantuan} onChange={e => setFormData({...formData, namaBantuan: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">SUMBER INSTANSI</label>
            <input type="text" placeholder="Contoh: Kemenag Pusat" value={formData.sumberBantuan} onChange={e => setFormData({...formData, sumberBantuan: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">{isSubmitting ? "Menyimpan..." : "Simpan Data"}</button>
        </form>
      </div>
    </div>
  );
}