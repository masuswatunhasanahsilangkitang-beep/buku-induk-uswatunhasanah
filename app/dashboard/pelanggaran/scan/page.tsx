"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ScanPelanggaranPage() {
  const router = useRouter();
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto fokus ke input agar siap menerima tembakan dari Barcode Scanner USB
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScanOrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    try {
      // 1. Cek apakah NISN atau ID Siswa tersebut valid di database
      const res = await fetch("/api/santri");
      const json = await res.json();
      
      if (json.success && json.data) {
        const list = json.data.santri ? json.data.santri : json.data;
        // Cari siswa berdasarkan NISN atau ID
        const found = list.find((s: any) => s.nisn === inputCode.trim() || s.id === inputCode.trim() || s.nis === inputCode.trim());

        if (found) {
          // Jika ketemu, lempar langsung ke halaman tambah pelanggaran dengan membawa ID Siswa tersebut!
          router.push(`/dashboard/pelanggaran/tambah?santriId=${found.id}`);
        } else {
          alert(`❌ Siswa dengan kode/NISN "${inputCode}" tidak ditemukan di database!`);
          setInputCode("");
        }
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-center">
        
        <div>
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-inner">
            📷
          </div>
          <h1 className="text-xl font-bold text-gray-800">Scan Kartu Pelajar (BK)</h1>
          <p className="text-xs text-gray-500 mt-1">Arahkan scanner USB ke QR Code pada Kartu Pelajar siswa atau ketik NISN manual.</p>
        </div>

        <form onSubmit={handleScanOrSubmit} className="space-y-4">
          <input 
            ref={inputRef}
            type="text" 
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Scan QR Code / Masukkan NISN..." 
            className="w-full px-4 py-3 border-2 border-red-200 rounded-xl text-center text-lg font-mono font-bold focus:border-red-600 focus:outline-none bg-red-50/20"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !inputCode.trim()}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow transition-all disabled:opacity-50"
          >
            {loading ? "Mencari Data Siswa..." : "Proses & Buka Form BK"}
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
          <Link href="/dashboard/pelanggaran" className="text-gray-500 hover:text-gray-800 font-semibold">
            &larr; Kembali ke Daftar
          </Link>
          <span className="text-gray-400">Modul Kedisiplinan Cepat</span>
        </div>

      </div>
    </div>
  );
}