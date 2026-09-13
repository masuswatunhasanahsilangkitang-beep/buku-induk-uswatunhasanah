"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahKelulusanPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    santriId: "",
    tanggalLulus: "",
    tahunAjaran: "2025/2026",
    noSuratKelulusan: "",
    noIjazah: "",
    melanjutkanKe: "",
    keterangan: "",
  });

  // Mengambil daftar siswa dari API 
  useEffect(() => {
    async function fetchSantri() {
      try {
        const res = await fetch("/api/santri");
        const json = await res.json();
        if (json.success && json.data) {
          setSantriList(json.data);
        }
      } catch (error) {
        console.error("Gagal menarik data siswa:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSantri();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.santriId || !formData.tanggalLulus || !formData.tahunAjaran) {
      alert("Mohon pilih nama siswa, tanggal lulus, dan tahun ajaran!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/kelulusan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Sukses! Siswa berhasil diluluskan dan menjadi alumni.");
        router.push("/dashboard/kelulusan"); 
      } else {
        alert(`GAGAL MEMPROSES!\n\nPenyebab: ${result.message}`);
      }
    } catch (error) {
      alert("Koneksi terputus. Pastikan server berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-gray-600 font-bold text-sm tracking-widest uppercase">Memuat Daftar Siswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Information */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/santri" className="hover:text-emerald-600 transition-colors">Siswa</Link> 
              <span>&gt;</span> 
              <Link href="/dashboard/kelulusan" className="hover:text-emerald-600 transition-colors">Kelulusan</Link> 
              <span>&gt;</span> 
              <span className="font-semibold text-gray-600">Proses Kelulusan</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Proses Kelulusan Siswa</h1>
          </div>
          <Link href="/dashboard/kelulusan" className="px-5 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-bold">
            ← Kembali
          </Link>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
              <h2 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-1">Identitas Peserta Didik</h2>
              <p className="text-xs text-emerald-600">Pilih siswa kelas akhir yang akan ditetapkan kelulusannya menjadi alumni.</p>
            </div>

            {/* Pilih Siswa */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA SISWA *</label>
              <select 
                value={formData.santriId} 
                onChange={(e) => setFormData({ ...formData, santriId: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-emerald-500 focus:outline-none bg-white"
                required
              >
                <option value="" disabled>-- Pilih Siswa yang Lulus --</option>
                {santriList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.nisn} - {siswa.namaLengkap}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tanggal Lulus */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL KELULUSAN *</label>
                <input 
                  type="date" 
                  value={formData.tanggalLulus} 
                  onChange={(e) => setFormData({ ...formData, tanggalLulus: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Tahun Ajaran */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TAHUN AJARAN LULUS *</label>
                <input 
                  type="text" 
                  value={formData.tahunAjaran} 
                  onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-emerald-500 focus:outline-none"
                  placeholder="2025/2026"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nomor Surat */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR SK KELULUSAN (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.noSuratKelulusan} 
                  onChange={(e) => setFormData({ ...formData, noSuratKelulusan: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Nomor Ijazah */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR IJAZAH (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.noIjazah} 
                  onChange={(e) => setFormData({ ...formData, noIjazah: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Melanjutkan Ke */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">MELANJUTKAN PENDIDIKAN KE (Opsional)</label>
              <input 
                type="text" 
                placeholder="Nama Universitas / Sekolah Lanjutan"
                value={formData.melanjutkanKe} 
                onChange={(e) => setFormData({ ...formData, melanjutkanKe: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Keterangan */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KETERANGAN TAMBAHAN</label>
              <textarea 
                rows={2} 
                value={formData.keterangan} 
                onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-emerald-500 focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Link href="/dashboard/kelulusan" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${isSubmitting ? 'bg-emerald-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {isSubmitting ? "MEMPROSES..." : "TETAPKAN KELULUSAN"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}