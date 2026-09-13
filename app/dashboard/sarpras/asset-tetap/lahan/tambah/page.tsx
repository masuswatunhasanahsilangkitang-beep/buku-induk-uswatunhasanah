"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahLahan() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    // Nilai bawaan langsung diisi nama lembaga, tapi tetap bisa diedit manual
    namaLahan: "MAS PP USWATUN HASANAH", 
    noSertifikat: "", alamatLahan: "", 
    luas: "", luasDigunakan: "", luasBelumDigunakan: "", 
    statusTanah: "Milik Sendiri" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const total = Number(formData.luas) || 0;
    const digunakan = Number(formData.luasDigunakan) || 0;
    const belumDigunakan = total - digunakan;
    
    setFormData(prev => ({ 
      ...prev, 
      luasBelumDigunakan: belumDigunakan >= 0 ? belumDigunakan.toString() : "0" 
    }));
  }, [formData.luas, formData.luasDigunakan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sarpras/asset-tetap/lahan", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Data Lembaga/Lahan berhasil ditambahkan!");
        router.push("/dashboard/sarpras/asset-tetap/lahan");
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
          <h1 className="text-xl font-black text-gray-800">Tambah Data Lembaga / Lokasi</h1>
          <Link href="/dashboard/sarpras/asset-tetap/lahan" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-600 border-b pb-2">A. Informasi Dasar Lembaga / Lokasi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA LEMBAGA / LOKASI LAHAN</label>
                <input type="text" placeholder="Contoh: MAS PP USWATUN HASANAH" value={formData.namaLahan} onChange={e => setFormData({...formData, namaLahan: e.target.value})} className="w-full p-3 border-2 border-blue-100 rounded-lg bg-blue-50/30 font-black text-blue-900 uppercase" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NOMOR SERTIFIKAT LAHAN</label>
                <input type="text" value={formData.noSertifikat} onChange={e => setFormData({...formData, noSertifikat: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">ALAMAT LOKASI LEMBAGA</label>
              <textarea placeholder="Masukkan alamat lengkap (Jl, RT/RW, Desa, Kecamatan)" value={formData.alamatLahan} onChange={e => setFormData({...formData, alamatLahan: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" rows={2} required />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">STATUS KEPEMILIKAN LAHAN</label>
              <select value={formData.statusTanah} onChange={e => setFormData({...formData, statusTanah: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Sewa">Sewa / Kontrak</option>
                <option value="Hibah">Hibah</option>
                <option value="Pinjam Pakai">Pinjam Pakai</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-emerald-600 border-b pb-2">B. Rincian Luas Lahan (m²)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">TOTAL LUAS LAHAN</label>
                <input type="number" min="0" placeholder="Contoh: 1500" value={formData.luas} onChange={e => setFormData({...formData, luas: e.target.value})} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white font-black text-gray-700" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-600 mb-1 block tracking-wider">LUAS DIGUNAKAN</label>
                <input type="number" min="0" placeholder="Contoh: 1000" value={formData.luasDigunakan} onChange={e => setFormData({...formData, luasDigunakan: e.target.value})} className="w-full p-3 border-2 border-emerald-100 rounded-lg bg-emerald-50 text-emerald-700 font-black" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-600 mb-1 block tracking-wider">LUAS BELUM DIGUNAKAN</label>
                <input type="number" value={formData.luasBelumDigunakan} readOnly className="w-full p-3 border-2 border-amber-100 rounded-lg bg-amber-50 text-amber-700 font-black cursor-not-allowed" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN DATA LOKASI LEMBAGA"}
          </button>
        </form>
      </div>
    </div>
  );
}