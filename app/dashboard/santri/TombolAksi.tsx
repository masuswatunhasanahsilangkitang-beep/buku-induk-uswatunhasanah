"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TombolAksi({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("⚠️ PERINGATAN! Yakin ingin menghapus seluruh data siswa ini (termasuk orang tua, kesehatan, alamat)? Data tidak dapat dikembalikan.")) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/santri?id=${id}`, {
          method: "DELETE",
        });
        const json = await res.json();
        
        if (res.ok && json.success) {
          alert("✅ Data berhasil dihapus.");
          router.refresh(); // Segarkan halaman server component
        } else {
          alert(`❌ Gagal: ${json.message}`);
        }
      } catch (error) {
        alert("Terjadi kesalahan jaringan saat menghapus.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* TOMBOL DETAIL / PRINT */}
      <Link 
        href={`/dashboard/santri/${id}`} 
        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-xs font-bold transition-colors"
        title="Lihat Detail & Cetak Buku Induk"
      >
        📄 Detail
      </Link>

      {/* TOMBOL EDIT */}
      <Link 
        href={`/dashboard/santri/${id}/edit`} 
        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded text-xs font-bold transition-colors"
        title="Edit Data Siswa"
      >
        ✏️ Edit
      </Link>

      {/* TOMBOL HAPUS */}
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-bold transition-colors disabled:opacity-50"
        title="Hapus Permanen"
      >
        {isDeleting ? "⏳..." : "🗑️ Hapus"}
      </button>
    </div>
  );
}