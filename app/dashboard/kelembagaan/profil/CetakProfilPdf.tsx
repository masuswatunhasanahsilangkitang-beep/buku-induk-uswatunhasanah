"use client";
import { useEffect, useState } from "react";

export default function CetakProfilPdf() {
  const [data, setData] = useState<any>({});
  const [prestasi, setPrestasi] = useState<any[]>([]);
  const [program, setProgram] = useState<any[]>([]);
  const [bantuan, setBantuan] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const resProfil = await fetch("/api/kelembagaan").then(res => res.json());
      if (resProfil.success) setData(resProfil.data || {});

      const resPres = await fetch("/api/kelembagaan/prestasi").then(res => res.json());
      if (resPres.success) setPrestasi(resPres.data || []);

      const resProg = await fetch("/api/kelembagaan/program").then(res => res.json());
      if (resProg.success) setProgram(resProg.data || []);

      const resBant = await fetch("/api/kelembagaan/bantuan-operasional").then(res => res.json());
      if (resBant.success) setBantuan(resBant.data || []);
    }
    fetchData();
  }, []);

  return (
    <div className="hidden print:block bg-white text-black p-8 font-sans text-xs space-y-6">
      
      {/* KOP SURAT / HEADER LAPORAN */}
      <div className="text-center border-b-2 border-black pb-4 space-y-1">
        <h3 className="text-sm font-bold uppercase">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h3>
        <h1 className="text-lg font-extrabold uppercase">{data.namaLembaga || "PROFIL MADRASAH"}</h1>
        <p className="text-[10px]">NSM: {data.nsm || "-"} | NPSN: {data.npsn || "-"} | Email: {data.email || "-"}</p>
        <p className="text-[10px]">Alamat: {data.alamatLengkap || "Alamat belum diatur pada menu Lokasi"}</p>
      </div>

      <h2 className="text-center font-bold text-sm uppercase underline pt-2">LAPORAN PROFIL & DATA KELEMBAGAAN MADRASAH</h2>

      {/* 1. IDENTITAS UTAMA */}
      <div className="space-y-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 uppercase">A. Identitas Madrasah</h3>
        <table className="w-full text-left">
          <tbody>
            <tr><td className="w-1/3 py-1 font-semibold">Nama Lengkap Lembaga</td><td>: {data.namaLembaga || "-"}</td></tr>
            <tr><td className="py-1 font-semibold">Status / Jenis Lembaga</td><td>: {data.statusLembaga || "-"} / {data.jenisLembaga || "-"}</td></tr>
            <tr><td className="py-1 font-semibold">Tahun Berdiri & Waktu Belajar</td><td>: {data.tahunBerdiri || "-"} ({data.waktuBelajar || "-"})</td></tr>
            <tr><td className="py-1 font-semibold">NPWP & No. Telepon</td><td>: {data.npwp || "-"} / {data.telepon || "-"}</td></tr>
            <tr><td className="py-1 font-semibold">Penyelenggara / Yayasan</td><td>: {data.penyelenggaraLembaga || "-"} ({data.namaPenyelenggara || "-"})</td></tr>
          </tbody>
        </table>
      </div>

      {/* 2. PERSONEL INTI */}
      <div className="space-y-2 pt-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 uppercase">B. Pimpinan & Personel Inti</h3>
        <table className="w-full text-left">
          <tbody>
            <tr><td className="w-1/3 py-1 font-semibold">Kepala Madrasah</td><td>: {data.namaKepalaMadrasah || "-"} (NIP: {data.nipKepalaMadrasah || "-"})</td></tr>
            <tr><td className="py-1 font-semibold">Kontak Kepala Madrasah</td><td>: {data.noHpKepalaMadrasah || "-"}</td></tr>
            <tr><td className="py-1 font-semibold">Ketua Komite Madrasah</td><td>: {data.namaKetuaKomite || "-"} (Telp: {data.noHpKetuaKomite || "-"})</td></tr>
          </tbody>
        </table>
      </div>

      {/* 3. DOKUMEN PERIZINAN */}
      <div className="space-y-2 pt-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 uppercase">C. Dokumen Perizinan & Legalitas</h3>
        <table className="w-full text-left">
          <tbody>
            <tr><td className="w-1/3 py-1 font-semibold">SK Pendirian</td><td>: {data.skPendirian || "-"} (Tgl: {data.tanggalSkPendirian || "-"})</td></tr>
            <tr><td className="py-1 font-semibold">SK Izin Operasional</td><td>: {data.skIzinOperasional || "-"} (Tgl: {data.tanggalSkIzinOperasional || "-"})</td></tr>
            <tr><td className="py-1 font-semibold">Akreditasi Madrasah</td><td>: Peringkat {data.akreditasi || "-"} (SK: {data.skAkreditasi || "-"} Tahun {data.tahunAkreditasi || "-"})</td></tr>
          </tbody>
        </table>
      </div>

      {/* 4. TABEL PRESTASI */}
      <div className="space-y-2 pt-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 uppercase">D. Riwayat Prestasi & Penghargaan</h3>
        <table className="w-full border-collapse border border-black text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1">No</th>
              <th className="border border-black p-1">Tahun</th>
              <th className="border border-black p-1">Nama Kejuaraan</th>
              <th className="border border-black p-1">Tingkat</th>
              <th className="border border-black p-1">Pencapaian</th>
            </tr>
          </thead>
          <tbody>
            {prestasi.length === 0 ? (
              <tr><td colSpan={5} className="border border-black p-2 text-center italic">Tidak ada data prestasi</td></tr>
            ) : (
              prestasi.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border border-black p-1">{idx + 1}</td>
                  <td className="border border-black p-1">{item.tahun}</td>
                  <td className="border border-black p-1 text-left">{item.namaKejuaraan}</td>
                  <td className="border border-black p-1">{item.tingkat}</td>
                  <td className="border border-black p-1">{item.pencapaian}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. TABEL PROGRAM */}
      <div className="space-y-2 pt-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 uppercase">E. Program & Layanan Diselenggarakan</h3>
        <table className="w-full border-collapse border border-black text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1">No</th>
              <th className="border border-black p-1">Nama Program</th>
              <th className="border border-black p-1">Jenis</th>
              <th className="border border-black p-1">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {program.length === 0 ? (
              <tr><td colSpan={4} className="border border-black p-2 text-center italic">Tidak ada data program</td></tr>
            ) : (
              program.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border border-black p-1">{idx + 1}</td>
                  <td className="border border-black p-1 text-left">{item.namaProgram}</td>
                  <td className="border border-black p-1">{item.jenisProgram}</td>
                  <td className="border border-black p-1 text-left">{item.keterangan || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 6. TABEL BANTUAN */}
      <div className="space-y-2 pt-2">
        <h3 className="font-bold border-b border-gray-400 pb-1 uppercase">F. Riwayat Bantuan Operasional</h3>
        <table className="w-full border-collapse border border-black text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1">No</th>
              <th className="border border-black p-1">Tahun</th>
              <th className="border border-black p-1">Nama Bantuan</th>
              <th className="border border-black p-1">Sumber Dana</th>
              <th className="border border-black p-1">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {bantuan.length === 0 ? (
              <tr><td colSpan={5} className="border border-black p-2 text-center italic">Tidak ada data bantuan</td></tr>
            ) : (
              bantuan.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border border-black p-1">{idx + 1}</td>
                  <td className="border border-black p-1">{item.tahun}</td>
                  <td className="border border-black p-1 text-left">{item.namaBantuan}</td>
                  <td className="border border-black p-1">{item.sumberDana}</td>
                  <td className="border border-black p-1 text-right">{item.nominal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TANDA TANGAN */}
      <div className="flex justify-end pt-8">
        <div className="text-center space-y-12">
          <p>{data.kabupatenKota || "Kabupaten"}, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-bold underline uppercase">{data.namaKepalaMadrasah || "Kepala Madrasah"}</p>
        </div>
      </div>

    </div>
  );
}