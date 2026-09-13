"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahBuku() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    kodeBuku: "", judulBuku: "", kategori: "Buku Teks Pelajaran", 
    pengarang: "", penerbit: "", tahunTerbit: "", 
    jumlahTotal: "", kondisiBaik: "", kondisiRusak: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hitung otomatis Total = Baik + Rusak
  useEffect(() => {
    const baik = Number(formData.kondisiBaik) || 0;
    const rusak = Number(formData.kondisiRusak) || 0;
    setFormData(prev => ({ ...prev, jumlahTotal: (baik + rusak).toString() }));
  }, [formData.kondisiBaik, formData.kondisiRusak]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sarpras/perpustakaan", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Data Buku berhasil ditambahkan!");
        router.push("/dashboard/sarpras/perpustakaan");
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
          <h1 className="text-xl font-black text-gray-800">Tambah Koleksi Perpustakaan</h1>
          <Link href="/dashboard/sarpras/perpustakaan" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 border-b pb-2">A. Identitas Buku / Literatur</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KODE BUKU / ISBN</label>
                <input type="text" placeholder="Opsional" value={formData.kodeBuku} onChange={e => setFormData({...formData, kodeBuku: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">JUDUL BUKU LENGKAP</label>
                <input type="text" placeholder="Contoh: Sejarah Kebudayaan Islam Kelas X" value={formData.judulBuku} onChange={e => setFormData({...formData, judulBuku: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">PENGARANG / PENULIS</label>
                <input type="text" placeholder="Contoh: Prof. Dr. Quraish Shihab" value={formData.pengarang} onChange={e => setFormData({...formData, pengarang: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KATEGORI KOLEKSI</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                  <option value="Buku Teks Pelajaran">Buku Teks Pelajaran</option>
                  <option value="Buku Referensi">Buku Referensi / Ensiklopedia</option>
                  <option value="Fiksi / Sastra">Fiksi / Sastra / Novel</option>
                  <option value="Jurnal / Majalah">Jurnal / Majalah</option>
                  <option value="Kitab / Agama">Kitab / Panduan Agama</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">PENERBIT</label>
                <input type="text" placeholder="Contoh: Erlangga" value={formData.penerbit} onChange={e => setFormData({...formData, penerbit: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">TAHUN TERBIT</label>
                <input type="number" placeholder="Contoh: 2022" value={formData.tahunTerbit} onChange={e => setFormData({...formData, tahunTerbit: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 border-b pb-2">B. Jumlah Koleksi & Kondisi Eksemplar</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-emerald-600 mb-1 block tracking-wider">KONDISI BAIK</label>
                <input type="number" min="0" placeholder="0" value={formData.kondisiBaik} onChange={e => setFormData({...formData, kondisiBaik: e.target.value})} className="w-full p-3 border-2 border-emerald-100 rounded-lg bg-emerald-50 text-emerald-700 font-black text-center text-lg" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-red-600 mb-1 block tracking-wider">KONDISI RUSAK</label>
                <input type="number" min="0" placeholder="0" value={formData.kondisiRusak} onChange={e => setFormData({...formData, kondisiRusak: e.target.value})} className="w-full p-3 border-2 border-red-100 rounded-lg bg-red-50 text-red-700 font-black text-center text-lg" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block tracking-wider">TOTAL EKS (Otomatis)</label>
                <input type="text" value={formData.jumlahTotal} readOnly className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-800 font-black text-center text-lg cursor-not-allowed" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN DATA KOLEKSI BUKU"}
          </button>
        </form>
      </div>
    </div>
  );
}