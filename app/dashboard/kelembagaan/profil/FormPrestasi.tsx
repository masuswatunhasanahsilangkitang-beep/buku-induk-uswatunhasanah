"use client";
import { useState, useEffect } from "react";

export default function FormPrestasi() {
  const [listPrestasi, setListPrestasi] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    tahun: "", namaKejuaraan: "", tingkat: "Kabupaten/Kota", pencapaian: "", penyelenggara: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrestasi = async () => {
    setIsLoading(true);
    const res = await fetch("/api/kelembagaan/prestasi");
    const json = await res.json();
    if (json.success) setListPrestasi(json.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPrestasi();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/prestasi", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ tahun: "", namaKejuaraan: "", tingkat: "Kabupaten/Kota", pencapaian: "", penyelenggara: "" });
        fetchPrestasi();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data prestasi ini?")) return;
    await fetch(`/api/kelembagaan/prestasi?id=${id}`, { method: "DELETE" });
    fetchPrestasi();
  };

  return (
    <div className="space-y-8 mt-4 animate-in fade-in duration-300">
      
      {/* FORM INPUT PRESTASI BARU */}
      <form onSubmit={handleAdd} className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
          <span>🏆</span> Tambah Catatan Prestasi / Penghargaan Lembaga
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">TAHUN</label>
            <input type="text" value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})} placeholder="Contoh: 2025" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
          <div className="relative md:col-span-2">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">NAMA KEJUARAAN / LOMBA</label>
            <input type="text" value={formData.namaKejuaraan} onChange={e => setFormData({...formData, namaKejuaraan: e.target.value})} placeholder="Contoh: Kompetisi Sains Madrasah (KSM)" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">TINGKAT</label>
            <select value={formData.tingkat} onChange={e => setFormData({...formData, tingkat: e.target.value})} className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
              <option value="Kabupaten/Kota">Kabupaten/Kota</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">PENCAPAIAN / PREDIKAT</label>
            <input type="text" value={formData.pencapaian} onChange={e => setFormData({...formData, pencapaian: e.target.value})} placeholder="Contoh: Juara 1 / Medali Emas" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">PENYELENGGARA</label>
            <input type="text" value={formData.penyelenggara} onChange={e => setFormData({...formData, penyelenggara: e.target.value})} placeholder="Contoh: Kementerian Agama" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm text-xs transition-colors">
            {isSubmitting ? "MENYIMPAN..." : "+ SIMPAN PRESTASI"}
          </button>
        </div>
      </form>

      {/* TABEL DAFTAR PRESTASI */}
      <div>
        <h3 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Dokumentasi Prestasi Madrasah</h3>
        
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm font-semibold py-8 animate-pulse">Memuat data...</p>
        ) : listPrestasi.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl text-gray-300">🏅</span>
            <p className="text-gray-400 text-sm font-semibold mt-2">Belum ada catatan prestasi lembaga.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Tahun</th>
                  <th className="px-6 py-3">Nama Kejuaraan</th>
                  <th className="px-6 py-3">Tingkat</th>
                  <th className="px-6 py-3">Pencapaian</th>
                  <th className="px-6 py-3">Penyelenggara</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listPrestasi.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{item.tahun}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.namaKejuaraan}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">{item.tingkat}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{item.pencapaian}</td>
                    <td className="px-6 py-4 text-xs">{item.penyelenggara || "-"}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded text-xs transition-colors">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}