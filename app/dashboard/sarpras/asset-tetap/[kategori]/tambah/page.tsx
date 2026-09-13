"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

const mapKategori: Record<string, string> = {
  "air-sanitasi": "Air Sanitasi",
  "mebel": "Mebel",
  "administrasi": "Sarana Administrasi",
  "penunjang": "Perlengkapan Penunjang",
  "olahraga-seni": "Olah Raga & Seni",
  "laboratorium": "Perlengkapan Laboratorium",
  "keterampilan": "Fasilitas Keterampilan",
  "listrik-internet": "Listrik dan Internet",
  "tambahan": "Kebutuhan Tambahan",
  "pembelajaran": "Sarana Pembelajaran",
};

export default function TambahAsetDinamis() {
  const router = useRouter();
  const params = useParams();
  const slugKategori = params.kategori as string;
  const namaKategori = mapKategori[slugKategori] || "Aset";

  const [listRuangan, setListRuangan] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    kategori: namaKategori, // Terisi otomatis sesuai URL
    namaAset: "", ruanganId: "", 
    jumlahTotal: "", kondisiBaik: "", kondisiRusak: "", keterangan: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil daftar Ruangan agar aset bisa ditempatkan
  useEffect(() => {
    fetch("/api/sarpras/asset-tetap/ruangan")
      .then(res => res.json())
      .then(json => {
        if (json.success) setListRuangan(json.data);
      });
  }, []);

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
      const res = await fetch("/api/sarpras/asset-tetap/aset-ruangan", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(`Data ${namaKategori} berhasil ditambahkan!`);
        router.push(`/dashboard/sarpras/asset-tetap/${slugKategori}`);
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
          <h1 className="text-xl font-black text-gray-800 uppercase">Tambah {namaKategori}</h1>
          <Link href={`/dashboard/sarpras/asset-tetap/${slugKategori}`} className="text-sm font-bold text-gray-500">Batal</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-blue-600 border-b pb-2">A. Informasi Barang / Aset</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">NAMA ASET (Contoh: Kursi Siswa)</label>
                <input type="text" value={formData.namaAset} onChange={e => setFormData({...formData, namaAset: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold uppercase" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">LOKASI PENEMPATAN (RUANGAN)</label>
                <select value={formData.ruanganId} onChange={e => setFormData({...formData, ruanganId: e.target.value})} className="w-full p-3 border rounded-lg bg-white font-semibold" required>
                  <option value="" disabled>-- Pilih Ruangan --</option>
                  {listRuangan.map((ruangan) => (
                    <option key={ruangan.id} value={ruangan.id}>
                      {ruangan.namaRuangan} ({ruangan.gedung?.namaGedung || "Tanpa Gedung"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 mb-1 block tracking-wider">KETERANGAN / CATATAN LAIN</label>
              <input type="text" placeholder="Opsional (Misal: Pengadaan Dana BOS 2026)" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 font-semibold" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-emerald-600 border-b pb-2">B. Jumlah & Kondisi (Otomatis Dihitung)</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-emerald-600 mb-1 block tracking-wider">JUMLAH BAIK</label>
                <input type="number" min="0" placeholder="0" value={formData.kondisiBaik} onChange={e => setFormData({...formData, kondisiBaik: e.target.value})} className="w-full p-3 border-2 border-emerald-100 rounded-lg bg-emerald-50 text-emerald-700 font-black text-center text-lg" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-red-600 mb-1 block tracking-wider">JUMLAH RUSAK</label>
                <input type="number" min="0" placeholder="0" value={formData.kondisiRusak} onChange={e => setFormData({...formData, kondisiRusak: e.target.value})} className="w-full p-3 border-2 border-red-100 rounded-lg bg-red-50 text-red-700 font-black text-center text-lg" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block tracking-wider">TOTAL KESELURUHAN</label>
                <input type="text" value={formData.jumlahTotal} readOnly className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-800 font-black text-center text-lg cursor-not-allowed" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white font-black rounded-lg hover:bg-blue-700 transition-colors shadow-md mt-4">
            {isSubmitting ? "MENYIMPAN DATA..." : `SIMPAN DATA ${namaKategori.toUpperCase()}`}
          </button>
        </form>
      </div>
    </div>
  );
}