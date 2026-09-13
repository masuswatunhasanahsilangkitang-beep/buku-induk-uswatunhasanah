-- CreateTable
CREATE TABLE "Santri" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jenisBukuInduk" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "namaPanggilan" TEXT,
    "nis" TEXT,
    "nisn" TEXT NOT NULL,
    "nisLokal" TEXT,
    "kewarganegaraan" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "tanggalVerifikasi" TEXT,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "jumlahSaudara" TEXT,
    "anakKe" TEXT,
    "agama" TEXT NOT NULL,
    "citaCita" TEXT,
    "nomorHp" TEXT,
    "email" TEXT,
    "hobi" TEXT,
    "yangMembiayai" TEXT,
    "statusKeluarga" TEXT,
    "praTkRa" BOOLEAN NOT NULL DEFAULT false,
    "praPaud" BOOLEAN NOT NULL DEFAULT false,
    "imunHepatitisB" BOOLEAN NOT NULL DEFAULT false,
    "imunBcg" BOOLEAN NOT NULL DEFAULT false,
    "imunDpt" BOOLEAN NOT NULL DEFAULT false,
    "imunPolio" BOOLEAN NOT NULL DEFAULT false,
    "imunCampak" BOOLEAN NOT NULL DEFAULT false,
    "imunCovid" BOOLEAN NOT NULL DEFAULT false,
    "nomorKip" TEXT,
    "noKk" TEXT NOT NULL,
    "namaKepalaKeluarga" TEXT NOT NULL,
    "fileFotoSiswa" TEXT,
    "fileAktaSiswa" TEXT,
    "rombelId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Santri_rombelId_fkey" FOREIGN KEY ("rombelId") REFERENCES "Rombel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrangTua" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kewarganegaraan" TEXT NOT NULL,
    "nik" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" TEXT,
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "nomorHp" TEXT,
    "kkSamaAyah" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "OrangTua_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PenghasilanOrtu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "rataRata" TEXT NOT NULL,
    "nomorKks" TEXT,
    "nomorPkh" TEXT,
    "fileKk" TEXT,
    "fileKks" TEXT,
    "filePkh" TEXT,
    CONSTRAINT "PenghasilanOrtu_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alamat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "jenisAlamat" TEXT NOT NULL,
    "luarNegeri" BOOLEAN NOT NULL DEFAULT false,
    "kepemilikanRumah" TEXT,
    "statusTempatTinggal" TEXT,
    "provinsi" TEXT,
    "kabupaten" TEXT,
    "kecamatan" TEXT,
    "kelurahan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "alamatLengkap" TEXT,
    "koordinat" TEXT,
    "kodePos" TEXT,
    "jarak" TEXT,
    "transportasi" TEXT,
    "waktuTempuh" TEXT,
    CONSTRAINT "Alamat_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AktivitasBelajar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "ta" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "nsm" TEXT NOT NULL,
    "jenjang" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "rombel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ket" TEXT,
    CONSTRAINT "AktivitasBelajar_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KebutuhanKhusus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "kesulitan" TEXT,
    "alatBantu" TEXT,
    "pendampingan" TEXT,
    "penyesuaian" TEXT,
    "kategoriKhusus" TEXT,
    "disTidakAda" BOOLEAN NOT NULL DEFAULT true,
    "disTunaNetra" BOOLEAN NOT NULL DEFAULT false,
    "disTunaRungu" BOOLEAN NOT NULL DEFAULT false,
    "disTunaDaksa" BOOLEAN NOT NULL DEFAULT false,
    "disTunaGrahita" BOOLEAN NOT NULL DEFAULT false,
    "disTunaLaras" BOOLEAN NOT NULL DEFAULT false,
    "disLainnya" BOOLEAN NOT NULL DEFAULT false,
    "disTunaWicara" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "KebutuhanKhusus_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Beasiswa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "namaBantuan" TEXT NOT NULL,
    "namaInstansi" TEXT NOT NULL,
    "jenisInstansi" TEXT NOT NULL,
    "jangkaWaktu" TEXT NOT NULL,
    "nominal" TEXT NOT NULL,
    CONSTRAINT "Beasiswa_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prestasi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "namaLomba" TEXT NOT NULL,
    "bidangLomba" TEXT NOT NULL,
    "namaPenyelenggara" TEXT NOT NULL,
    "lombaTingkat" TEXT NOT NULL,
    "peringkat" TEXT NOT NULL,
    CONSTRAINT "Prestasi_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaLengkap" TEXT NOT NULL,
    "kategoriTugas" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nik" TEXT,
    "nuptk" TEXT,
    "nip" TEXT,
    "jenisKelamin" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" TEXT,
    "agama" TEXT,
    "noHp" TEXT,
    "jenisPtk" TEXT,
    "email" TEXT,
    "transportasi" TEXT,
    "jarakTempatTinggal" TEXT,
    "waktuTempuh" TEXT,
    "alamat" TEXT,
    "statusPegawai" TEXT,
    "jenisPns" TEXT,
    "tmtPns" TEXT,
    "noSkPns" TEXT,
    "tglSkPns" TEXT,
    "tmtGuru" TEXT,
    "tmtPegawai" TEXT,
    "npsn" TEXT,
    "namaSekolah" TEXT,
    "bentukSp" TEXT,
    "provinsi" TEXT,
    "kabupatenKota" TEXT,
    "kecamatan" TEXT,
    "desaKel" TEXT,
    "namaIbuKandung" TEXT,
    "statusPerkawinan" TEXT,
    "namaSuamiIstri" TEXT,
    "jumlahAnak" INTEGER DEFAULT 0,
    "sertifikasi" TEXT,
    "jenjangSertifikasi" TEXT,
    "nrg" TEXT,
    "mapelSertifikasi" TEXT,
    "noPeserta" TEXT,
    "lptkPenyelenggara" TEXT,
    "noSertifikat" TEXT,
    "tahunSertifikasi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RiwayatKepegawaian" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guruId" TEXT NOT NULL,
    "tanggalEfektif" TEXT,
    "fungsiJabatan" TEXT,
    "statusPenugasan" TEXT,
    "golRuang" TEXT,
    "statusKeaktifan" TEXT,
    "jenisSk" TEXT,
    "tanggalSk" TEXT,
    "penerbitSk" TEXT,
    CONSTRAINT "RiwayatKepegawaian_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiwayatPendidikan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guruId" TEXT NOT NULL,
    "jenjang" TEXT,
    "namaSekolah" TEXT,
    "fakultas" TEXT,
    "jurusan" TEXT,
    "tahunMasuk" TEXT,
    "tahunLulus" TEXT,
    "gelarAkademik" TEXT,
    "statusIjazah" TEXT,
    CONSTRAINT "RiwayatPendidikan_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TugasPembelajaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guruId" TEXT NOT NULL,
    "tahunAjaran" TEXT,
    "namaSekolah" TEXT,
    "penempatan" TEXT,
    "tingkatRombel" TEXT,
    "jumlahSiswa" INTEGER,
    "mataPelajaran" TEXT,
    "jtm" INTEGER,
    CONSTRAINT "TugasPembelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiwayatDiklat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "guruId" TEXT NOT NULL,
    "namaPelatihan" TEXT,
    "bidangPelatihan" TEXT,
    "penyelenggara" TEXT,
    "tahun" TEXT,
    "tanggalMulai" TEXT,
    "tanggalSelesai" TEXT,
    "noSertifikat" TEXT,
    "jamPendidikan" INTEGER,
    CONSTRAINT "RiwayatDiklat_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MutasiSiswa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "jenisMutasi" TEXT NOT NULL,
    "tanggalMutasi" TEXT NOT NULL,
    "alasan" TEXT,
    "sekolahTujuan" TEXT,
    "noSuratMutasi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MutasiSiswa_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kelulusan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "tanggalLulus" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "noSuratKelulusan" TEXT,
    "noIjazah" TEXT,
    "melanjutkanKe" TEXT,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Kelulusan_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rombel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaRombel" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "waliKelasId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rombel_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "Guru" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Kelembagaan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nsm" TEXT,
    "npsn" TEXT,
    "namaLembaga" TEXT,
    "namaSingkatan" TEXT,
    "statusLembaga" TEXT,
    "jenisLembaga" TEXT,
    "npwp" TEXT,
    "telepon" TEXT,
    "website" TEXT,
    "email" TEXT,
    "youtube" TEXT,
    "instagram" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "tahunBerdiri" TEXT,
    "waktuBelajar" TEXT,
    "statusKkm" TEXT,
    "namaMadrasahInduk" TEXT,
    "komiteLembaga" TEXT,
    "punyaErkam" BOOLEAN NOT NULL DEFAULT false,
    "diPesantren" BOOLEAN NOT NULL DEFAULT false,
    "penyelenggaraLembaga" TEXT,
    "namaPenyelenggara" TEXT,
    "afiliasiKeagamaan" TEXT,
    "nomorPokokYayasan" TEXT,
    "alamatLengkap" TEXT,
    "desaKelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupatenKota" TEXT,
    "provinsi" TEXT,
    "kodePos" TEXT,
    "lintang" TEXT,
    "bujur" TEXT,
    "fotoLogo" TEXT,
    "fotoGedung" TEXT,
    "skPendirian" TEXT,
    "tanggalSkPendirian" TEXT,
    "skIzinOperasional" TEXT,
    "tanggalSkIzinOperasional" TEXT,
    "akreditasi" TEXT,
    "skAkreditasi" TEXT,
    "tahunAkreditasi" TEXT,
    "skKemenkumham" TEXT,
    "namaKepalaMadrasah" TEXT,
    "nipKepalaMadrasah" TEXT,
    "noHpKepalaMadrasah" TEXT,
    "namaKetuaKomite" TEXT,
    "noHpKetuaKomite" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GaleriSarpras" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judulFoto" TEXT NOT NULL,
    "urlFoto" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Kurikulum" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tahunAjaran" TEXT NOT NULL,
    "jenisKurikulum" TEXT NOT NULL,
    "statusAktif" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BantuanLembaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tahun" TEXT NOT NULL,
    "namaBantuan" TEXT NOT NULL,
    "sumberBantuan" TEXT NOT NULL,
    "nominalWujud" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pengawas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaLengkap" TEXT NOT NULL,
    "nip" TEXT,
    "jabatan" TEXT NOT NULL,
    "instansi" TEXT,
    "noHp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Lahan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaLahan" TEXT NOT NULL,
    "noSertifikat" TEXT,
    "luas" TEXT,
    "luasDigunakan" TEXT,
    "luasBelumDigunakan" TEXT,
    "alamatLahan" TEXT,
    "statusTanah" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Gedung" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lahanId" TEXT,
    "namaGedung" TEXT NOT NULL,
    "jumlahLantai" TEXT,
    "kepemilikan" TEXT,
    "tahunDibangun" TEXT,
    "panjang" TEXT,
    "lebar" TEXT,
    "kondisi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gedung_lahanId_fkey" FOREIGN KEY ("lahanId") REFERENCES "Lahan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gedungId" TEXT,
    "namaRuangan" TEXT NOT NULL,
    "jenisRuangan" TEXT NOT NULL,
    "kapasitas" TEXT,
    "panjang" TEXT,
    "lebar" TEXT,
    "kondisi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ruangan_gedungId_fkey" FOREIGN KEY ("gedungId") REFERENCES "Gedung" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AsetRuangan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ruanganId" TEXT,
    "kategori" TEXT NOT NULL,
    "namaAset" TEXT NOT NULL,
    "jumlahTotal" INTEGER NOT NULL DEFAULT 0,
    "kondisiBaik" INTEGER NOT NULL DEFAULT 0,
    "kondisiRusak" INTEGER NOT NULL DEFAULT 0,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AsetRuangan_ruanganId_fkey" FOREIGN KEY ("ruanganId") REFERENCES "Ruangan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AsetLancar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kodeBarang" TEXT,
    "namaBarang" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlahStok" INTEGER NOT NULL DEFAULT 0,
    "satuan" TEXT NOT NULL,
    "sumberDana" TEXT,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Perpustakaan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kodeBuku" TEXT,
    "judulBuku" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "pengarang" TEXT,
    "penerbit" TEXT,
    "tahunTerbit" TEXT,
    "jumlahTotal" INTEGER NOT NULL DEFAULT 0,
    "kondisiBaik" INTEGER NOT NULL DEFAULT 0,
    "kondisiRusak" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PrestasiLembaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tahun" TEXT NOT NULL,
    "namaKejuaraan" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "pencapaian" TEXT NOT NULL,
    "penyelenggara" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProgramLembaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "namaProgram" TEXT NOT NULL,
    "jenisProgram" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BantuanOperasionalLembaga" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tahun" TEXT NOT NULL,
    "namaBantuan" TEXT NOT NULL,
    "sumberDana" TEXT NOT NULL,
    "nominal" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AbsensiSantri" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "santriId" TEXT NOT NULL,
    "tanggal" TEXT NOT NULL,
    "waktu" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AbsensiSantri_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Santri_nisn_key" ON "Santri"("nisn");

-- CreateIndex
CREATE UNIQUE INDEX "Santri_nik_key" ON "Santri"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "PenghasilanOrtu_santriId_key" ON "PenghasilanOrtu"("santriId");

-- CreateIndex
CREATE UNIQUE INDEX "KebutuhanKhusus_santriId_key" ON "KebutuhanKhusus"("santriId");

-- CreateIndex
CREATE UNIQUE INDEX "MutasiSiswa_santriId_key" ON "MutasiSiswa"("santriId");

-- CreateIndex
CREATE UNIQUE INDEX "Kelulusan_santriId_key" ON "Kelulusan"("santriId");

-- CreateIndex
CREATE UNIQUE INDEX "AsetLancar_kodeBarang_key" ON "AsetLancar"("kodeBarang");

-- CreateIndex
CREATE UNIQUE INDEX "Perpustakaan_kodeBuku_key" ON "Perpustakaan"("kodeBuku");
