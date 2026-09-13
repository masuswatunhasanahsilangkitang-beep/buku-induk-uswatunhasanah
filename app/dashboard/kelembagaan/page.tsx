"use client";
import FormLokasi from "./profil/FormLokasi";
import FormGaleri from "./profil/FormGaleri";
import FormDokumenPerijinan from "./profil/FormDokumenPerijinan";
import FormPersonel from "./profil/FormPersonel";
import FormPrestasi from "./profil/FormPrestasi";
import FormProgram from "./profil/FormProgram";
import FormBantuanOperasional from "./profil/FormBantuanOperasional";
import CetakProfilPdf from "./profil/CetakProfilPdf";
import { useState, useEffect } from "react";

export default function ProfilKelembagaanPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("IDENTITAS");

  const [formData, setFormData] = useState({
    nsm: "", npsn: "", namaLembaga: "", namaSingkatan: "", statusLembaga: "Swasta", jenisLembaga: "Madrasah Aliyah",
    npwp: "", telepon: "", website: "", email: "", youtube: "", instagram: "",
    facebook: "", twitter: "", tahunBerdiri: "", waktuBelajar: "Pagi dan Siang", 
    statusKkm: "Anggota", namaMadrasahInduk: "", komiteLembaga: "Sudah Terbentuk",
    punyaErkam: false, diPesantren: false,
    penyelenggaraLembaga: "Yayasan", namaPenyelenggara: "", afiliasiKeagamaan: "Nahdlatul Ulama", nomorPokokYayasan: ""
  });

  const tabs = [
    "IDENTITAS", "LOKASI", "GALERI FOTO", "DOKUMEN PERIJINAN", 
    "PERSONEL", "PRESTASI", "PROGRAM YANG DISELENGGARAKAN", "BANTUAN OPERASIONAL"
  ];

  useEffect(() => {
    async function fetchProfil() {
      try {
        const res = await fetch("/api/kelembagaan");
        const json = await res.json();
        if (json.success && json.data) {
          const sanitizedData = Object.keys(json.data).reduce((acc, key) => {
            acc[key] = json.data[key] !== null ? json.data[key] : "";
            return acc;
          }, {} as any);
          setFormData(prev => ({ ...prev, ...sanitizedData }));
        }
      } catch (error) {
        console.error("Gagal menarik data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfil();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/kelembagaan", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok && result.success) alert("Sukses! Profil kelembagaan berhasil diperbarui.");
      else alert(`Gagal menyimpan data: ${result.message}`);
    } catch (error) {
      alert("Koneksi terputus. Pastikan server berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCetakLaporan = () => {
    window.print();
  };

  const renderKontenTab = () => {
    switch (activeTab) {
      case "IDENTITAS":
        return (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Identitas Madrasah</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NSM</label>
                <input type="text" value={formData.nsm} onChange={e => setFormData({...formData, nsm: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NPSN</label>
                <input type="text" value={formData.npsn} onChange={e => setFormData({...formData, npsn: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NAMA LEMBAGA</label>
              <input type="text" value={formData.namaLembaga} onChange={e => setFormData({...formData, namaLembaga: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" required />
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NAMA SINGKATAN</label>
              <input type="text" value={formData.namaSingkatan} onChange={e => setFormData({...formData, namaSingkatan: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">STATUS MADRASAH</label>
                <select value={formData.statusLembaga} onChange={e => setFormData({...formData, statusLembaga: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                  <option value="Negeri">Negeri</option><option value="Swasta">Swasta</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">JENIS LEMBAGA</label>
                <select value={formData.jenisLembaga} onChange={e => setFormData({...formData, jenisLembaga: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                  <option value="Raudhatul Athfal">Raudhatul Athfal</option><option value="Madrasah Ibtidaiyah">Madrasah Ibtidaiyah</option>
                  <option value="Madrasah Tsanawiyah">Madrasah Tsanawiyah</option><option value="Madrasah Aliyah">Madrasah Aliyah</option><option value="PKPPS">PKPPS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NPWP</label>
                <input type="text" value={formData.npwp} onChange={e => setFormData({...formData, npwp: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR TELEPON</label>
                <input type="text" value={formData.telepon} onChange={e => setFormData({...formData, telepon: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">ALAMAT WEBSITE</label>
                <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">EMAIL</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">YOUTUBE</label>
                <input type="text" placeholder="contoh: https://youtube.com/@sample" value={formData.youtube} onChange={e => setFormData({...formData, youtube: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">INSTAGRAM</label>
                <input type="text" placeholder="contoh: https://instagram.com/sample" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">FACEBOOK</label>
                <input type="text" placeholder="contoh: https://facebook.com/sample" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">TWITTER</label>
                <input type="text" placeholder="contoh: https://twitter.com/sample" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold text-gray-600" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">TAHUN BERDIRI</label>
                <input type="text" value={formData.tahunBerdiri} onChange={e => setFormData({...formData, tahunBerdiri: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">WAKTU BELAJAR</label>
                <select value={formData.waktuBelajar} onChange={e => setFormData({...formData, waktuBelajar: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                  <option value="Pagi">Pagi</option><option value="Siang">Siang</option><option value="Pagi dan Siang">Pagi dan Siang</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">STATUS KKM</label>
                <select value={formData.statusKkm} onChange={e => setFormData({...formData, statusKkm: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                  <option value="Anggota">Anggota</option><option value="Ketua">Ketua</option><option value="Bukan Anggota">Bukan Anggota</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NAMA MADRASAH INDUK</label>
                <input type="text" value={formData.namaMadrasahInduk} onChange={e => setFormData({...formData, namaMadrasahInduk: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">KOMITE LEMBAGA</label>
                <select value={formData.komiteLembaga} onChange={e => setFormData({...formData, komiteLembaga: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                  <option value="Sudah Terbentuk">Sudah Terbentuk</option><option value="Belum Terbentuk">Belum Terbentuk</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-b border-gray-100 pb-8">
              <label className="flex items-center justify-between cursor-pointer max-w-2xl">
                <span className="text-sm font-medium text-gray-700">Apakah Madrasah mempunyai dokumen e-RKAM?</span>
                <input type="checkbox" checked={formData.punyaErkam} onChange={e => setFormData({...formData, punyaErkam: e.target.checked})} className="w-5 h-5 text-emerald-500 border-gray-300 rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer max-w-2xl">
                <span className="text-sm font-medium text-gray-700">Apakah Madrasah berada di lingkungan pesantren?</span>
                <input type="checkbox" checked={formData.diPesantren} onChange={e => setFormData({...formData, diPesantren: e.target.checked})} className="w-5 h-5 text-emerald-500 border-gray-300 rounded" />
              </label>
            </div>

            <div className="pt-2">
              <h3 className="text-md font-bold text-gray-800 mb-6">Identitas Penyelenggara Madrasah</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">PENYELENGGARA LEMBAGA</label>
                  <select value={formData.penyelenggaraLembaga} onChange={e => setFormData({...formData, penyelenggaraLembaga: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                    <option value="Yayasan">Yayasan</option><option value="Pemerintah">Pemerintah</option><option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NAMA PENYELENGGARA</label>
                  <input type="text" value={formData.namaPenyelenggara} onChange={e => setFormData({...formData, namaPenyelenggara: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold uppercase" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">AFILIASI KEAGAMAAN</label>
                  <select value={formData.afiliasiKeagamaan} onChange={e => setFormData({...formData, afiliasiKeagamaan: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm bg-white font-semibold">
                    <option value="Nahdlatul Ulama">Nahdlatul Ulama</option><option value="Muhammadiyah">Muhammadiyah</option><option value="-">-</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400">NOMOR POKOK YAYASAN</label>
                  <input type="text" value={formData.nomorPokokYayasan} onChange={e => setFormData({...formData, nomorPokokYayasan: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm font-semibold" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 pb-4">
              <button type="button" className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded shadow-sm text-sm transition-colors mr-3">BATAL</button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded shadow-sm text-sm transition-colors">
                {isSubmitting ? "MENYIMPAN..." : "SIMPAN IDENTITAS"}
              </button>
            </div>
          </form>
        );

      case "LOKASI":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Lokasi & Alamat Madrasah</h2>
            <FormLokasi /> 
          </div>
        );

      case "GALERI FOTO":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Galeri & Dokumentasi Sarpras</h2>
            <FormGaleri /> 
          </div>
        );

      case "DOKUMEN PERIJINAN":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Dokumen Perizinan & Legalitas</h2>
            <FormDokumenPerijinan /> 
          </div>
        );

      case "PERSONEL":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Data Personel Inti Lembaga</h2>
            <FormPersonel /> 
          </div>
        );

      case "PRESTASI":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Prestasi & Penghargaan Madrasah</h2>
            <FormPrestasi /> 
          </div>
        );

      case "PROGRAM YANG DISELENGGARAKAN":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Program & Layanan Madrasah</h2>
            <FormProgram /> 
          </div>
        );

      case "BANTUAN OPERASIONAL":
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Riwayat Bantuan Operasional</h2>
            <FormBantuanOperasional /> 
          </div>
        );

      default:
        return (
          <div className="py-20 text-center flex flex-col items-center animate-in zoom-in duration-300">
            <span className="text-4xl mb-4">🚧</span>
            <h3 className="text-lg font-bold text-gray-600 uppercase">Tahap Pengembangan</h3>
            <p className="text-sm text-gray-400 mt-2">Formulir untuk tab <b>{activeTab}</b> akan segera tersedia.</p>
          </div>
        );
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500 font-bold animate-pulse">Memuat Profil Lembaga...</p></div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* KONTEN KHUSUS CETAK PDF (Hanya muncul saat tombol print ditekan) */}
      <CetakProfilPdf />

      {/* KONTEN DASHBOARD UTAMA (Disembunyikan saat dicetak) */}
      <div className="max-w-7xl mx-auto space-y-6 print:hidden">
        
        <div className="flex justify-between items-center">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-2">
              <span>Kelembagaan</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Profile</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-800">Profil Madrasah</h1>
          </div>
          <button 
            onClick={handleCetakLaporan} 
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-xs transition-colors flex items-center gap-2"
          >
            <span>🖨️</span> Cetak / PDF Laporan
          </button>
        </div>

        <div className="flex overflow-x-auto border-b border-gray-200 hide-scrollbar pb-1 gap-2">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`whitespace-nowrap px-6 py-2.5 text-xs font-bold rounded-t-md transition-colors ${activeTab === tab ? "bg-blue-500 text-white" : "bg-white text-gray-500 hover:bg-gray-100"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-b-xl shadow-sm border border-gray-100 min-h-[400px]">
          {renderKontenTab()}
        </div>

      </div>
    </div>
  );
}