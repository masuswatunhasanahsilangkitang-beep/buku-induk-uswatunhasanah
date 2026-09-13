"use client";
import Link from "next/link";
import { useState } from "react";

export default function FormTambah({ simpanGuru }: { simpanGuru: any }) {
  const [kategori, setKategori] = useState("Guru");
  const [tabAktif, setTabAktif] = useState("Tugas Pokok");

  const jabatanGuru = ["Kepala Madrasah", "Wakil Kepala Madrasah", "Guru Mata Pelajaran", "Guru Kelas", "Guru BK", "Pembina Ekstrakurikuler"];
  const jabatanTendik = ["Kepala Tata Usaha", "Staf Tata Usaha", "Operator Madrasah", "Bendahara", "Pustakawan", "Laboran", "Tenaga Kebersihan", "Petugas Keamanan"];
  const daftarJabatan = kategori === "Guru" ? jabatanGuru : jabatanTendik;

  const tabs = ["Tugas Pokok", "Data Diri", "Kepegawaian", "Sekolah Bertugas", "Info Keluarga", "Sertifikasi"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header & Navigasi Tab */}
        <div className="bg-white border-b border-gray-100 p-6 pb-0">
          <h1 className="text-2xl font-black text-gray-800 mb-6">Tambah Data Guru & Tendik</h1>
          <div className="flex gap-6 overflow-x-auto text-sm font-bold text-gray-500 whitespace-nowrap scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setTabAktif(tab)}
                className={`pb-4 border-b-2 transition-colors ${
                  tabAktif === tab ? "border-blue-600 text-blue-600" : "border-transparent hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <form action={simpanGuru} className="p-8 space-y-6">
          
          {/* TAB 1: TUGAS POKOK */}
          <div className={tabAktif === "Tugas Pokok" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">Nama Lengkap *</label>
                <input type="text" name="namaLengkap" required className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">Kategori Tugas *</label>
                <select name="kategoriTugas" value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm">
                  <option value="Guru">Tenaga Pendidik</option>
                  <option value="Tendik">Tenaga Kependidikan (Tendik)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">Jabatan Utama *</label>
                <select name="jabatan" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm">
                  {daftarJabatan.map((jbt) => <option key={jbt} value={jbt}>{jbt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* TAB 2: DATA DIRI */}
          <div className={tabAktif === "Data Diri" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">NIK</label><input type="text" name="nik" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">NUPTK</label><input type="text" name="nuptk" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">Jenis Kelamin</label>
                <select name="jenisKelamin" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm">
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Agama</label><input type="text" name="agama" defaultValue="Islam" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Tempat Lahir</label><input type="text" name="tempatLahir" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Tanggal Lahir</label><input type="date" name="tanggalLahir" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">No. Handphone</label><input type="text" name="noHp" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Email</label><input type="email" name="email" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Jenis PTK</label><input type="text" name="jenisPtk" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2 md:col-span-2"><label className="text-xs font-bold text-gray-600 uppercase">Alamat Lengkap</label><textarea name="alamat" rows={2} className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm"></textarea></div>
            </div>
          </div>

          {/* TAB 3: KEPEGAWAIAN */}
          <div className={tabAktif === "Kepegawaian" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Status Pegawai</label><input type="text" name="statusPegawai" placeholder="PNS / Non PNS" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">NIP</label><input type="text" name="nip" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Jenis PNS</label><input type="text" name="jenisPns" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">TMT PNS</label><input type="date" name="tmtPns" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">No SK PNS</label><input type="text" name="noSkPns" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Tanggal SK PNS</label><input type="date" name="tglSkPns" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">TMT Guru</label><input type="date" name="tmtGuru" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">TMT Pegawai</label><input type="date" name="tmtPegawai" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
            </div>
          </div>

          {/* TAB 4: SEKOLAH BERTUGAS */}
          <div className={tabAktif === "Sekolah Bertugas" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">NPSN</label><input type="text" name="npsn" defaultValue="10261707" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Nama Sekolah</label><input type="text" name="namaSekolah" defaultValue="MAS PP USWATUN HASANAH" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Bentuk SP</label><input type="text" name="bentukSp" defaultValue="MA" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Provinsi</label><input type="text" name="provinsi" defaultValue="SUMATERA UTARA" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Kabupaten / Kota</label><input type="text" name="kabupatenKota" defaultValue="LABUHANBATU SELATAN" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Kecamatan</label><input type="text" name="kecamatan" defaultValue="SILANGKITANG" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
            </div>
          </div>

          {/* TAB 5: KELUARGA */}
          <div className={tabAktif === "Info Keluarga" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Nama Ibu Kandung</label><input type="text" name="namaIbuKandung" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Status Perkawinan</label><select name="statusPerkawinan" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm"><option value="Kawin">Kawin</option><option value="Belum Kawin">Belum Kawin</option></select></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Nama Suami / Istri</label><input type="text" name="namaSuamiIstri" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Jumlah Anak</label><input type="number" name="jumlahAnak" defaultValue="0" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
            </div>
          </div>

          {/* TAB 6: SERTIFIKASI */}
          <div className={tabAktif === "Sertifikasi" ? "block" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Status Sertifikasi</label><input type="text" name="sertifikasi" placeholder="Sudah / Belum" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">NRG</label><input type="text" name="nrg" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Mapel Sertifikasi</label><input type="text" name="mapelSertifikasi" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
              <div className="space-y-2"><label className="text-xs font-bold text-gray-600 uppercase">Nomor Sertifikat</label><input type="text" name="noSertifikat" className="w-full px-4 py-3 bg-gray-50 border rounded-lg text-sm" /></div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100 flex gap-4 justify-end">
            <Link href="/dashboard/guru" className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">Batal</Link>
            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">Simpan Seluruh Data</button>
          </div>

        </form>
      </div>
    </div>
  );
}