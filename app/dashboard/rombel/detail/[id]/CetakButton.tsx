"use client";

export default function CetakButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-sm hover:bg-blue-700 transition-colors print:hidden flex items-center gap-2"
    >
      🖨️ Cetak Daftar Hadir
    </button>
  );
}