"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahGedung() {
  const router = useRouter();
  const [formData, setFormData] = useState({ namaGedung: "", kondisi: "Baik", luasTanah: "", tahunBangun: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sarpras/gedung", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Gedung berhasil ditambahkan!");
        router.push("/dashboard/sarpras/gedung");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Tambah Gedung Baru</h1>
          <Link href="/dashboard/sarpras/gedung" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA GEDUNG / BANGUNAN</label>
            <input type="text" value={formData.namaGedung} onChange={e => setFormData({...formData, namaGedung: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KONDISI FISIK</label>
              <select value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                <option value="Baik">Baik</option><option value="Rusak Ringan">Rusak Ringan</option><option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">TAHUN BANGUN</label>
              <input type="text" value={formData.tahunBangun} onChange={e => setFormData({...formData, tahunBangun: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">LUAS TANAH / BANGUNAN (Opsional)</label>
            <input type="text" placeholder="Contoh: 120 m2" value={formData.luasTanah} onChange={e => setFormData({...formData, luasTanah: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">{isSubmitting ? "Menyimpan..." : "Simpan Data Gedung"}</button>
        </form>
      </div>
    </div>
  );
}