// @ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// 1. METODE POST (SIMPAN DATA BARU)
export async function POST(request: Request) {
  try {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
    const prisma = globalForPrisma.prisma;

    const body = await request.json();
    const {
      jenisBukuInduk, formData, ayah, ibu, wali, penghasilan,
      alamatAyah, alamatIbu, alamatWali, alamatSiswa,
      aktivitasList, kebutuhanDetail, kebutuhanKhusus, disabilitas,
      beasiswaList, prestasiList
    } = body;

    if (!formData?.namaLengkap || !formData?.nisn || !formData?.nik) {
      return NextResponse.json({ success: false, message: "Data wajib belum lengkap." }, { status: 400 });
    }

    const { kkSamaAyah, ...cleanIbu } = ibu || {};

    const newSantri = await prisma.santri.create({
      data: {
        jenisBukuInduk: String(jenisBukuInduk || "Madrasah"),
        namaLengkap: String(formData.namaLengkap),
        namaPanggilan: formData.namaPanggilan ? String(formData.namaPanggilan) : null,
        nis: formData.nis ? String(formData.nis) : null,
        nisn: String(formData.nisn),
        nisLokal: formData.nisLokal ? String(formData.nisLokal) : null,
        kewarganegaraan: String(formData.kewarganegaraan || "WNI"),
        nik: String(formData.nik),
        tanggalVerifikasi: formData.tanggalVerifikasi ? String(formData.tanggalVerifikasi) : null,
        tempatLahir: String(formData.tempatLahir || ""),
        tanggalLahir: String(formData.tanggalLahir || ""),
        jenisKelamin: String(formData.jenisKelamin || ""),
        jumlahSaudara: formData.jumlahSaudara ? String(formData.jumlahSaudara) : null,
        anakKe: formData.anakKe ? String(formData.anakKe) : null,
         agama: String(formData.agama || ""),
        citaCita: formData.citaCita ? String(formData.citaCita) : null,
        nomorHp: formData.nomorHp ? String(formData.nomorHp) : null,
        email: formData.email ? String(formData.email) : null,
        hobi: formData.hobi ? String(formData.hobi) : null,
        yangMembiayai: formData.yangMembiayai ? String(formData.yangMembiayai) : null,
        statusKeluarga: formData.statusKeluarga ? String(formData.statusKeluarga) : null,

        praTkRa: Boolean(formData.praSekolah?.tkRa),
        praPaud: Boolean(formData.praSekolah?.paud),
        imunHepatitisB: Boolean(formData.imunisasi?.hepatitisB),
        imunBcg: Boolean(formData.imunisasi?.bcg),
        imunDpt: Boolean(formData.imunisasi?.dpt),
        imunPolio: Boolean(formData.imunisasi?.polio),
        imunCampak: Boolean(formData.imunisasi?.campak),
        imunCovid: Boolean(formData.imunisasi?.covid),

        nomorKip: formData.nomorKip ? String(formData.nomorKip) : null,
        noKk: String(formData.noKk || ""),
        namaKepalaKeluarga: String(formData.namaKepalaKeluarga || ""),

        orangTua: {
          create: [
            { jenis: "Ayah", namaLengkap: String(ayah?.namaLengkap || ""), status: String(ayah?.status || "Masih Hidup"), kewarganegaraan: String(ayah?.kewarganegaraan || "WNI"), nik: ayah?.nik ? String(ayah.nik) : null, tempatLahir: ayah?.tempatLahir ? String(ayah.tempatLahir) : null, tanggalLahir: ayah?.tanggalLahir ? String(ayah.tanggalLahir) : null, pendidikan: ayah?.pendidikan ? String(ayah.pendidikan) : null, pekerjaan: ayah?.pekerjaan ? String(ayah.pekerjaan) : null, nomorHp: ayah?.nomorHp ? String(ayah.nomorHp) : null, kkSamaAyah: false },
            { jenis: "Ibu", namaLengkap: String(cleanIbu?.namaLengkap || ""), status: String(cleanIbu?.status || "Masih Hidup"), kewarganegaraan: String(cleanIbu?.kewarganegaraan || "WNI"), nik: cleanIbu?.nik ? String(cleanIbu.nik) : null, tempatLahir: cleanIbu?.tempatLahir ? String(cleanIbu.tempatLahir) : null, tanggalLahir: cleanIbu?.tanggalLahir ? String(cleanIbu.tanggalLahir) : null, pendidikan: cleanIbu?.pendidikan ? String(cleanIbu.pendidikan) : null, pekerjaan: cleanIbu?.pekerjaan ? String(cleanIbu.pekerjaan) : null, nomorHp: cleanIbu?.nomorHp ? String(cleanIbu.nomorHp) : null, kkSamaAyah: Boolean(ibu?.kkSamaAyah) },
            { jenis: "Wali", namaLengkap: String(wali?.namaLengkap || ""), status: String(wali?.status || "Masih Hidup"), kewarganegaraan: String(wali?.kewarganegaraan || "WNI"), nik: wali?.nik ? String(wali.nik) : null, tempatLahir: wali?.tempatLahir ? String(wali.tempatLahir) : null, tanggalLahir: wali?.tanggalLahir ? String(wali.tanggalLahir) : null, pendidikan: wali?.pendidikan ? String(wali.pendidikan) : null, pekerjaan: wali?.pekerjaan ? String(wali.pekerjaan) : null, nomorHp: wali?.nomorHp ? String(wali.nomorHp) : null, kkSamaAyah: false }
          ]
        },

        penghasilanKeluarga: {
          create: { rataRata: String(penghasilan?.rataRata || "0"), nomorKks: penghasilan?.nomorKks ? String(penghasilan.nomorKks) : null, nomorPkh: penghasilan?.nomorPkh ? String(penghasilan.nomorPkh) : null }
        },

        alamat: {
          create: [
            { jenisAlamat: "Ayah", luarNegeri: Boolean(alamatAyah?.luarNegeri), kepemilikanRumah: alamatAyah?.kepemilikanRumah ? String(alamatAyah.kepemilikanRumah) : null, provinsi: alamatAyah?.provinsi ? String(alamatAyah.provinsi) : null, kabupaten: alamatAyah?.kabupaten ? String(alamatAyah.kabupaten) : null, kecamatan: alamatAyah?.kecamatan ? String(alamatAyah.kecamatan) : null, kelurahan: alamatAyah?.kelurahan ? String(alamatAyah.kelurahan) : null, rt: alamatAyah?.rt ? String(alamatAyah.rt) : null, rw: alamatAyah?.rw ? String(alamatAyah.rw) : null, alamatLengkap: alamatAyah?.alamatLengkap ? String(alamatAyah.alamatLengkap) : null, kodePos: alamatAyah?.kodePos ? String(alamatAyah.kodePos) : null },
            { jenisAlamat: "Ibu", luarNegeri: Boolean(alamatIbu?.luarNegeri), kepemilikanRumah: alamatIbu?.kepemilikanRumah ? String(alamatIbu.kepemilikanRumah) : null, provinsi: alamatIbu?.provinsi ? String(alamatIbu.provinsi) : null, kabupaten: alamatIbu?.kabupaten ? String(alamatIbu.kabupaten) : null, kecamatan: alamatIbu?.kecamatan ? String(alamatIbu.kecamatan) : null, kelurahan: alamatIbu?.kelurahan ? String(alamatIbu.kelurahan) : null, rt: alamatIbu?.rt ? String(alamatIbu.rt) : null, rw: alamatIbu?.rw ? String(alamatIbu.rw) : null, alamatLengkap: alamatIbu?.alamatLengkap ? String(alamatIbu.alamatLengkap) : null, kodePos: alamatIbu?.kodePos ? String(alamatIbu.kodePos) : null },
            { jenisAlamat: "Wali", luarNegeri: Boolean(alamatWali?.luarNegeri), kepemilikanRumah: alamatWali?.kepemilikanRumah ? String(alamatWali.kepemilikanRumah) : null, provinsi: alamatWali?.provinsi ? String(alamatWali.provinsi) : null, kabupaten: alamatWali?.kabupaten ? String(alamatWali.kabupaten) : null, kecamatan: alamatWali?.kecamatan ? String(alamatWali.kecamatan) : null, kelurahan: alamatWali?.kelurahan ? String(alamatWali.kelurahan) : null, rt: alamatWali?.rt ? String(alamatWali.rt) : null, rw: alamatWali?.rw ? String(alamatWali.rw) : null, alamatLengkap: alamatWali?.alamatLengkap ? String(alamatWali.alamatLengkap) : null, kodePos: alamatWali?.kodePos ? String(alamatWali.kodePos) : null },
            { jenisAlamat: "Siswa", luarNegeri: false, statusTempatTinggal: alamatSiswa?.statusTempatTinggal ? String(alamatSiswa.statusTempatTinggal) : null, provinsi: alamatSiswa?.provinsi ? String(alamatSiswa.provinsi) : null, kabupaten: alamatSiswa?.kabupaten ? String(alamatSiswa.kabupaten) : null, kecamatan: alamatSiswa?.kecamatan ? String(alamatSiswa.kecamatan) : null, kelurahan: alamatSiswa?.kelurahan ? String(alamatSiswa.kelurahan) : null, rt: alamatSiswa?.rt ? String(alamatSiswa.rt) : null, rw: alamatSiswa?.rw ? String(alamatSiswa.rw) : null, alamatLengkap: alamatSiswa?.alamatLengkap ? String(alamatSiswa.alamatLengkap) : null, koordinat: alamatSiswa?.koordinat ? String(alamatSiswa.koordinat) : null, kodePos: alamatSiswa?.kodePos ? String(alamatSiswa.kodePos) : null, jarak: alamatSiswa?.jarak ? String(alamatSiswa.jarak) : null, transportasi: alamatSiswa?.transportasi ? String(alamatSiswa.transportasi) : null, waktuTempuh: alamatSiswa?.waktuTempuh ? String(alamatSiswa.waktuTempuh) : null }
          ]
        },

        kebutuhanKhusus: {
          create: { kesulitan: kebutuhanDetail?.kesulitan ? String(kebutuhanDetail.kesulitan) : null, alatBantu: kebutuhanDetail?.alatBantu ? String(kebutuhanDetail.alatBantu) : null, pendampingan: kebutuhanDetail?.pendampingan ? String(kebutuhanDetail.pendampingan) : null, penyesuaian: kebutuhanDetail?.penyesuaian ? String(kebutuhanDetail.penyesuaian) : null, kategoriKhusus: kebutuhanKhusus ? String(kebutuhanKhusus) : null, disTidakAda: Boolean(disabilitas?.tidakAda ?? true), disTunaNetra: Boolean(disabilitas?.tunaNetra), disTunaRungu: Boolean(disabilitas?.tunaRungu), disTunaDaksa: Boolean(disabilitas?.tunaDaksa), disTunaGrahita: Boolean(disabilitas?.tunaGrahita), disTunaLaras: Boolean(disabilitas?.tunaLaras), disLainnya: Boolean(disabilitas?.lainnya), disTunaWicara: Boolean(disabilitas?.tunaWicara) }
        },

        aktivitasBelajar: {
          create: (aktivitasList || []).map((item: any) => ({ ta: String(item.ta || ""), tanggal: String(item.tanggal || ""), nsm: String(item.nsm || ""), jenjang: String(item.jenjang || ""), tingkat: String(item.tingkat || ""), jurusan: String(item.jurusan || ""), rombel: String(item.rombel || ""), status: String(item.status || ""), ket: item.ket ? String(item.ket) : null }))
        },

        beasiswa: {
          create: (beasiswaList || []).map((item: any) => ({ tahun: String(item.tahun || ""), kategori: String(item.kategori || ""), namaBantuan: String(item.namaBantuan || ""), namaInstansi: String(item.namaInstansi || ""), jenisInstansi: String(item.jenisInstansi || ""), jangkaWaktu: String(item.jangkaWaktu || ""), nominal: String(item.nominal || "") }))
        },

        prestasi: {
          create: (prestasiList || []).map((item: any) => ({ tahun: String(item.tahun || ""), namaLomba: String(item.namaLomba || ""), bidangLomba: String(item.bidangLomba || ""), namaPenyelenggara: String(item.namaPenyelenggara || ""), lombaTingkat: String(item.lombaTingkat || ""), peringkat: String(item.peringkat || "") }))
        }
      }
    });

    const safeData = JSON.parse(
      JSON.stringify(newSantri, (key, value) => typeof value === "bigint" ? value.toString() : value)
    );

    return NextResponse.json({ success: true, message: "Data berhasil disimpan.", data: safeData }, { status: 201 });

  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target as string[];
      if (target?.includes("nisn")) {
        return NextResponse.json({ success: false, message: "Maaf, NISN tersebut sudah terdaftar pada siswa lain!" }, { status: 400 });
      }
      if (target?.includes("nik")) {
        return NextResponse.json({ success: false, message: "Maaf, NIK tersebut sudah terdaftar pada orang lain!" }, { status: 400 });
      }
      return NextResponse.json({ success: false, message: "Maaf, data yang dimasukkan sudah pernah didaftarkan." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server saat menyimpan data.", errorDetail: String(error) }, { status: 500 });
  }
}

// 2. METODE GET (TARIK DATA)
export async function GET(request: Request) {
  try {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
    const prisma = globalForPrisma.prisma;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const santri = await prisma.santri.findUnique({
        where: { id },
        include: {
          orangTua: true, penghasilanKeluarga: true, alamat: true,
          kebutuhanKhusus: true, aktivitasBelajar: true, beasiswa: true, prestasi: true,
        }
      });
      if (!santri) return NextResponse.json({ success: false, message: "Siswa tidak ditemukan" }, { status: 404 });
      const safeData = JSON.parse(JSON.stringify(santri, (k, v) => typeof v === "bigint" ? v.toString() : v));
      return NextResponse.json({ success: true, data: safeData }, { status: 200 });
    } else {
      // PERUBAHAN: Include rombel & tarik daftar rombel untuk kebutuhan tabel
      const santriList = await prisma.santri.findMany({ 
        orderBy: { namaLengkap: 'asc' },
        include: { rombel: true } 
      });
      const rombelList = await prisma.rombel.findMany({ orderBy: { namaRombel: 'asc' } });

      const safeDataList = JSON.parse(JSON.stringify(santriList, (k, v) => typeof v === "bigint" ? v.toString() : v));
      return NextResponse.json({ success: true, data: { santri: safeDataList, rombel: rombelList } }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Gagal memuat data", errorDetail: String(error) }, { status: 500 });
  }
}

// 3. METODE PUT (PERBARUI DATA LAMA) - DIPERBAIKI UNTUK ONE-TO-ONE RELATION
export async function PUT(request: Request) {
  try {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
    const prisma = globalForPrisma.prisma;

    const body = await request.json();
    const {
      id, jenisBukuInduk, formData, ayah, ibu, wali, penghasilan,
      alamatAyah, alamatIbu, alamatWali, alamatSiswa,
      aktivitasList, kebutuhanDetail, kebutuhanKhusus, disabilitas,
      beasiswaList, prestasiList
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Siswa tidak ditemukan untuk diperbarui." }, { status: 400 });
    }

    const { kkSamaAyah, ...cleanIbu } = ibu || {};

    const updatedSantri = await prisma.santri.update({
      where: { id: id },
      data: {
        jenisBukuInduk: String(jenisBukuInduk || "Madrasah"),
        namaLengkap: String(formData.namaLengkap),
        namaPanggilan: formData.namaPanggilan ? String(formData.namaPanggilan) : null,
        nis: formData.nis ? String(formData.nis) : null,
        nisn: String(formData.nisn),
        nisLokal: formData.nisLokal ? String(formData.nisLokal) : null,
        kewarganegaraan: String(formData.kewarganegaraan || "WNI"),
        nik: String(formData.nik),
        tanggalVerifikasi: formData.tanggalVerifikasi ? String(formData.tanggalVerifikasi) : null,
        tempatLahir: String(formData.tempatLahir || ""),
        tanggalLahir: String(formData.tanggalLahir || ""),
        jenisKelamin: String(formData.jenisKelamin || ""),
        jumlahSaudara: formData.jumlahSaudara ? String(formData.jumlahSaudara) : null,
        anakKe: formData.anakKe ? String(formData.anakKe) : null,
        agama: String(formData.agama || ""),
        citaCita: formData.citaCita ? String(formData.citaCita) : null,
        nomorHp: formData.nomorHp ? String(formData.nomorHp) : null,
        email: formData.email ? String(formData.email) : null,
        hobi: formData.hobi ? String(formData.hobi) : null,
        yangMembiayai: formData.yangMembiayai ? String(formData.yangMembiayai) : null,
        statusKeluarga: formData.statusKeluarga ? String(formData.statusKeluarga) : null,

        praTkRa: Boolean(formData.praSekolah?.tkRa),
        praPaud: Boolean(formData.praSekolah?.paud),
        imunHepatitisB: Boolean(formData.imunisasi?.hepatitisB),
        imunBcg: Boolean(formData.imunisasi?.bcg),
        imunDpt: Boolean(formData.imunisasi?.dpt),
        imunPolio: Boolean(formData.imunisasi?.polio),
        imunCampak: Boolean(formData.imunisasi?.campak),
        imunCovid: Boolean(formData.imunisasi?.covid),

        nomorKip: formData.nomorKip ? String(formData.nomorKip) : null,
        noKk: String(formData.noKk || ""),
        namaKepalaKeluarga: String(formData.namaKepalaKeluarga || ""),

        // One-to-Many Relations: deleteMany dan create ulang
        orangTua: {
          deleteMany: {},
          create: [
            { jenis: "Ayah", namaLengkap: String(ayah?.namaLengkap || ""), status: String(ayah?.status || "Masih Hidup"), kewarganegaraan: String(ayah?.kewarganegaraan || "WNI"), nik: ayah?.nik ? String(ayah.nik) : null, tempatLahir: ayah?.tempatLahir ? String(ayah.tempatLahir) : null, tanggalLahir: ayah?.tanggalLahir ? String(ayah.tanggalLahir) : null, pendidikan: ayah?.pendidikan ? String(ayah.pendidikan) : null, pekerjaan: ayah?.pekerjaan ? String(ayah.pekerjaan) : null, nomorHp: ayah?.nomorHp ? String(ayah.nomorHp) : null, kkSamaAyah: false },
            { jenis: "Ibu", namaLengkap: String(cleanIbu?.namaLengkap || ""), status: String(cleanIbu?.status || "Masih Hidup"), kewarganegaraan: String(cleanIbu?.kewarganegaraan || "WNI"), nik: cleanIbu?.nik ? String(cleanIbu.nik) : null, tempatLahir: cleanIbu?.tempatLahir ? String(cleanIbu.tempatLahir) : null, tanggalLahir: cleanIbu?.tanggalLahir ? String(cleanIbu.tanggalLahir) : null, pendidikan: cleanIbu?.pendidikan ? String(cleanIbu.pendidikan) : null, pekerjaan: cleanIbu?.pekerjaan ? String(cleanIbu.pekerjaan) : null, nomorHp: cleanIbu?.nomorHp ? String(cleanIbu.nomorHp) : null, kkSamaAyah: Boolean(ibu?.kkSamaAyah) },
            { jenis: "Wali", namaLengkap: String(wali?.namaLengkap || ""), status: String(wali?.status || "Masih Hidup"), kewarganegaraan: String(wali?.kewarganegaraan || "WNI"), nik: wali?.nik ? String(wali.nik) : null, tempatLahir: wali?.tempatLahir ? String(wali.tempatLahir) : null, tanggalLahir: wali?.tanggalLahir ? String(wali.tanggalLahir) : null, pendidikan: wali?.pendidikan ? String(wali.pendidikan) : null, pekerjaan: wali?.pekerjaan ? String(wali.pekerjaan) : null, nomorHp: wali?.nomorHp ? String(wali.nomorHp) : null, kkSamaAyah: false }
          ]
        },

        alamat: {
          deleteMany: {},
          create: [
            { jenisAlamat: "Ayah", luarNegeri: Boolean(alamatAyah?.luarNegeri), kepemilikanRumah: alamatAyah?.kepemilikanRumah ? String(alamatAyah.kepemilikanRumah) : null, provinsi: alamatAyah?.provinsi ? String(alamatAyah.provinsi) : null, kabupaten: alamatAyah?.kabupaten ? String(alamatAyah.kabupaten) : null, kecamatan: alamatAyah?.kecamatan ? String(alamatAyah.kecamatan) : null, kelurahan: alamatAyah?.kelurahan ? String(alamatAyah.kelurahan) : null, rt: alamatAyah?.rt ? String(alamatAyah.rt) : null, rw: alamatAyah?.rw ? String(alamatAyah.rw) : null, alamatLengkap: alamatAyah?.alamatLengkap ? String(alamatAyah.alamatLengkap) : null, kodePos: alamatAyah?.kodePos ? String(alamatAyah.kodePos) : null },
            { jenisAlamat: "Ibu", luarNegeri: Boolean(alamatIbu?.luarNegeri), kepemilikanRumah: alamatIbu?.kepemilikanRumah ? String(alamatIbu.kepemilikanRumah) : null, provinsi: alamatIbu?.provinsi ? String(alamatIbu.provinsi) : null, kabupaten: alamatIbu?.kabupaten ? String(alamatIbu.kabupaten) : null, kecamatan: alamatIbu?.kecamatan ? String(alamatIbu.kecamatan) : null, kelurahan: alamatIbu?.kelurahan ? String(alamatIbu.kelurahan) : null, rt: alamatIbu?.rt ? String(alamatIbu.rt) : null, rw: alamatIbu?.rw ? String(alamatIbu.rw) : null, alamatLengkap: alamatIbu?.alamatLengkap ? String(alamatIbu.alamatLengkap) : null, kodePos: alamatIbu?.kodePos ? String(alamatIbu.kodePos) : null },
            { jenisAlamat: "Wali", luarNegeri: Boolean(alamatWali?.luarNegeri), kepemilikanRumah: alamatWali?.kepemilikanRumah ? String(alamatWali.kepemilikanRumah) : null, provinsi: alamatWali?.provinsi ? String(alamatWali.provinsi) : null, kabupaten: alamatWali?.kabupaten ? String(alamatWali.kabupaten) : null, kecamatan: alamatWali?.kecamatan ? String(alamatWali.kecamatan) : null, kelurahan: alamatWali?.kelurahan ? String(alamatWali.kelurahan) : null, rt: alamatWali?.rt ? String(alamatWali.rt) : null, rw: alamatWali?.rw ? String(alamatWali.rw) : null, alamatLengkap: alamatWali?.alamatLengkap ? String(alamatWali.alamatLengkap) : null, kodePos: alamatWali?.kodePos ? String(alamatWali.kodePos) : null },
            { jenisAlamat: "Siswa", luarNegeri: false, statusTempatTinggal: alamatSiswa?.statusTempatTinggal ? String(alamatSiswa.statusTempatTinggal) : null, provinsi: alamatSiswa?.provinsi ? String(alamatSiswa.provinsi) : null, kabupaten: alamatSiswa?.kabupaten ? String(alamatSiswa.kabupaten) : null, kecamatan: alamatSiswa?.kecamatan ? String(alamatSiswa.kecamatan) : null, kelurahan: alamatSiswa?.kelurahan ? String(alamatSiswa.kelurahan) : null, rt: alamatSiswa?.rt ? String(alamatSiswa.rt) : null, rw: alamatSiswa?.rw ? String(alamatSiswa.rw) : null, alamatLengkap: alamatSiswa?.alamatLengkap ? String(alamatSiswa.alamatLengkap) : null, koordinat: alamatSiswa?.koordinat ? String(alamatSiswa.koordinat) : null, kodePos: alamatSiswa?.kodePos ? String(alamatSiswa.kodePos) : null, jarak: alamatSiswa?.jarak ? String(alamatSiswa.jarak) : null, transportasi: alamatSiswa?.transportasi ? String(alamatSiswa.transportasi) : null, waktuTempuh: alamatSiswa?.waktuTempuh ? String(alamatSiswa.waktuTempuh) : null }
          ]
        },

        aktivitasBelajar: {
          deleteMany: {},
          create: (aktivitasList || []).map((item: any) => ({ ta: String(item.ta || ""), tanggal: String(item.tanggal || ""), nsm: String(item.nsm || ""), jenjang: String(item.jenjang || ""), tingkat: String(item.tingkat || ""), jurusan: String(item.jurusan || ""), rombel: String(item.rombel || ""), status: String(item.status || ""), ket: item.ket ? String(item.ket) : null }))
        },

        beasiswa: {
          deleteMany: {},
          create: (beasiswaList || []).map((item: any) => ({ tahun: String(item.tahun || ""), kategori: String(item.kategori || ""), namaBantuan: String(item.namaBantuan || ""), namaInstansi: String(item.namaInstansi || ""), jenisInstansi: String(item.jenisInstansi || ""), jangkaWaktu: String(item.jangkaWaktu || ""), nominal: String(item.nominal || "") }))
        },

        prestasi: {
          deleteMany: {},
          create: (prestasiList || []).map((item: any) => ({ tahun: String(item.tahun || ""), namaLomba: String(item.namaLomba || ""), bidangLomba: String(item.bidangLomba || ""), namaPenyelenggara: String(item.namaPenyelenggara || ""), lombaTingkat: String(item.lombaTingkat || ""), peringkat: String(item.peringkat || "") }))
        },

        // One-to-One Relations: Menggunakan UPSERT
        penghasilanKeluarga: {
          upsert: {
            create: { rataRata: String(penghasilan?.rataRata || "0"), nomorKks: penghasilan?.nomorKks ? String(penghasilan.nomorKks) : null, nomorPkh: penghasilan?.nomorPkh ? String(penghasilan.nomorPkh) : null },
            update: { rataRata: String(penghasilan?.rataRata || "0"), nomorKks: penghasilan?.nomorKks ? String(penghasilan.nomorKks) : null, nomorPkh: penghasilan?.nomorPkh ? String(penghasilan.nomorPkh) : null }
          }
        },

        kebutuhanKhusus: {
          upsert: {
            create: { kesulitan: kebutuhanDetail?.kesulitan ? String(kebutuhanDetail.kesulitan) : null, alatBantu: kebutuhanDetail?.alatBantu ? String(kebutuhanDetail.alatBantu) : null, pendampingan: kebutuhanDetail?.pendampingan ? String(kebutuhanDetail.pendampingan) : null, penyesuaian: kebutuhanDetail?.penyesuaian ? String(kebutuhanDetail.penyesuaian) : null, kategoriKhusus: kebutuhanKhusus ? String(kebutuhanKhusus) : null, disTidakAda: Boolean(disabilitas?.tidakAda ?? true), disTunaNetra: Boolean(disabilitas?.tunaNetra), disTunaRungu: Boolean(disabilitas?.tunaRungu), disTunaDaksa: Boolean(disabilitas?.tunaDaksa), disTunaGrahita: Boolean(disabilitas?.tunaGrahita), disTunaLaras: Boolean(disabilitas?.tunaLaras), disLainnya: Boolean(disabilitas?.lainnya), disTunaWicara: Boolean(disabilitas?.tunaWicara) },
            update: { kesulitan: kebutuhanDetail?.kesulitan ? String(kebutuhanDetail.kesulitan) : null, alatBantu: kebutuhanDetail?.alatBantu ? String(kebutuhanDetail.alatBantu) : null, pendampingan: kebutuhanDetail?.pendampingan ? String(kebutuhanDetail.pendampingan) : null, penyesuaian: kebutuhanDetail?.penyesuaian ? String(kebutuhanDetail.penyesuaian) : null, kategoriKhusus: kebutuhanKhusus ? String(kebutuhanKhusus) : null, disTidakAda: Boolean(disabilitas?.tidakAda ?? true), disTunaNetra: Boolean(disabilitas?.tunaNetra), disTunaRungu: Boolean(disabilitas?.tunaRungu), disTunaDaksa: Boolean(disabilitas?.tunaDaksa), disTunaGrahita: Boolean(disabilitas?.tunaGrahita), disTunaLaras: Boolean(disabilitas?.tunaLaras), disLainnya: Boolean(disabilitas?.lainnya), disTunaWicara: Boolean(disabilitas?.tunaWicara) }
          }
        }
      }
    });

    const safeData = JSON.parse(
      JSON.stringify(updatedSantri, (key, value) => typeof value === "bigint" ? value.toString() : value)
    );

    return NextResponse.json({ success: true, message: "Data siswa berhasil diperbarui.", data: safeData }, { status: 200 });

  } catch (error: any) {
    if (error.code === "P2002") {
      const target = error.meta?.target as string[];
      if (target?.includes("nisn")) {
        return NextResponse.json({ success: false, message: "Gagal memperbarui! NISN tersebut sudah digunakan oleh siswa lain." }, { status: 400 });
      }
      if (target?.includes("nik")) {
        return NextResponse.json({ success: false, message: "Gagal memperbarui! NIK tersebut sudah digunakan oleh orang lain." }, { status: 400 });
      }
      return NextResponse.json({ success: false, message: "Gagal memperbarui! Data yang Anda masukkan bertabrakan dengan siswa lain." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server saat memperbarui data.", errorDetail: String(error) }, { status: 500 });
  }
}

// 4. METODE DELETE
export async function DELETE(request: Request) {
  try {
    if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
    const prisma = globalForPrisma.prisma;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ success: false, message: "ID Siswa tidak valid atau kosong." }, { status: 400 });
    
    await prisma.santri.delete({ where: { id: id } });
    return NextResponse.json({ success: true, message: "Data siswa beserta relasinya berhasil dihapus." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Gagal menghapus data.", errorDetail: String(error) }, { status: 500 });
  }
}