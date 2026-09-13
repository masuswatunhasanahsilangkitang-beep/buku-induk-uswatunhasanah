"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TombolAksi({ id }: { id: string | number }) {
  const router = useRouter();

  async function hapusData() {
    if (confirm("Yakin ingin menghapus pegawai ini?")) {
      await fetch(`/api/guru/${id}`, { method: "DELETE" });
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Tombol Detail Baru */}
      <Link 
        href={`/dashboard/guru/detail/${id}`} 
        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded text-xs font-bold transition-colors"
      >
        Detail
      </Link>
      
      <Link 
        href={`/dashboard/guru/edit/${id}`} 
        className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 rounded text-xs font-bold transition-colors"
      >
        Edit
      </Link>
      
      <button 
        onClick={hapusData} 
        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded text-xs font-bold transition-colors"
      >
        Hapus
      </button>
    </div>
  );
}