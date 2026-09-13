"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TambahGedung() {
  const router = useRouter();
  const [listLahan, setListLahan] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    namaGedung: "", lahanId: "", jumlahLantai: "1", 
    kepemilikan: "Milik Sendiri", tahunDibangun: "", 
    panjang: "", lebar: "", kondisi: "Baik" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/sarpras/asset-tetap/lahan")
      .then(res => res.json())
      .then(json => {
        if (json.success) setListLahan(json.data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sarpras/asset-tetap/gedung", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Data Gedung berhasil ditambahkan!");
        router.push("/dashboard/sarpras/asset-tetap/gedung");
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
          <h1 className="text-xl font-black text-gray-800">Tambah Data Gedung</h1>
          <Link href="/dashboard/sarpras/asset-tetap/gedung" className="text-sm font-bold text-gray-500">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-600 border-b pb-2">A. Informasi Dasar Gedung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA GEDUNG / BANGUNAN</label>
                <input type="text" placeholder="Contoh: Gedung Kelas Utara" value={formData.namaGedung} onChange={e => setFormData({...formData, namaGedung: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
              </div>
              <div>
                {/* LABEL DIUBAH MENJADI NAMA LEMBAGA (LAHAN) */}
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">LOKASI LAHAN (NAMA LEMBAGA)</label>
                <select value={formData.lahanId} onChange={e => setFormData({...formData, lahanId: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold" required>
                  <option value="" disabled>-- Pilih Lokasi Lembaga / Lahan --</option>
                  {listLahan.map((lahan) => (
                    <option key={lahan.id} value={lahan.id}>{lahan.namaLahan}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">TAHUN DIBANGUN</label>
                <input type="text" placeholder="Contoh: 2015" value={formData.tahunDibangun} onChange={e => setFormData({...formData, tahunDibangun: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KEPEMILIKAN</label>
                <select value={formData.kepemilikan} onChange={e => setFormData({...formData, kepemilikan: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                  <option value="Milik Sendiri">Milik Sendiri</option>
                  <option value="Sewa">Sewa / Pinjam</option>
                  <option value="Pemerintah">Milik Pemerintah</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KONDISI KERUSAKAN</label>
                <select value={formData.kondisi} onChange={e => setFormData({...formData, kondisi: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold">
                  <option value="Baik">Baik (Tidak Rusak)</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Sedang">Rusak Sedang</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 border-b pb-2">B. Spesifikasi Ukuran (m)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-emerald-600 mb-1 block tracking-wider">UKURAN PANJANG (m)</label>
                <input type="number" step="0.01" placeholder="0" value={formData.panjang} onChange={e => setFormData({...formData, panjang: e.target.value})} className="w-full p-3 border-2 border-emerald-100 rounded-lg bg-emerald-50 text-emerald-700 font-black" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-600 mb-1 block tracking-wider">UKURAN LEBAR (m)</label>
                <input type="number" step="0.01" placeholder="0" value={formData.lebar} onChange={e => setFormData({...formData, lebar: e.target.value})} className="w-full p-3 border-2 border-emerald-100 rounded-lg bg-emerald-50 text-emerald-700 font-black" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">JUMLAH LANTAI</label>
                <input type="number" min="1" value={formData.jumlahLantai} onChange={e => setFormData({...formData, jumlahLantai: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : "SIMPAN DATA GEDUNG"}
          </button>
        </form>
      </div>
    </div>
  );
}