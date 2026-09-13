import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function TambahPendidikanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  async function simpanPendidikan(formData: FormData) {
    "use server";
    
    await prisma.riwayatPendidikan.create({
      data: {
        guruId: id,
        jenjang: formData.get("jenjang") as string,
        namaSekolah: formData.get("namaSekolah") as string,
        jurusan: formData.get("jurusan") as string,
        tahunLulus: formData.get("tahunLulus") as string,
      }
    });

    // Refresh halaman profil dan kembali ke sana
    revalidatePath(`/dashboard/guru/detail/${id}`);
    redirect(`/dashboard/guru/detail/${id}`);
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-black text-gray-800">Tambah Riwayat Pendidikan</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">Masukkan data pendidikan formal</p>
        </div>

        <form action={simpanPendidikan} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase">Jenjang</label>
            <select name="jenjang" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
              <option value="SMA/Sederajat">SMA / Sederajat</option>
              <option value="D3">Diploma 3 (D3)</option>
              <option value="S1">Strata 1 (S1) / D4</option>
              <option value="S2">Strata 2 (S2)</option>
              <option value="S3">Strata 3 (S3)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase">Nama Sekolah / Perguruan Tinggi</label>
            <input type="text" name="namaSekolah" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Fakultas / Jurusan</label>
              <input type="text" name="jurusan" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Tahun Lulus</label>
              <input type="text" name="tahunLulus" placeholder="Contoh: 2015" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Link href={`/dashboard/guru/detail/${id}`} className="flex-1 text-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
              Batal
            </Link>
            <button type="submit" className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
              Simpan Riwayat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}