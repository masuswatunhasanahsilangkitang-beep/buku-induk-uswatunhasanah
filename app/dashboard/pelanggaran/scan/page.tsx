"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";

export default function ScanPelanggaranPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [manualNisn, setManualNisn] = useState("");
  const isScanningRef = useRef(false);

  // Fungsi untuk memproses NISN dan pindah ke form tambah
  const handleProses = (nisn: string) => {
    if (!nisn.trim()) return;
    
    // Cegah double proses
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    // Bunyikan suara "beep"
    const audio = new Audio("data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTEAAAAA"); 
    audio.play().catch(()=> {});

    // Pindah halaman bawa ID
    router.push(`/dashboard/pelanggaran/tambah?santriId=${encodeURIComponent(nisn.trim())}`);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProses(manualNisn);
  };

  useEffect(() => {
    if (!isCameraActive) return;
    isScanningRef.current = false; // Reset lock

    const html5QrCode = new Html5Qrcode("reader-bk");

    html5QrCode.start(
      { facingMode: "environment" }, // Paksa kamera belakang
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        // Matikan kamera segera setelah terbaca agar tidak berat
        if (html5QrCode.isScanning) {
          html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
        }
        handleProses(decodedText);
      },
      (errorMessage) => { /* Abaikan error cari bingkai */ }
    ).catch((err) => {
      setError("Gagal mengakses kamera. Pastikan Anda telah memberikan izin kamera pada browser.");
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
      }
    };
  }, [isCameraActive]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800 flex justify-center items-start pt-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Scan Kartu Pelajar (BK)</h1>
          <p className="text-xs text-gray-500 mt-2 px-4">Arahkan kamera ke QR Code pada Kartu Pelajar siswa atau ketik NISN manual.</p>
        </div>

        {/* TOMBOL TOGGLE KAMERA / MANUAL */}
        <div className="flex bg-gray-100 p-1 mx-6 mt-6 rounded-lg">
          <button 
            onClick={() => setIsCameraActive(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${isCameraActive ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            📸 Gunakan Kamera
          </button>
          <button 
            onClick={() => setIsCameraActive(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${!isCameraActive ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ⌨️ Input Manual
          </button>
        </div>

        {/* AREA SCANNER / INPUT */}
        <div className="p-6">
          {isCameraActive ? (
            <div className="space-y-4 text-center">
              <div id="reader-bk" className="w-full bg-black rounded-xl overflow-hidden border-2 border-dashed border-gray-300 min-h-[250px] relative"></div>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input 
                type="text"
                value={manualNisn}
                onChange={e => setManualNisn(e.target.value)}
                placeholder="Scan Scanner USB / Masukkan NISN..."
                className="w-full px-4 py-4 border-2 border-red-200 focus:border-red-500 rounded-xl text-center text-lg font-bold uppercase tracking-wider outline-none transition-all shadow-inner"
              />
              <button 
                type="submit" 
                disabled={!manualNisn}
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow transition-colors text-sm disabled:opacity-50"
              >
                Proses & Buka Form BK
              </button>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
          <Link href="/dashboard/pelanggaran" className="font-bold text-gray-500 hover:text-gray-800 transition-colors">
            &larr; Kembali ke Daftar
          </Link>
          <span className="text-gray-400 font-medium">Modul Kedisiplinan Cepat</span>
        </div>

      </div>
    </div>
  );
}