"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahRombelPage() {
  const router = useRouter();
  const [guruList, setGuruList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    namaRombel: "",
    tingkat: "Kelas 10",
    tahunAjaran: "2026/2027 - Ganjil",
    waliKelasId: "",
  });

  // Opsi Tingkat Kelas (Digabung untuk MTs/MA dan PKPPS)
  const opsiTingkat = [
    "Kelas 7 (MTs/Wustha)",
    "Kelas 8 (MTs/Wustha)",
    "Kelas 9 (MTs/Wustha)",
    "Kelas 10 (MA/Ulya)",
    "Kelas 11 (MA/Ulya)",
    "Kelas 12 (MA/Ulya)",
  ];

  // Mengambil daftar Guru untuk pilihan Wali Kelas
  useEffect(() => {
    async function fetchGuru() {
      try {
        const res = await fetch("/api/guru");
        const json = await res.json();
        if (json.success && json.data) {
          setGuruList(json.data);
        }
      } catch (error) {
        console.error("Gagal menarik data guru:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGuru();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.namaRombel.trim() || !formData.tingkat || !formData.tahunAjaran) {
      alert("Mohon lengkapi Nama Rombel, Tingkat, dan Tahun Ajaran!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/rombel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Sukses! Kelas baru berhasil dibuat.");
        router.push("/dashboard/rombel"); // Kembali ke halaman utama Rombel
      } else {
        alert(`GAGAL MEMBUAT KELAS!\n\nPenyebab: ${result.message}`);
      }
    } catch (error) {
      alert("Koneksi terputus. Pastikan server berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Header Information */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/rombel" className="hover:text-blue-600 transition-colors">Rombongan Belajar</Link> 
              <span>&gt;</span> 
              <span className="font-semibold text-gray-600">Buat Kelas Baru</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Manajemen Kelas Baru</h1>
          </div>
          <Link href="/dashboard/rombel" className="px-5 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-bold">
            ← Kembali
          </Link>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h2 className="text-sm font-black text-blue-800 uppercase tracking-wider mb-1">Identitas Rombongan Belajar</h2>
            <p className="text-xs text-blue-600">Buat ruang kelas baru untuk menampung peserta didik.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Nama Rombel */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA KELAS / ROMBEL *</label>
              <input 
                type="text" 
                placeholder="Contoh: Kelas X-A (MIPA)"
                value={formData.namaRombel} 
                onChange={(e) => setFormData({ ...formData, namaRombel: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-bold text-gray-800 focus:border-blue-500 focus:outline-none uppercase"
                required
              />
            </div>

            {/* Tingkat Kelas */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TINGKAT KELAS *</label>
              <select 
                value={formData.tingkat} 
                onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none bg-white"
                required
              >
                {opsiTingkat.map((tk) => (
                  <option key={tk} value={tk}>{tk}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tahun Ajaran */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TAHUN AJARAN *</label>
              <input 
                type="text" 
                value={formData.tahunAjaran} 
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none bg-gray-50"
                required
              />
            </div>

            {/* Wali Kelas */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">WALI KELAS (Opsional)</label>
              <select 
                value={formData.waliKelasId} 
                onChange={(e) => setFormData({ ...formData, waliKelasId: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none bg-white"
                disabled={isLoading}
              >
                <option value="">-- Belum Ditentukan --</option>
                {guruList.map((guru) => (
                  <option key={guru.id} value={guru.id}>
                    {guru.namaLengkap}
                  </option>
                ))}
              </select>
              {isLoading && <p className="text-[10px] text-blue-500 mt-1 absolute -bottom-4">Memuat data guru...</p>}
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-gray-200">
            <Link href="/dashboard/rombel" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN KELAS"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}