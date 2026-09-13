import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import FormEdit from "./FormEdit";

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
        <Link href="/dashboard/guru" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Kembali ke Daftar</Link>
      </div>
    );
  }

  async function updateGuru(formData: FormData) {
    "use server";
    
    await prisma.guru.update({
      where: { id: id as any },
      data: { 
        namaLengkap: formData.get("namaLengkap") as string,
        kategoriTugas: formData.get("kategoriTugas") as string,
        jabatan: formData.get("jabatan") as string,
        nik: formData.get("nik") as string,
        nuptk: formData.get("nuptk") as string,
        jenisKelamin: formData.get("jenisKelamin") as string,
        agama: formData.get("agama") as string,
        tempatLahir: formData.get("tempatLahir") as string,
        tanggalLahir: formData.get("tanggalLahir") as string,
        noHp: formData.get("noHp") as string,
        email: formData.get("email") as string,
        jenisPtk: formData.get("jenisPtk") as string,
        alamat: formData.get("alamat") as string,
        statusPegawai: formData.get("statusPegawai") as string,
        nip: formData.get("nip") as string,
        jenisPns: formData.get("jenisPns") as string,
        tmtPns: formData.get("tmtPns") as string,
        noSkPns: formData.get("noSkPns") as string,
        tglSkPns: formData.get("tglSkPns") as string,
        tmtGuru: formData.get("tmtGuru") as string,
        tmtPegawai: formData.get("tmtPegawai") as string,
        npsn: formData.get("npsn") as string,
        namaSekolah: formData.get("namaSekolah") as string,
        bentukSp: formData.get("bentukSp") as string,
        provinsi: formData.get("provinsi") as string,
        kabupatenKota: formData.get("kabupatenKota") as string,
        kecamatan: formData.get("kecamatan") as string,
        namaIbuKandung: formData.get("namaIbuKandung") as string,
        statusPerkawinan: formData.get("statusPerkawinan") as string,
        namaSuamiIstri: formData.get("namaSuamiIstri") as string,
        jumlahAnak: parseInt(formData.get("jumlahAnak") as string) || 0,
        sertifikasi: formData.get("sertifikasi") as string,
        nrg: formData.get("nrg") as string,
        mapelSertifikasi: formData.get("mapelSertifikasi") as string,
        noSertifikat: formData.get("noSertifikat") as string,
      },
    });

    revalidatePath("/dashboard/guru");
    redirect("/dashboard/guru");
  }

  return <FormEdit pegawai={pegawai} updateGuru={updateGuru} />;
}