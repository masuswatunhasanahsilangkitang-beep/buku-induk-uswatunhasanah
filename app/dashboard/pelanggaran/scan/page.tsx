"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import Link from "next/link";

export default function ScanPelanggaranPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    // Inisialisasi mesin kamera murni
    const html5QrCode = new Html5Qrcode("reader-bk");

    html5QrCode.start(
      { facingMode: "environment" }, // Paksa gunakan kamera belakang
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        // Kunci pemindai agar tidak membaca QR ganda berulang-ulang
        if (isScanningRef.current) return;
        isScanningRef.current = true;

        // Bunyikan suara "beep" sukses
        const audio = new Audio("data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTEAAAAA"); 
        audio.play().catch(()=> {});

        // Langsung lempar (redirect) ke halaman form tambah beserta ID Siswa
        router.push(`/dashboard/pelanggaran/tambah?santriId=${encodeURIComponent(decodedText)}`);
      },
      (errorMessage) => {
        // Abaikan error saat kamera sedang mencari bingkai QR
      }
    ).catch((err) => {
      setError("Gagal mengakses kamera. Pastikan Anda telah memberikan izin kamera pada browser.");
    });

    return () => {
      // Matikan kamera dengan aman saat pindah halaman
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
      }
    };
  }, [router]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Scan Kartu Pelajar</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">Modul Bimbingan Konseling (BK)</p>
          </div>
          <Link href="/dashboard/pelanggaran" className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors">
            Batal
          </Link>
        </div>

        {/* AREA KAMERA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-4">Arahkan Kamera ke QR Code Siswa</p>
          
          <div id="reader-bk" className="w-full bg-black rounded-xl overflow-hidden border-2 border-dashed border-gray-300 min-h-[300px] relative"></div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}