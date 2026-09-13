import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function EditGuruPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: paramId } = await params;
  const id = isNaN(Number(paramId)) ? paramId : Number(paramId);

  const pegawai = await prisma.guru.findUnique({
    where: { id: id as any },
  }).catch(() => null);

  if (!pegawai) {
    return (
      <div className="p-8 text-center min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
        <h1 className="text-2xl font-black text-gray-800 mb-2">Data Tidak Ditemukan</h1>
        <p className="text-gray-500 mb-6">Pegawai dengan ID tersebut tidak ada di database.</p>
        <Link href="/dashboard/guru" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  async function updateGuru(formData: FormData) {
    "use server";
    
    const namaLengkap = formData.get("namaLengkap") as string;
    const nip = formData.get("nip") as string;
    const kategoriTugas = formData.get("kategoriTugas") as string;
    const jabatan = formData.get("jabatan") as string;

    await prisma.guru.update({
      where: { id: id as any },
      data: {
        namaLengkap,
        nip,
        kategoriTugas,
        jabatan,
      },
    });

    revalidatePath("/dashboard/guru");
    redirect("/dashboard/guru");
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-black text-gray-800">Edit Data Pegawai</h1>
          <p className="text-xs font-medium text-gray-500 mt-1">Perbarui informasi untuk {pegawai.namaLengkap}</p>
        </div>

        <form action={updateGuru} className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nama Lengkap</label>
            <input 
              type="text" 
              name="namaLengkap" 
              defaultValue={pegawai.namaLengkap} 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">NIP / NIK</label>
            <input 
              type="text" 
              name="nip" 
              defaultValue={pegawai.nip}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Kategori Tugas</label>
              <select 
                name="kategoriTugas" 
                defaultValue={pegawai.kategoriTugas}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Guru">Tenaga Pendidik</option>
                <option value="Tendik">Tenaga Kependidikan (Tendik)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Jabatan Utama</label>
              <select 
                name="jabatan" 
                defaultValue={pegawai.jabatan}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              >
                <optgroup label="Posisi Tenaga Pendidik">
                  <option value="Kepala Madrasah">Kepala Madrasah</option>
                  <option value="Wakil Kepala Madrasah">Wakil Kepala Madrasah</option>
                  <option value="Guru Mata Pelajaran">Guru Mata Pelajaran</option>
                  <option value="Guru Kelas">Guru Kelas</option>
                  <option value="Guru BK">Guru BK (Bimbingan Konseling)</option>
                  <option value="Pembina Ekstrakurikuler">Pembina Ekstrakurikuler</option>
                </optgroup>
                <optgroup label="Posisi Tenaga Kependidikan">
                  <option value="Kepala Tata Usaha">Kepala Tata Usaha</option>
                  <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                  <option value="Operator Madrasah">Operator Madrasah</option>
                  <option value="Bendahara">Bendahara</option>
                  <option value="Pustakawan">Pustakawan</option>
                  <option value="Laboran">Laboran</option>
                  <option value="Tenaga Kebersihan">Tenaga Kebersihan</option>
                  <option value="Petugas Keamanan">Petugas Keamanan</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Link 
              href="/dashboard/guru" 
              className="flex-1 text-center py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}