"use client";

export default function CetakButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded shadow-sm hover:bg-gray-100 transition-colors print:hidden"
    >
      🖨️ Cetak Surat Kelulusan
    </button>
  );
}