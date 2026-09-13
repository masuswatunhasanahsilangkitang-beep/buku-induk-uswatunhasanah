"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilLokasiPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    alamatLengkap: "", 
    desaKelurahan: "", 
    kecamatan: "", 
    kabupatenKota: "", 
    provinsi: "", 
    kodePos: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil data yang sudah ada di database
  useEffect(() => {
    fetch("/api/kelembagaan/profil")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          // Hanya mengambil data lokasi agar form lain tidak terganggu
          setFormData({
            alamatLengkap: json.data.alamatLengkap || "",
            desaKelurahan: json.data.desaKelurahan || "",
            kecamatan: json.data.kecamatan || "",
            kabupatenKota: json.data.kabupatenKota || "",
            provinsi: json.data.provinsi || "",
            kodePos: json.data.kodePos || "",
          });
        }
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/profil", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(formData), // Hanya mengirim update lokasi
      });
      if (res.ok) {
        alert("Data Lokasi Lembaga berhasil diperbarui!");
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center font-bold text-gray-500">Memuat data Lokasi...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header dengan Navigasi Tab Bayangan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-gray-800">Detail Lokasi & Alamat</h1>
            <p className="text-xs text-gray-500 mt-1">Lengkapi titik koordinat dan alamat surat-menyurat madrasah.</p>
          </div>
          <Link href="/dashboard/kelembagaan" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
            Kembali ke Dasbor
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-indigo-600 border-b pb-2">A. Alamat Utama</h2>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">ALAMAT LENGKAP (JALAN, RT/RW, DUSUN)</label>
              <textarea 
                placeholder="Contoh: Jl. Lintas Timur Sumatera Km. 50, Dusun Sukamaju RT 01 RW 02"
                value={formData.alamatLengkap} 
                onChange={e => setFormData({...formData, alamatLengkap: e.target.value})} 
                className="w-full p-4 border rounded-lg bg-gray-50 font-semibold" 
                rows={3} 
                required 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-indigo-600 border-b pb-2">B. Wilayah Administratif</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">DESA / KELURAHAN</label>
                <input type="text" value={formData.desaKelurahan} onChange={e => setFormData({...formData, desaKelurahan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KECAMATAN</label>
                <input type="text" value={formData.kecamatan} onChange={e => setFormData({...formData, kecamatan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KABUPATEN / KOTA</label>
                <input type="text" value={formData.kabupatenKota} onChange={e => setFormData({...formData, kabupatenKota: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">PROVINSI</label>
                <input type="text" value={formData.provinsi} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold uppercase" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-1/3">
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KODE POS</label>
              <input type="text" placeholder="Misal: 20222" value={formData.kodePos} onChange={e => setFormData({...formData, kodePos: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-mono font-bold text-gray-700 tracking-widest" required />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg hover:bg-indigo-700 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN DATA LOKASI"}
          </button>
        </form>
      </div>
    </div>
  );
}