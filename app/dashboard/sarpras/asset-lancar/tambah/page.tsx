"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahAssetLancar() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    kodeBarang: "", namaBarang: "", kategori: "Alat Tulis Kantor (ATK)", 
    jumlahStok: "", satuan: "Pcs", sumberDana: "BOS Reguler", keterangan: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sarpras/asset-lancar", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Data Asset Lancar berhasil ditambahkan!");
        router.push("/dashboard/sarpras/asset-lancar");
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <h1 className="text-xl font-black text-gray-800">Tambah Data Persediaan (Lancar)</h1>
          <Link href="/dashboard/sarpras/asset-lancar" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-amber-600 border-b pb-2">A. Informasi Barang</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KODE BARANG (Opsional)</label>
                <input type="text" placeholder="Misal: ATK-001" value={formData.kodeBarang} onChange={e => setFormData({...formData, kodeBarang: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA BARANG</label>
                <input type="text" placeholder="Contoh: Kertas HVS A4 70gsm" value={formData.namaBarang} onChange={e => setFormData({...formData, namaBarang: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KATEGORI</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                  <option value="Alat Tulis Kantor (ATK)">Alat Tulis Kantor (ATK)</option>
                  <option value="Bahan Kebersihan">Bahan Kebersihan</option>
                  <option value="Bahan Praktikum">Bahan Praktikum / Prakarya</option>
                  <option value="Perlengkapan Kesehatan">Perlengkapan Kesehatan (UKS)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">SUMBER DANA</label>
                <select value={formData.sumberDana} onChange={e => setFormData({...formData, sumberDana: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                  <option value="BOS Reguler">BOS Reguler</option>
                  <option value="Komite Madrasah">Komite Madrasah</option>
                  <option value="Yayasan">Dana Yayasan</option>
                  <option value="Bantuan Pemerintah">Bantuan Pemerintah</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-amber-600 border-b pb-2">B. Stok & Satuan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-amber-600 mb-1 block tracking-wider">JUMLAH STOK AWAL</label>
                <input type="number" min="0" placeholder="0" value={formData.jumlahStok} onChange={e => setFormData({...formData, jumlahStok: e.target.value})} className="w-full p-3 border-2 border-amber-100 rounded-lg bg-amber-50 text-amber-700 font-black text-xl" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">SATUAN BARANG</label>
                <select value={formData.satuan} onChange={e => setFormData({...formData, satuan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                  <option value="Pcs">Pcs (Buah)</option>
                  <option value="Rim">Rim</option>
                  <option value="Box">Box / Kotak</option>
                  <option value="Pack">Pack</option>
                  <option value="Botol">Botol</option>
                  <option value="Set">Set</option>
                  <option value="Lusin">Lusin</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KETERANGAN / CATATAN TAMBAHAN</label>
              <textarea placeholder="Opsional (Misal: Disimpan di lemari TU)" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" rows={2} />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-amber-500 text-white font-black rounded-lg hover:bg-amber-600 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN DATA ASSET LANCAR"}
          </button>
        </form>
      </div>
    </div>
  );
}