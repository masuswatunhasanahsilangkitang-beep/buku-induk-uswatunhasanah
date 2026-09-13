"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahKurikulum() {
  const router = useRouter();
  const [formData, setFormData] = useState({ tahunAjaran: "2026/2027", jenisKurikulum: "Kurikulum Merdeka", statusAktif: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/kurikulum", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Kurikulum berhasil ditambahkan!");
        router.push("/dashboard/kelembagaan/kurikulum");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Tambah Kurikulum</h1>
          <Link href="/dashboard/kelembagaan/kurikulum" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">TAHUN AJARAN</label>
            <input type="text" value={formData.tahunAjaran} onChange={e => setFormData({...formData, tahunAjaran: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">JENIS KURIKULUM</label>
            <input type="text" value={formData.jenisKurikulum} onChange={e => setFormData({...formData, jenisKurikulum: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" required />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={formData.statusAktif} onChange={e => setFormData({...formData, statusAktif: e.target.checked})} className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-bold text-gray-700">Set sebagai Kurikulum Aktif</label>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">{isSubmitting ? "Menyimpan..." : "Simpan Data"}</button>
        </form>
      </div>
    </div>
  );
}