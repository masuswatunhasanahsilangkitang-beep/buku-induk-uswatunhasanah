"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilPimpinanPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    namaKepala: "", 
    nipKepala: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kelembagaan/profil")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFormData({
            namaKepala: json.data.namaKepala || "",
            nipKepala: json.data.nipKepala || "",
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
        body: JSON.stringify(formData), 
      });
      if (res.ok) {
        alert("Data Pimpinan berhasil diperbarui!");
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center font-bold text-gray-500">Memuat data Pimpinan...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-gray-800">Data Pimpinan Madrasah</h1>
            <p className="text-xs text-gray-500 mt-1">Kelola informasi Kepala Madrasah yang sedang menjabat.</p>
          </div>
          <Link href="/dashboard/kelembagaan" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
            Kembali ke Dasbor
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA LENGKAP KEPALA MADRASAH (Beserta Gelar)</label>
            <input 
              type="text" 
              placeholder="Contoh: H. Ahmad Dahlan, S.Pd., M.Pd."
              value={formData.namaKepala} 
              onChange={e => setFormData({...formData, namaKepala: e.target.value})} 
              className="w-full p-4 border-2 border-indigo-50 rounded-lg bg-gray-50 font-bold uppercase text-gray-800" 
              required 
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NIP / NUPTK / PEG ID</label>
            <input 
              type="text" 
              placeholder="Kosongkan jika berstatus Non-PNS"
              value={formData.nipKepala} 
              onChange={e => setFormData({...formData, nipKepala: e.target.value})} 
              className="w-full p-4 border rounded-lg bg-white font-mono font-semibold tracking-widest text-gray-700" 
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg hover:bg-indigo-700 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN DATA PIMPINAN"}
          </button>
        </form>
      </div>
    </div>
  );
}