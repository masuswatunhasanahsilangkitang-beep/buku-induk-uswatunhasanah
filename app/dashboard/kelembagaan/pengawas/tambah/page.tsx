"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahPengawas() {
  const router = useRouter();
  const [formData, setFormData] = useState({ namaLengkap: "", nip: "", jabatan: "Pengawas Madrasah", instansi: "", noHp: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/pengawas", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Data pengawas berhasil ditambahkan!");
        router.push("/dashboard/kelembagaan/pengawas");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Tambah Pengawas / Komite</h1>
          <Link href="/dashboard/kelembagaan/pengawas" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">NAMA LENGKAP (Beserta Gelar)</label>
              <input type="text" value={formData.namaLengkap} onChange={e => setFormData({...formData, namaLengkap: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 uppercase" required />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">NIP (Opsional)</label>
              <input type="text" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">JABATAN</label>
              <select value={formData.jabatan} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full p-3 border rounded-lg bg-white">
                <option value="Pengawas Madrasah">Pengawas Madrasah</option>
                <option value="Ketua Komite">Ketua Komite</option>
                <option value="Pembina Yayasan">Pembina Yayasan</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">NOMOR HP AKTIF</label>
              <input type="text" value={formData.noHp} onChange={e => setFormData({...formData, noHp: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">INSTANSI / ASAL (Opsional)</label>
            <input type="text" placeholder="Contoh: Kemenag Kab. Padang Lawas Utara" value={formData.instansi} onChange={e => setFormData({...formData, instansi: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">{isSubmitting ? "Menyimpan..." : "Simpan Data"}</button>
        </form>
      </div>
    </div>
  );
}