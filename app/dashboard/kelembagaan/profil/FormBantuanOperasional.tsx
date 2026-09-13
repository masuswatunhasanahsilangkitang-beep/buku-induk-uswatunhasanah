"use client";
import { useState, useEffect } from "react";

export default function FormBantuanOperasional() {
  const [listBantuan, setListBantuan] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    tahun: "", namaBantuan: "", sumberDana: "APBN (Pemerintah Pusat)", nominal: "", keterangan: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBantuan = async () => {
    setIsLoading(true);
    const res = await fetch("/api/kelembagaan/bantuan-operasional");
    const json = await res.json();
    if (json.success) setListBantuan(json.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBantuan();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kelembagaan/bantuan-operasional", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ tahun: "", namaBantuan: "", sumberDana: "APBN (Pemerintah Pusat)", nominal: "", keterangan: "" });
        fetchBantuan();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data bantuan ini dari daftar?")) return;
    await fetch(`/api/kelembagaan/bantuan-operasional?id=${id}`, { method: "DELETE" });
    fetchBantuan();
  };

  return (
    <div className="space-y-8 mt-4 animate-in fade-in duration-300">
      
      {/* FORM INPUT BANTUAN BARU */}
      <form onSubmit={handleAdd} className="p-6 bg-blue-50/50 border border-blue-100 rounded-xl space-y-6 shadow-sm">
        <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
          <span>💰</span> Catat Riwayat Bantuan Operasional
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">TAHUN ANGGARAN</label>
            <input type="text" value={formData.tahun} onChange={e => setFormData({...formData, tahun: e.target.value})} placeholder="Contoh: 2025" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
          <div className="relative md:col-span-2">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">NAMA BANTUAN OPERASIONAL</label>
            <input type="text" value={formData.namaBantuan} onChange={e => setFormData({...formData, namaBantuan: e.target.value})} placeholder="Contoh: Bantuan Operasional Sekolah (BOS) Reguler" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">SUMBER DANA</label>
            <select value={formData.sumberDana} onChange={e => setFormData({...formData, sumberDana: e.target.value})} className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
              <option value="APBN (Pemerintah Pusat)">APBN (Pemerintah Pusat)</option>
              <option value="APBD Provinsi">APBD Provinsi</option>
              <option value="APBD Kabupaten/Kota">APBD Kabupaten/Kota</option>
              <option value="Yayasan / Swasta">Yayasan / Swasta</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div className="relative">
            <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">NOMINAL / JUMLAH DANA</label>
            <input type="text" value={formData.nominal} onChange={e => setFormData({...formData, nominal: e.target.value})} placeholder="Contoh: Rp 120.000.000" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" required />
          </div>
        </div>

        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-blue-50 px-1 text-[10px] font-bold text-blue-500">KETERANGAN / PERUNTUKAN (OPSIONAL)</label>
          <input type="text" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} placeholder="Contoh: Dialokasikan untuk pemeliharaan sarpras dan buku" className="w-full px-4 py-3 border border-blue-200 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm text-xs transition-colors">
            {isSubmitting ? "MENYIMPAN..." : "+ SIMPAN BANTUAN"}
          </button>
        </div>
      </form>

      {/* TABEL DAFTAR BANTUAN */}
      <div>
        <h3 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Daftar Riwayat Bantuan Operasional</h3>
        
        {isLoading ? (
          <p className="text-center text-gray-400 text-sm font-semibold py-8 animate-pulse">Memuat data...</p>
        ) : listBantuan.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <span className="text-4xl text-gray-300">📊</span>
            <p className="text-gray-400 text-sm font-semibold mt-2">Belum ada riwayat bantuan operasional.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-100 rounded-xl shadow-sm">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3">Tahun</th>
                  <th className="px-6 py-3">Nama Bantuan</th>
                  <th className="px-6 py-3">Sumber Dana</th>
                  <th className="px-6 py-3">Nominal</th>
                  <th className="px-6 py-3">Keterangan</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {listBantuan.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">{item.tahun}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.namaBantuan}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">{item.sumberDana}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{item.nominal}</td>
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