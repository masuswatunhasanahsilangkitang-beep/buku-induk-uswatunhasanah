"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

// 1. Fungsi utama komponen internal
function FormTambahContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const santriIdParam = searchParams.get("santriId");

  const [santriInfo, setSantriInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    santriId: "",
    tanggal: new Date().toISOString().split("T")[0],
    kategori: "Ringan",
    bentuk: "",
    poin: 5,
    tindakan: "",
    petugas: ""
  });

  // Tarik data detail siswa berdasarkan NISN/ID dari Scanner
  useEffect(() => {
    async function fetchDetailSiswa() {
      if (!santriIdParam) {
        setLoading(false);
        return;
      }
      try {
        // PERBAIKAN: Ambil daftar santri lalu cari kecocokan NISN atau ID
        const res = await fetch(`/api/santri`);
        const json = await res.json();
        
        if (json.success && json.data?.santri) {
          // Cari siswa yang NISN atau ID-nya sama dengan hasil scan
          const siswaDitemukan = json.data.santri.find(
            (s: any) => s.nisn === santriIdParam || s.id === santriIdParam
          );

          if (siswaDitemukan) {
            setSantriInfo(siswaDitemukan);
            // PENTING: Selalu simpan UUID asli database ke dalam form, bukan NISN
            setFormData(prev => ({ ...prev, santriId: siswaDitemukan.id }));
          }
        }
      } catch (error) {
        console.error("Gagal memuat profil siswa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetailSiswa();
  }, [santriIdParam]);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.santriId || !formData.bentuk) {
      alert("Data pelanggaran belum lengkap!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/pelanggaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (res.ok && json.success) {
        alert("✅ Catatan pelanggaran berhasil disimpan!");
        router.push("/dashboard/pelanggaran");
      } else {
        alert(`Gagal: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400 font-bold animate-pulse">Memuat Profil Siswa...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Form Catat Pelanggaran</h1>
            <p className="text-xs text-gray-500">Pencatatan cepat hasil pemindaian kartu pelajar.</p>
          </div>
          <Link href="/dashboard/pelanggaran/scan" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-700">
            &larr; Scan Ulang
          </Link>
        </div>

        {/* KARTU PROFIL SISWA YANG DI-SCAN */}
        {santriInfo ? (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md flex items-center gap-4">
            <div className="w-14 h-18 bg-white/20 rounded-lg overflow-hidden flex items-center justify-center font-bold text-xs flex-shrink-0 border border-white/30">
              {santriInfo.fileFotoSiswa ? <img src={santriInfo.fileFotoSiswa} alt="" className="w-full h-full object-cover" /> : "FOTO"}
            </div>
            <div>
              <span className="px-2 py-0.5 bg-blue-500 text-white rounded text-[10px] font-bold uppercase">Siswa Teridentifikasi</span>
              <h2 className="text-lg font-black uppercase mt-1">{santriInfo.namaLengkap}</h2>
              <p className="text-xs text-blue-200 font-mono">NISN: {santriInfo.nisn} | Kelas: {santriInfo.rombel?.namaRombel || "Belum ada kelas"}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold">
            ⚠️ Perhatian: Anda belum memilih siswa via scan. Silakan lakukan scan terlebih dahulu atau pilih dari daftar utama.
          </div>
        )}

        {/* FORM INPUT PELANGGARAN */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Tanggal Kejadian *</label>
              <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Kategori Pelanggaran</label>
              <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm font-bold text-red-600 bg-white">
                <option value="Ringan">Ringan</option>
                <option value="Sedang">Sedang</option>
                <option value="Berat">Berat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <label className="block text-xs font-bold text-gray-500 mb-1">Bentuk Pelanggaran *</label>
              <input type="text" name="bentuk" value={formData.bentuk} onChange={handleChange} placeholder="Contoh: Terlambat Masuk Sekolah" required className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Poin</label>
              <input type="number" name="poin" value={formData.poin} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Tindakan / Pembinaan (Opsional)</label>
            <input type="text" name="tindakan" value={formData.tindakan} onChange={handleChange} placeholder="Contoh: Diberi peringatan lisan" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Nama Petugas / Guru BK</label>
            <input type="text" name="petugas" value={formData.petugas} onChange={handleChange} placeholder="Nama Anda" className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <Link href="/dashboard/pelanggaran" className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Batal</Link>
            <button type="submit" disabled={isSubmitting || !santriInfo} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow disabled:opacity-50">
              {isSubmitting ? "Menyimpan..." : "Simpan Catatan Pelanggaran"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

// 2. Pembungkus Suspense
export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-400 font-bold animate-pulse">Memuat form pencatatan...</div>}>
      <FormTambahContent />
    </Suspense>
  );
}