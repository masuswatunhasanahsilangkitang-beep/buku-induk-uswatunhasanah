"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function DetailSiswaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/santri?id=${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Menyiapkan Arsip Buku Induk...</div>;
  if (!data) return <div className="p-8 text-center text-red-500 font-bold">Data siswa tidak ditemukan.</div>;

  // Ekstrak Relasi Data (7 Kategori Input)
  const ayah = data.orangTua?.find((o: any) => o.jenis === "Ayah") || {};
  const ibu = data.orangTua?.find((o: any) => o.jenis === "Ibu") || {};
  const wali = data.orangTua?.find((o: any) => o.jenis === "Wali") || {};
  
  const alamatSiswa = data.alamat?.find((a: any) => a.jenisAlamat === "Siswa") || {};
  const alamatAyah = data.alamat?.find((a: any) => a.jenisAlamat === "Ayah") || {};
  const alamatIbu = data.alamat?.find((a: any) => a.jenisAlamat === "Ibu") || {};
  
  const penghasilan = data.penghasilanKeluarga || {};
  const kesehatan = data.kebutuhanKhusus || {};
  const aktivitas = data.aktivitasBelajar || [];
  const beasiswa = data.beasiswa || [];
  const prestasi = data.prestasi || [];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 pb-12">
      
      {/* HEADER KONTROL (Disembunyikan saat print) */}
      <div className="p-4 md:p-8 max-w-5xl mx-auto print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <button onClick={() => router.back()} className="text-sm font-bold text-blue-600 hover:underline mb-2 block">
              &larr; Kembali ke Daftar Siswa
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Detail Arsip Siswa (Lengkap)</h1>
            <p className="text-sm text-gray-500">Buku Induk siap cetak mencakup 7 instrumen pendataan.</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/santri/${data.id}/edit`} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-lg shadow">
              ✏️ Edit Data
            </Link>
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-lg shadow flex items-center gap-2">
              🖨️ Cetak Lembar Buku Induk
            </button>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* AREA KERTAS CETAK (A4) */}
      {/* ================================================== */}
      <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-[20mm] shadow-lg print:shadow-none print:p-0 print:m-0 text-black text-[12px] leading-relaxed">
        
        {/* KOP SURAT */}
        <div className="border-b-4 border-black pb-4 mb-6 text-center">
          <h2 className="text-lg font-black uppercase tracking-wider">Kementerian Agama Republik Indonesia</h2>
          <h1 className="text-xl font-black uppercase mt-1">Buku Induk Peserta Didik</h1>
          <h3 className="text-md font-bold uppercase mt-1">Madrasah Aliyah PP Uswatun Hasanah</h3>
          <p className="mt-2">Nomor Induk Siswa Nasional (NISN): <span className="font-bold font-mono">{data.nisn}</span></p>
        </div>

        {/* PAS FOTO & NOMOR INDUK */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-28 h-36 border-2 border-gray-400 flex items-center justify-center bg-gray-50 text-gray-400 text-xs text-center p-2">
            Pas Foto<br/>3 x 4
          </div>
          <div className="border-2 border-black p-3 text-right">
            <p className="text-[10px] font-bold uppercase">Nomor Induk Lokal</p>
            <p className="text-lg font-black font-mono mt-1">{data.nis || "- ----"}</p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. KETERANGAN DATA PRIBADI */}
          <div className="page-break-inside-avoid">
            <h4 className="font-bold bg-gray-200 p-1 mb-2 uppercase">A. Keterangan Data Pribadi</h4>
            <table className="w-full">
              <tbody>
                <tr><td className="w-6 align-top">1.</td><td className="w-48 align-top">Nama Lengkap Sesuai Ijazah</td><td className="w-4 align-top">:</td><td className="font-bold uppercase">{data.namaLengkap}</td></tr>
                <tr><td className="align-top">2.</td><td className="align-top">Nama Panggilan</td><td className="align-top">:</td><td>{data.namaPanggilan || "-"}</td></tr>
                <tr><td className="align-top">3.</td><td className="align-top">Jenis Kelamin</td><td className="align-top">:</td><td>{data.jenisKelamin}</td></tr>
                <tr><td className="align-top">4.</td><td className="align-top">Tempat, Tanggal Lahir</td><td className="align-top">:</td><td>{data.tempatLahir}, {data.tanggalLahir}</td></tr>
                <tr><td className="align-top">5.</td><td className="align-top">Agama</td><td className="align-top">:</td><td>{data.agama}</td></tr>
                <tr><td className="align-top">6.</td><td className="align-top">Kewarganegaraan / NIK</td><td className="align-top">:</td><td>{data.kewarganegaraan} / <span className="font-mono">{data.nik}</span></td></tr>
                <tr><td className="align-top">7.</td><td className="align-top">Anak ke / Jumlah Saudara</td><td className="align-top">:</td><td>Ke-{data.anakKe || "-"} dari {data.jumlahSaudara || "-"} bersaudara</td></tr>
                <tr><td className="align-top">8.</td><td className="align-top">Status dalam Keluarga</td><td className="align-top">:</td><td>{data.statusKeluarga || "-"}</td></tr>
                <tr><td className="align-top">9.</td><td className="align-top">Kontak (No. HP / Email)</td><td className="align-top">:</td><td>{data.nomorHp || "-"} / {data.email || "-"}</td></tr>
                <tr><td className="align-top">10.</td><td className="align-top">Cita-cita / Hobi</td><td className="align-top">:</td><td>{data.citaCita || "-"} / {data.hobi || "-"}</td></tr>
              </tbody>
            </table>
          </div>

          {/* 2. TEMPAT TINGGAL */}
          <div className="page-break-inside-avoid">
            <h4 className="font-bold bg-gray-200 p-1 mb-2 uppercase">B. Keterangan Tempat Tinggal</h4>
            <table className="w-full">
              <tbody>
                <tr><td className="w-6 align-top">11.</td><td className="w-48 align-top">Alamat Domisili Siswa</td><td className="w-4 align-top">:</td><td>{alamatSiswa.alamatLengkap || "-"}</td></tr>
                <tr><td className="align-top">12.</td><td className="align-top">RT/RW & Kelurahan</td><td className="align-top">:</td><td>RT {alamatSiswa.rt || "-"} / RW {alamatSiswa.rw || "-"}, Kel. {alamatSiswa.kelurahan || "-"}</td></tr>
                <tr><td className="align-top">13.</td><td className="align-top">Kecamatan & Kab/Kota</td><td className="align-top">:</td><td>Kec. {alamatSiswa.kecamatan || "-"}, {alamatSiswa.kabupaten || "-"}</td></tr>
                <tr><td className="align-top">14.</td><td className="align-top">Status Tempat Tinggal</td><td className="align-top">:</td><td>{alamatSiswa.statusTempatTinggal || "-"}</td></tr>
                <tr><td className="align-top">15.</td><td className="align-top">Jarak & Transportasi</td><td className="align-top">:</td><td>{alamatSiswa.jarak || "-"} km menggunakan {alamatSiswa.transportasi || "-"}</td></tr>
              </tbody>
            </table>
          </div>

          {/* 3. KESEHATAN & KEBUTUHAN KHUSUS */}
          <div className="page-break-inside-avoid">
            <h4 className="font-bold bg-gray-200 p-1 mb-2 uppercase">C. Keterangan Kesehatan & Kebutuhan Khusus</h4>
            <table className="w-full">
              <tbody>
                <tr><td className="w-6 align-top">16.</td><td className="w-48 align-top">Riwayat Imunisasi Dasar</td><td className="w-4 align-top">:</td>
                  <td>
                    {data.imunBcg && "BCG, "} {data.imunDpt && "DPT, "} {data.imunPolio && "Polio, "}
                    {data.imunCampak && "Campak, "} {data.imunHepatitisB && "Hepatitis B, "} {data.imunCovid && "Covid-19"}
                    {(!data.imunBcg && !data.imunDpt && !data.imunPolio && !data.imunCampak) && "Belum Terdata"}
                  </td>
                </tr>
                <tr><td className="align-top">17.</td><td className="align-top">Disabilitas / Kekhususan</td><td className="align-top">:</td>
                  <td>{kesehatan.disTidakAda ? "Tidak Ada / Normal" : kesehatan.kategoriKhusus || "Ada Kebutuhan Khusus"}</td>
                </tr>
                {!kesehatan.disTidakAda && (
                  <tr><td className="align-top"></td><td className="align-top">Bantuan / Penyesuaian</td><td className="align-top">:</td>
                    <td>{kesehatan.alatBantu || kesehatan.penyesuaian || "-"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 4. ORANG TUA / WALI & KESEJAHTERAAN */}
          <div className="page-break-inside-avoid">
            <h4 className="font-bold bg-gray-200 p-1 mb-2 uppercase">D. Keterangan Orang Tua & Kesejahteraan</h4>
            <table className="w-full">
              <tbody>
                <tr><td className="w-6 align-top">18.</td><td className="w-48 align-top">Nama Kepala Keluarga / No. KK</td><td className="w-4 align-top">:</td><td>{data.namaKepalaKeluarga || "-"} / <span className="font-mono">{data.noKk || "-"}</span></td></tr>
                
                {/* Ayah */}
                <tr><td className="align-top">19.</td><td colSpan={3} className="font-bold italic mt-2 inline-block">Data Ayah Kandung ({ayah.status || "-"})</td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">a. Nama Lengkap & NIK</td><td className="align-top">:</td><td className="uppercase">{ayah.namaLengkap || "-"} <span className="text-[10px] font-mono">({ayah.nik || "-"})</span></td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">b. Pendidikan & Pekerjaan</td><td className="align-top">:</td><td>{ayah.pendidikan || "-"} / {ayah.pekerjaan || "-"}</td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">c. Alamat Lengkap</td><td className="align-top">:</td><td>{alamatAyah.alamatLengkap || alamatSiswa.alamatLengkap || "-"}</td></tr>

                {/* Ibu */}
                <tr><td className="align-top">20.</td><td colSpan={3} className="font-bold italic mt-2 inline-block">Data Ibu Kandung ({ibu.status || "-"})</td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">a. Nama Lengkap & NIK</td><td className="align-top">:</td><td className="uppercase">{ibu.namaLengkap || "-"} <span className="text-[10px] font-mono">({ibu.nik || "-"})</span></td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">b. Pendidikan & Pekerjaan</td><td className="align-top">:</td><td>{ibu.pendidikan || "-"} / {ibu.pekerjaan || "-"}</td></tr>

                {/* Wali (Jika Ada) */}
                {wali.namaLengkap && (
                  <>
                    <tr><td className="align-top">21.</td><td colSpan={3} className="font-bold italic mt-2 inline-block">Data Wali Siswa ({wali.status || "-"})</td></tr>
                    <tr><td className="align-top"></td><td className="align-top pl-4">a. Nama Lengkap & NIK</td><td className="align-top">:</td><td className="uppercase">{wali.namaLengkap || "-"} <span className="text-[10px] font-mono">({wali.nik || "-"})</span></td></tr>
                    <tr><td className="align-top"></td><td className="align-top pl-4">b. Pendidikan & Pekerjaan</td><td className="align-top">:</td><td>{wali.pendidikan || "-"} / {wali.pekerjaan || "-"}</td></tr>
                  </>
                )}

                {/* Kesejahteraan */}
                <tr><td className="align-top">22.</td><td colSpan={3} className="font-bold mt-2 inline-block">Data Bantuan / Kesejahteraan Keluarga</td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">a. Rata-Rata Penghasilan</td><td className="align-top">:</td><td>Rp {penghasilan.rataRata || "-"} / Bulan</td></tr>
                <tr><td className="align-top"></td><td className="align-top pl-4">b. Nomor Bantuan</td><td className="align-top">:</td><td>
                  KIP: {data.nomorKip || "-"} | PKH: {penghasilan.nomorPkh || "-"} | KKS: {penghasilan.nomorKks || "-"}
                </td></tr>
              </tbody>
            </table>
          </div>

          {/* 5. RIWAYAT PENDIDIKAN (AKTIVITAS BELAJAR) */}
          <div className="page-break-inside-avoid mt-4">
            <h4 className="font-bold bg-gray-200 p-1 mb-2 uppercase">E. Riwayat Pendidikan & Aktivitas Belajar</h4>
            <div className="mb-2">
              <span className="font-bold">Pra-Sekolah:</span> {data.praTkRa ? "Pernah TK/RA" : ""} {data.praPaud ? "| Pernah PAUD" : ""} {(!data.praTkRa && !data.praPaud) ? "Tidak ada riwayat pra-sekolah" : ""}
            </div>
            
            {aktivitas.length > 0 ? (
              <table className="w-full border-collapse border border-gray-400 mt-2 text-[11px] text-center">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="border border-gray-400 p-1">Tahun Ajaran</th>
                    <th className="border border-gray-400 p-1">Jenjang/Tingkat</th>
                    <th className="border border-gray-400 p-1">Rombel</th>
                    <th className="border border-gray-400 p-1">Status Aktivitas</th>
                    <th className="border border-gray-400 p-1">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  {aktivitas.map((act: any, idx: number) => (
                    <tr key={idx}>
                      <td className="border border-gray-400 p-1">{act.ta}</td>
                      <td className="border border-gray-400 p-1">{act.jenjang} / Tk.{act.tingkat}</td>
                      <td className="border border-gray-400 p-1">{act.rombel}</td>
                      <td className="border border-gray-400 p-1">{act.status}</td>
                      <td className="border border-gray-400 p-1">{act.ket || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="italic text-gray-500">Belum ada catatan mutasi/kenaikan kelas aktif.</p>
            )}
          </div>

          {/* 6. PRESTASI & BEASISWA */}
          <div className="page-break-inside-avoid">
            <h4 className="font-bold bg-gray-200 p-1 mb-2 uppercase">F. Keterangan Beasiswa & Prestasi</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-bold mb-1 border-b border-black pb-1">Beasiswa Diterima</p>
                {beasiswa.length > 0 ? (
                  <ul className="list-disc pl-4 text-[11px] space-y-1">
                    {beasiswa.map((b: any, idx: number) => (
                      <li key={idx}>{b.tahun}: {b.namaBantuan} ({b.namaInstansi})</li>
                    ))}
                  </ul>
                ) : <p className="italic text-[11px]">Nihil</p>}
              </div>

              <div>
                <p className="font-bold mb-1 border-b border-black pb-1">Prestasi & Penghargaan</p>
                {prestasi.length > 0 ? (
                  <ul className="list-disc pl-4 text-[11px] space-y-1">
                    {prestasi.map((p: any, idx: number) => (
                      <li key={idx}>{p.tahun}: {p.peringkat} - {p.namaLomba} (Tk. {p.lombaTingkat})</li>
                    ))}
                  </ul>
                ) : <p className="italic text-[11px]">Nihil</p>}
              </div>
            </div>
          </div>

        </div>

        {/* TANDA TANGAN (Memaksa selalu ada di akhir) */}
        <div className="mt-12 flex justify-between px-8 page-break-inside-avoid">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p>Orang Tua / Wali Siswa</p>
            <div className="h-24"></div>
            <p className="font-bold uppercase underline">{ayah.namaLengkap || ibu.namaLengkap || wali.namaLengkap || "......................................"}</p>
          </div>
          <div className="text-center">
            <p>Ditetapkan di: ..................................</p>
            <p>Tanggal: ..........................................</p>
            <p className="mt-2">Kepala Madrasah,</p>
            <div className="h-24"></div>
            <p className="font-bold uppercase underline">..................................................</p>
            <p>NIP. ..........................................</p>
          </div>
        </div>

      </div>
    </div>
  );
}