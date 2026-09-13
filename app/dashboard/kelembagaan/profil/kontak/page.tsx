"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilKontakPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    telepon: "", 
    email: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kelembagaan/profil")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFormData({
            telepon: json.data.telepon || "",
            email: json.data.email || "",
            website: json.data.website || "",
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
        alert("Informasi Kontak berhasil diperbarui!");
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center font-bold text-gray-500">Memuat data Kontak...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-gray-800">Informasi Kontak & Media</h1>
            <p className="text-xs text-gray-500 mt-1">Saluran komunikasi resmi lembaga pendidikan.</p>
          </div>
          <Link href="/dashboard/kelembagaan" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
            Kembali ke Dasbor
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NOMOR TELEPON / WA KANTOR</label>
              <input 
                type="text" 
                placeholder="Contoh: 0812-3456-7890"
                value={formData.telepon} 
                onChange={e => setFormData({...formData, telepon: e.target.value})} 
                className="w-full p-4 border rounded-lg bg-gray-50 font-semibold" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">EMAIL RESMI MADRASAH</label>
              <input 
                type="email" 
                placeholder="Contoh: info@uswatunhasanah.sch.id"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full p-4 border rounded-lg bg-gray-50 font-semibold text-blue-700" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">WEBSITE RESMI (URL)</label>
            <input 
              type="text" 
              placeholder="Contoh: https://www.uswatunhasanah.sch.id"
              value={formData.website} 
              onChange={e => setFormData({...formData, website: e.target.value})} 
              className="w-full p-4 border rounded-lg bg-white font-semibold text-gray-600" 
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-black rounded-lg hover:bg-indigo-700 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN INFORMASI KONTAK"}
          </button>
        </form>
      </div>
    </div>
  );
}