"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // State untuk mengontrol buka/tutup menu dropdown
  const [isSiswaOpen, setIsSiswaOpen] = useState(true); 
  const [isGuruOpen, setIsGuruOpen] = useState(false); 
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);

  // Otomatis membuka menu jika URL saat ini sedang berada di dalam modul tersebut
  useEffect(() => {
    if (pathname.includes('/absensi')) setIsAbsensiOpen(true);
    if (pathname.includes('/guru')) setIsGuruOpen(true);
    if (pathname.includes('/santri') || pathname.includes('/mutasi') || pathname.includes('/kelulusan')) setIsSiswaOpen(true);
  }, [pathname]);

  // Fungsi untuk memberi warna biru jika menu utama tunggal sedang aktif
  const menuClass = (path: string) => 
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      pathname === path || pathname.startsWith(path + '/') 
      ? 'bg-blue-50 text-blue-700' 
      : 'text-gray-600 hover:bg-gray-50'
    }`;

  // Fungsi untuk mendeteksi warna menu dropdown (Induk)
  const dropdownParentClass = (isOpen: boolean, isGroupActive: boolean) =>
    `w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isGroupActive 
      ? 'text-blue-700 bg-blue-50/50' 
      : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* ================= SIDEBAR KIRI ================= */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 print:hidden">
        
        {/* LOGO BUKU INDUK */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className="bg-blue-600 text-white px-5 py-1.5 rounded text-lg font-black tracking-widest shadow-sm">
            BUKU INDUK
          </div>
        </div>
        
        {/* BUNGKUSAN MENU UTAMA */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          
          <Link href="/dashboard" className={menuClass("/dashboard")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Dashboard
          </Link>

          <Link href="/dashboard/kelembagaan" className={menuClass("/dashboard/kelembagaan")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Kelembagaan
          </Link>

          <Link href="/dashboard/sarpras" className={menuClass("/dashboard/sarpras")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            Sarana Prasarana
          </Link>

          {/* DROPDOWN MENU SISWA */}
          <div>
            <button onClick={() => setIsSiswaOpen(!isSiswaOpen)} className={dropdownParentClass(isSiswaOpen, pathname.includes('/santri') || pathname.includes('/mutasi') || pathname.includes('/kelulusan'))}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Siswa
              </div>
              <svg className={`w-4 h-4 transition-transform ${isSiswaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {/* SUB-MENU SISWA */}
            {isSiswaOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                <Link href="/dashboard/santri" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/santri' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Daftar Siswa (Buku Induk)
                </Link>
                <Link href="/dashboard/santri/kartu-pelajar" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/santri/kartu-pelajar' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Kartu Pelajar (QR Code)
                </Link>
                <Link href="/dashboard/mutasi" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/mutasi' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Mutasi Siswa
                </Link>
                <Link href="/dashboard/kelulusan" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/kelulusan' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Kelulusan
                </Link>
              </div>
            )}
          </div>

          {/* DROPDOWN MENU GURU & TENDIK */}
          <div>
            <button onClick={() => setIsGuruOpen(!isGuruOpen)} className={dropdownParentClass(isGuruOpen, pathname.includes('/guru'))}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Guru dan Tendik
              </div>
              <svg className={`w-4 h-4 transition-transform ${isGuruOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {/* SUB-MENU GURU */}
            {isGuruOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                <Link href="/dashboard/guru" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/guru' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Daftar Guru
                </Link>
                <Link href="/dashboard/guru/qr-meja" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/guru/qr-meja' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  QR Code Meja (Absen)
                </Link>
              </div>
            )}
          </div>

          <Link href="/dashboard/rombel" className={menuClass("/dashboard/rombel")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Rombongan Belajar
          </Link>

          {/* MENU MANAJEMEN JADWAL */}
          <Link href="/dashboard/jadwal" className={menuClass("/dashboard/jadwal")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Manajemen Jadwal
          </Link>

          {/* ========================================= */}
          {/* BARU: MENU BUKU SAKU / PELANGGARAN SISWA */}
          {/* ========================================= */}
          <Link href="/dashboard/pelanggaran" className={menuClass("/dashboard/pelanggaran")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Buku Saku / BK
          </Link>

          {/* DROPDOWN MENU ABSENSI & KEHADIRAN */}
          <div>
            <button onClick={() => setIsAbsensiOpen(!isAbsensiOpen)} className={dropdownParentClass(isAbsensiOpen, pathname.includes('/absensi'))}>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                Absensi & Kehadiran
              </div>
              <svg className={`w-4 h-4 transition-transform ${isAbsensiOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {/* SUB-MENU ABSENSI */}
            {isAbsensiOpen && (
              <div className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                <Link href="/dashboard/absensi/harian" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/absensi/harian' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Scanner QR Code
                </Link>
                <Link href="/dashboard/absensi/manual" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/absensi/manual' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Input Manual (Izin/Sakit)
                </Link>
                <Link href="/dashboard/absensi/rekap" className={`block px-4 py-2 rounded-lg text-xs font-medium ${pathname === '/dashboard/absensi/rekap' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                  Rekapitulasi (Segera)
                </Link>
              </div>
            )}
          </div>

        </nav>

        {/* FOOTER VERSI */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-[10px] text-gray-400 text-center leading-tight">
            Versi 1.0<br/>© 2026 Yayasan Uswatun Hasanah
          </div>
        </div>
      </aside>

      {/* ================= AREA KONTEN KANAN ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER ATAS (NAVBAR) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
              UH
            </div>
            <div className="hidden md:block">
              <p className="text-[10px] font-bold text-gray-500 leading-none">STAF LEMBAGA</p>
              <p className="text-xs font-black text-gray-800 leading-tight">MAS PP USWATUN HASANAH</p>
              <p className="text-[9px] text-gray-400 leading-none">131212220025</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[10px] font-bold">
              Status Konfirmasi Persetujuan
            </span>
            <span className="hidden lg:inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded">
              Tahun Ajaran: 2026/2027 - Ganjil
            </span>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              AU
            </div>
          </div>
        </header>

        {/* HALAMAN DINAMIS (PAGE.TSX) */}
        <main className="flex-1 overflow-y-auto relative bg-gray-50/50">
          {children}
        </main>
        
      </div>
    </div>
  );
}