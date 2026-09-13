"use client";
import { useState, useEffect } from "react";

export default function FormProgram() {
  const [listProgram, setListProgram] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    namaProgram: "", jenisProgram: "Keagamaan", keterangan: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgram = async () => {
    setIsLoading(true);
    const res = await fetch("/api/kelembagaan/program");
    const json = await res.json();
    if (json.success) setListProgram(json.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProgram();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/program", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ namaProgram: "", jenisProgram: "Keagamaan", keterangan: "" });
        fetchProgram();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus program ini dari daftar?")) return;
    await fetch(`/api/kelembagaan/program?id=${id}`, { method: "DELETE" });
    fetchProgram();
  };

  return (
    <div className="space-y-8 mt-4 animate-in fade-in duration-300">
      
      {/* FORM INPUT PROGRAM BARU */}
      <form onSubmit={handleAdd} className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
          <span>📚</span> Tambah Program & Layanan Madrasah
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">NAMA PROGRAM / KEGIATAN</label>
            <input type="text" value={formData.namaProgram} onChange={e => setFormData({...formData, namaProgram: e.target.value})} placeholder="Contoh: Program Unggulan Tahfidz Al-Qur'an" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">JENIS / KATEGORI PROGRAM</label>
            <select value={formData.jenisProgram} onChange={e => setFormData({...formData, jenisProgram: e.target.value})} className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
              <option value="Keagamaan">Keagamaan</option>
              <option value="Akademik">Akademik</option>
              <option value="Ekstrakurikuler">Ekstrakurikuler</option>
              <option value="Layanan Khusus">Layanan Khusus</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">KETERANGAN / DESKRIPSI SINGKAT</label>
          <input type="text" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} placeholder="Contoh: Target hafalan minimal 3 juz selama masa studi" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm text-xs transition-colors">
            {isSubmitting ? "MENYIMPAN..." : "+ SIMPAN PROGRAM"}
          </button>
        </div>
      </form>

      {/* TABEL DAFTAR PROGRAM */}
      <div>
        <h3 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Daftar Program & Layanan Diselenggarakan</h3>
        
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm font-semibold py-8 animate-pulse">Memuat data...</p>
        ) : listProgram.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl text-gray-300">📋</span>
            <p className="text-gray-400 text-sm font-semibold mt-2">Belum ada program yang didaftarkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Nama Program</th>
                  <th className="px-6 py-3">Jenis Program</th>
                  <th className="px-6 py-3">Keterangan</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listProgram.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30">
                    <td className="px-6 py-4 font-bold text-gray-800">{item.namaProgram}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">{item.jenisProgram}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{item.keterangan || "-"}</td>
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