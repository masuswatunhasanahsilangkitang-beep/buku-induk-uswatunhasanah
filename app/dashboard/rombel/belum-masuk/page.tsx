"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DistribusiSiswaPage() {
  const router = useRouter();
  const [siswaList, setSiswaList] = useState<any[]>([]);
  const [rombelList, setRombelList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Checklist & Pilihan Kelas
  const [selectedSantri, setSelectedSantri] = useState<string[]>([]);
  const [selectedRombel, setSelectedRombel] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/rombel/distribusi");
        const json = await res.json();
        if (json.success) {
          setSiswaList(json.data.santriBelumMasuk);
          setRombelList(json.data.rombelList);
        }
      } catch (error) {
        console.error("Gagal menarik data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handler Checklist Individual
  const handleCheckboxChange = (id: string) => {
    if (selectedSantri.includes(id)) {
      setSelectedSantri(selectedSantri.filter((sId) => sId !== id)); // Hapus dari daftar
    } else {
      setSelectedSantri([...selectedSantri, id]); // Tambahkan ke daftar
    }
  };

  // Handler Checklist "Pilih Semua"
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = siswaList.map((s) => s.id);
      setSelectedSantri(allIds);
    } else {
      setSelectedSantri([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSantri.length === 0) {
      alert("Silakan centang minimal 1 siswa yang akan dimasukkan ke kelas!");
      return;
    }
    if (!selectedRombel) {
      alert("Silakan pilih Kelas Tujuan pada kotak di atas!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/rombel/distribusi", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rombelId: selectedRombel,
          santriIds: selectedSantri
        }),
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        alert(`SUKSES! ${result.message}`);
        router.push("/dashboard/rombel"); // Kembali ke dashboard rombel
      } else {
        alert(`GAGAL!\n\nPenyebab: ${result.message}`);
      }
    } catch (error) {
      alert("Koneksi terputus. Pastikan server berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-gray-600 font-bold text-sm tracking-widest uppercase">Mempersiapkan Data Siswa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header Information */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/rombel" className="hover:text-amber-600 transition-colors">Rombongan Belajar</Link> 
              <span>&gt;</span> 
              <span className="font-semibold text-gray-600">Distribusi Siswa</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">
              Siswa Belum Masuk Kelas <span className="text-amber-500">({siswaList.length})</span>
            </h1>
          </div>
          <Link href="/dashboard/rombel" className="px-5 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors font-bold">
            ← Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* CONTROL PANEL: Pilih Kelas & Tombol Submit */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-200 flex flex-col md:flex-row items-end gap-4 sticky top-6 z-10">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">KELAS TUJUAN</label>
              <select 
                value={selectedRombel} 
                onChange={(e) => setSelectedRombel(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 text-sm font-black text-gray-800 focus:border-amber-500 focus:outline-none bg-gray-50 hover:bg-white transition-colors"
                required
              >
                <option value="" disabled>-- Klik untuk Memilih Kelas --</option>
                {rombelList.map((rombel) => (
                  <option key={rombel.id} value={rombel.id}>
                    {rombel.namaRombel} ({rombel.tingkat})
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting || selectedSantri.length === 0}
              className={`w-full md:w-auto px-8 py-3.5 rounded-lg text-white text-sm font-black shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2 
                ${selectedSantri.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 
                  isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600 hover:-translate-y-0.5'}`}
            >
              {isSubmitting ? "MEMPROSES..." : `MASUKKAN ${selectedSantri.length} SISWA KE KELAS`}
            </button>
          </div>

          {/* TABEL DAFTAR SISWA DENGAN CHECKBOX */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-amber-50 text-amber-800 text-[10px] uppercase tracking-wider border-b border-amber-100">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={selectedSantri.length === siswaList.length && siswaList.length > 0}
                        className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 font-bold">NAMA LENGKAP SISWA</th>
                    <th className="p-4 font-bold">NISN</th>
                    <th className="p-4 font-bold">JENIS KELAMIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {siswaList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <svg className="w-12 h-12 mb-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          <p className="text-sm font-bold tracking-wider uppercase text-emerald-600">Luar Biasa!</p>
                          <p className="text-xs mt-1 text-gray-500">Seluruh siswa aktif telah mendapatkan kelas.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    siswaList.map((siswa) => (
                      <tr 
                        key={siswa.id} 
                        className={`transition-colors cursor-pointer ${selectedSantri.includes(siswa.id) ? 'bg-amber-50/50' : 'hover:bg-gray-50'}`}
                        onClick={() => handleCheckboxChange(siswa.id)}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedSantri.includes(siswa.id)}
                            onChange={() => handleCheckboxChange(siswa.id)}
                            onClick={(e) => e.stopPropagation()} // Mencegah klik ganda pada baris
                            className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-bold text-gray-800 uppercase">{siswa.namaLengkap}</td>
                        <td className="p-4 text-gray-600 font-medium">{siswa.nisn}</td>
                        <td className="p-4 text-gray-600">{siswa.jenisKelamin}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}