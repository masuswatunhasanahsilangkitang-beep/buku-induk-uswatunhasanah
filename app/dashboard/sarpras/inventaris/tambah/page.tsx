"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahInventaris() {
  const router = useRouter();
  const [listRuangan, setListRuangan] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    kodeBarang: "", namaBarang: "", merk: "", tahunPengadaan: "", sumberDana: "", ruanganId: "",
    kondisiBaik: 0, kondisiRusakRingan: 0, kondisiRusakBerat: 0 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/sarpras/ruangan").then(res => res.json()).then(json => {
      if (json.success) setListRuangan(json.data);
    });
  }, []);

  const total = Number(formData.kondisiBaik) + Number(formData.kondisiRusakRingan) + Number(formData.kondisiRusakBerat);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(total === 0) return alert("Total barang tidak boleh 0!");
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/sarpras/inventaris", {
        method: "POST", headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({...formData, jumlahTotal: total, ruanganId: formData.ruanganId || null}),
      });
      if (res.ok) {
        alert("Barang inventaris berhasil dicatat!");
        router.push("/dashboard/sarpras/inventaris");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Pencatatan Inventaris</h1>
          <Link href="/dashboard/sarpras/inventaris" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA BARANG</label>
              <input type="text" value={formData.namaBarang} onChange={e => setFormData({...formData, namaBarang: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KODE BARANG (Opsional)</label>
              <input type="text" value={formData.kodeBarang} onChange={e => setFormData({...formData, kodeBarang: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">LOKASI RUANGAN</label>
              <select value={formData.ruanganId} onChange={e => setFormData({...formData, ruanganId: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                <option value="">-- Belum Ditempatkan --</option>
                {listRuangan.map(r => <option key={r.id} value={r.id}>{r.namaRuangan}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">SUMBER DANA</label>
              <input type="text" placeholder="Contoh: BOS, Komite" value={formData.sumberDana} onChange={e => setFormData({...formData, sumberDana: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="text-[10px] font-bold text-blue-600 mb-3 block tracking-wider uppercase">Rincian Kondisi Barang</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-emerald-600 mb-1 block">KONDISI BAIK</label>
                <input type="number" min="0" value={formData.kondisiBaik} onChange={e => setFormData({...formData, kondisiBaik: parseInt(e.target.value) || 0})} className="w-full p-3 border-2 border-emerald-100 rounded-lg bg-emerald-50 text-emerald-700 font-black text-center" />
              </div>
              <div>
                <label className="text-xs font-bold text-amber-600 mb-1 block">RUSAK RINGAN</label>
                <input type="number" min="0" value={formData.kondisiRusakRingan} onChange={e => setFormData({...formData, kondisiRusakRingan: parseInt(e.target.value) || 0})} className="w-full p-3 border-2 border-amber-100 rounded-lg bg-amber-50 text-amber-700 font-black text-center" />
              </div>
              <div>
                <label className="text-xs font-bold text-red-600 mb-1 block">RUSAK BERAT</label>
                <input type="number" min="0" value={formData.kondisiRusakBerat} onChange={e => setFormData({...formData, kondisiRusakBerat: parseInt(e.target.value) || 0})} className="w-full p-3 border-2 border-red-100 rounded-lg bg-red-50 text-red-700 font-black text-center" />
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center flex justify-between items-center px-6">
              <span className="text-sm font-bold text-gray-600">Total Barang Tercatat:</span>
              <span className="text-xl font-black text-gray-800">{total} Unit</span>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600">{isSubmitting ? "Menyimpan..." : "Simpan Inventaris"}</button>
        </form>
      </div>
    </div>
  );
}