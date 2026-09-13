"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahMutasiPage() {
  const router = useRouter();
  const [santriList, setSantriList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    santriId: "",
    jenisMutasi: "Pindah Sekolah",
    tanggalMutasi: "",
    alasan: "",
    sekolahTujuan: "",
    noSuratMutasi: "",
  });

  // PERUBAHAN PENTING: Panggil API /mutasi agar hanya siswa AKTIF yang muncul di dropdown
  useEffect(() => {
    async function fetchSantri() {
      try {
        const res = await fetch("/api/mutasi"); 
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
    
    if (!formData.santriId || !formData.tanggalMutasi) {
      alert("Mohon pilih nama siswa dan isi tanggal mutasi!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/mutasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Sukses! Data mutasi berhasil dicatat dan Siswa telah dikeluarkan dari kelas.");
        router.push("/dashboard/mutasi"); // Kembali ke tabel mutasi
      } else {
        alert(`GAGAL MENYIMPAN!\n\nPenyebab: ${result.message}`);
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
          <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
              <Link href="/dashboard/santri" className="hover:text-blue-600 transition-colors">Siswa</Link> 
              <span>&gt;</span> 
              <Link href="/dashboard/mutasi" className="hover:text-blue-600 transition-colors">Mutasi Siswa</Link> 
              <span>&gt;</span> 
              <span className="font-semibold text-gray-600">Catat Mutasi</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Catat Mutasi Baru</h1>
          </div>
          <Link href="/dashboard/mutasi" className="px-5 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-bold">
            ← Kembali
          </Link>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h2 className="text-sm font-black text-blue-800 uppercase tracking-wider mb-1">Identitas Siswa</h2>
              <p className="text-xs text-blue-600">Pilih siswa yang akan dicatat sebagai mutasi/keluar.</p>
            </div>

            {/* Pilih Siswa */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA SISWA *</label>
              <select 
                value={formData.santriId} 
                onChange={(e) => setFormData({ ...formData, santriId: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none bg-white"
                required
              >
                <option value="" disabled>-- Pilih Siswa Aktif --</option>
                {santriList.length === 0 && <option value="" disabled>Tidak ada siswa aktif (Semua sudah lulus/keluar)</option>}
                {santriList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.namaLengkap} - (Kelas: {siswa.rombel?.namaRombel || "Belum Dimasukkan Kelas"})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jenis Mutasi */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">JENIS MUTASI *</label>
                <select 
                  value={formData.jenisMutasi} 
                  onChange={(e) => setFormData({ ...formData, jenisMutasi: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="Pindah Sekolah">Pindah Sekolah</option>
                  <option value="Mengundurkan Diri">Mengundurkan Diri</option>
                  <option value="Dikeluarkan">Dikeluarkan</option>
                  <option value="Wafat">Wafat</option>
                </select>
              </div>

              {/* Tanggal Mutasi */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL MUTASI *</label>
                <input 
                  type="date" 
                  value={formData.tanggalMutasi} 
                  onChange={(e) => setFormData({ ...formData, tanggalMutasi: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Sekolah Tujuan & No Surat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">SEKOLAH TUJUAN (Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Hanya diisi jika Pindah Sekolah"
                  value={formData.sekolahTujuan} 
                  onChange={(e) => setFormData({ ...formData, sekolahTujuan: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR SURAT MUTASI (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.noSuratMutasi} 
                  onChange={(e) => setFormData({ ...formData, noSuratMutasi: e.target.value })} 
                  className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Alasan */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">ALASAN MUTASI / KETERANGAN</label>
              <textarea 
                rows={3} 
                value={formData.alasan} 
                onChange={(e) => setFormData({ ...formData, alasan: e.target.value })} 
                className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none resize-none"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Link href="/dashboard/mutasi" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${isSubmitting ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? "MEMPROSES..." : "SIMPAN MUTASI"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}