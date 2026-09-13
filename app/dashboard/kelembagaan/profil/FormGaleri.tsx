"use client";
import { useState, useEffect } from "react";

export default function FormGaleri() {
  const [listFoto, setListFoto] = useState<any[]>([]);
  const [formData, setFormData] = useState({ judulFoto: "", urlFoto: "", keterangan: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk menarik data galeri dari database
  const fetchGaleri = async () => {
    setIsLoading(true);
    const res = await fetch("/api/kelembagaan/galeri");
    const json = await res.json();
    if (json.success) setListFoto(json.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGaleri();
  }, []);

  // Fungsi tambah foto
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/galeri", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ judulFoto: "", urlFoto: "", keterangan: "" }); // Kosongkan form
        fetchGaleri(); // Muat ulang daftar foto
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi hapus foto
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus foto ini dari galeri?")) return;
    
    await fetch(`/api/kelembagaan/galeri?id=${id}`, { method: "DELETE" });
    fetchGaleri();
  };

  return (
    <div className="space-y-8 mt-4 animate-in fade-in duration-300">
      
      {/* AREA 1: FORM TAMBAH FOTO */}
      <form onSubmit={handleAdd} className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2">
          <span className="text-lg">📸</span> Tambah Dokumentasi Sarpras
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">NAMA FASILITAS / JUDUL</label>
            <input type="text" value={formData.judulFoto} onChange={e => setFormData({...formData, judulFoto: e.target.value})} placeholder="Contoh: Gedung Laboratorium Komputer" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">TAUTAN (URL) FOTO</label>
            <input type="url" value={formData.urlFoto} onChange={e => setFormData({...formData, urlFoto: e.target.value})} placeholder="https://contoh.com/foto-lab.jpg" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-mono" required />
          </div>
          <div className="relative md:col-span-2">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">KETERANGAN (OPSIONAL)</label>
            <input type="text" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} placeholder="Contoh: Bantuan PUPR Tahun 2025" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm text-xs transition-colors">
            {isSubmitting ? "MENGUNGGAH..." : "+ TAMBAHKAN KE GALERI"}
          </button>
        </div>
      </form>

      {/* AREA 2: ALBUM GALERI (GRID) */}
      <div>
        <h3 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Album Fasilitas Madrasah</h3>
        
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm font-semibold py-8 animate-pulse">Memuat galeri...</p>
        ) : listFoto.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl text-gray-300">🏜️</span>
            <p className="text-gray-400 text-sm font-semibold mt-2">Belum ada foto yang ditambahkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listFoto.map((foto) => (
              <div key={foto.id} className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                
                {/* Tombol Hapus (Muncul saat di-hover) */}
                <button onClick={() => handleDelete(foto.id)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10" title="Hapus Foto">
                  ✕
                </button>

                {/* Gambar */}
                <div className="h-48 w-full bg-gray-100 overflow-hidden">
                  <img src={foto.urlFoto} alt={foto.judulFoto} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* Deskripsi */}
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{foto.judulFoto}</h4>
                  {foto.keterangan && <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{foto.keterangan}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}