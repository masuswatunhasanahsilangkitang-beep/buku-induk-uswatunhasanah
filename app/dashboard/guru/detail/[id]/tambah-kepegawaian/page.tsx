import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function TambahKepegawaianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  async function simpanKepegawaian(formData: FormData) {
    "use server";
    await prisma.riwayatKepegawaian.create({
      data: {
        guruId: id,
        tanggalEfektif: formData.get("tanggalEfektif") as string,
        fungsiJabatan: formData.get("fungsiJabatan") as string,
        statusKeaktifan: formData.get("statusKeaktifan") as string,
        jenisSk: formData.get("jenisSk") as string,
      }
    });
    revalidatePath(`/dashboard/guru/detail/${id}`);
    redirect(`/dashboard/guru/detail/${id}`);
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-black text-gray-800">Tambah Riwayat Kepegawaian</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">Catat histori penugasan dan SK terbaru</p>
        </div>

        <form action={simpanKepegawaian} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Tanggal Efektif</label>
              <input type="date" name="tanggalEfektif" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Status Keaktifan</label>
              <select name="statusKeaktifan" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="Aktif">Aktif</option>
                <option value="Cuti">Cuti</option>
                <option value="Pensiun">Pensiun</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase">Fungsi / Jabatan</label>
            <input type="text" name="fungsiJabatan" placeholder="Contoh: Guru Kelas" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase">Jenis SK / Dasar Penugasan</label>
            <input type="text" name="jenisSk" placeholder="Contoh: SK Pengangkatan Yayasan" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          </div>

          <div className="pt-6 flex gap-3">
            <Link href={`/dashboard/guru/detail/${id}`} className="flex-1 text-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">Batal</Link>
            <button type="submit" className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">Simpan Riwayat</button>
          </div>
        </form>
      </div>
    </div>
  );
}