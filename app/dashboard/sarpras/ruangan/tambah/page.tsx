"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahRuangan() {
  const router = useRouter();
  const [listGedung, setListGedung] = useState<any[]>([]);
  const [formData, setFormData] = useState({ namaRuangan: "", jenisRuangan: "Ruang Kelas", kapasitas: "", kondisi: "Baik", gedungId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/sarpras/gedung").then(res => res.json()).then(json => {
      if (json.success) setListGedung(json.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sarpras/ruangan", {
        method: "POST", headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({...formData, gedungId: formData.gedungId || null}),
      });
      if (res.ok) {
        alert("Ruangan berhasil ditambahkan!");
        router.push("/dashboard/sarpras/ruangan");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Tambah Ruangan</h1>
          <Link href="/dashboard/sarpras/ruangan" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA RUANGAN</label>
              <input type="text" value={formData.namaRuangan} onChange={e => setFormData({...formData, namaRuangan: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">JENIS RUANGAN</label>
              <select value={formData.jenisRuangan} onChange={e => setFormData({...formData, jenisRuangan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                <option value="Ruang Kelas">Ruang Kelas</option><option value="Laboratorium">Laboratorium</option>
                <option value="Perpustakaan">Perpustakaan</option><option value="Toilet">Toilet</option>
                <option value="Ruang Guru">Ruang Guru</option><option value="Gudang">Gudang</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">PILIH LOKASI GEDUNG</label>
              <select value={formData.gedungId} onChange={e => setFormData({...formData, gedungId: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                <option value="">-- Tanpa Gedung --</option>
                {listGedung.map(g => <option key={g.id} value={g.id}>{g.namaGedung}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KONDISI</label>
              <select value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                <option value="Baik">Baik</option><option value="Rusak Ringan">Rusak Ringan</option><option value="Rusak Berat">Rusak Berat</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KAPASITAS ORANG (Opsional)</label>
            <input type="number" placeholder="Contoh: 36" value={formData.kapasitas} onChange={e => setFormData({...formData, kapasitas: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">{isSubmitting ? "Menyimpan..." : "Simpan Ruangan"}</button>
        </form>
      </div>
    </div>
  );
}