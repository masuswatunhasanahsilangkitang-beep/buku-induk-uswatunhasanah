import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import FormTambah from "./FormTambah";

export default function TambahGuruPage() {
  
  async function createGuru(formData: FormData) {
    "use server";
    
    await prisma.guru.create({
      data: { 
        // 1. TUGAS POKOK
        namaLengkap: formData.get("namaLengkap") as string,
        kategoriTugas: formData.get("kategoriTugas") as string,
        jabatan: formData.get("jabatan") as string,
        // 2. DATA DIRI
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
        // 3. KEPEGAWAIAN
        statusPegawai: formData.get("statusPegawai") as string,
        nip: formData.get("nip") as string,
        jenisPns: formData.get("jenisPns") as string,
        tmtPns: formData.get("tmtPns") as string,
        noSkPns: formData.get("noSkPns") as string,
        tglSkPns: formData.get("tglSkPns") as string,
        tmtGuru: formData.get("tmtGuru") as string,
        tmtPegawai: formData.get("tmtPegawai") as string,
        // 4. SEKOLAH BERTUGAS
        npsn: formData.get("npsn") as string,
        namaSekolah: formData.get("namaSekolah") as string,
        bentukSp: formData.get("bentukSp") as string,
        provinsi: formData.get("provinsi") as string,
        kabupatenKota: formData.get("kabupatenKota") as string,
        kecamatan: formData.get("kecamatan") as string,
        // 5. KELUARGA
        namaIbuKandung: formData.get("namaIbuKandung") as string,
        statusPerkawinan: formData.get("statusPerkawinan") as string,
        namaSuamiIstri: formData.get("namaSuamiIstri") as string,
        jumlahAnak: parseInt(formData.get("jumlahAnak") as string) || 0,
        // 6. SERTIFIKASI
        sertifikasi: formData.get("sertifikasi") as string,
        nrg: formData.get("nrg") as string,
        mapelSertifikasi: formData.get("mapelSertifikasi") as string,
        noSertifikat: formData.get("noSertifikat") as string,
      },
    });

    revalidatePath("/dashboard/guru");
    redirect("/dashboard/guru");
  }

  return <FormTambah simpanGuru={createGuru} />;
}