import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CetakButton from "./CetakButton"; // Memanggil komponen tombol cetak

// Komponen Server menggunakan standar Next.js terbaru (Promise Params)
export default async function DetailKelulusanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const kelulusanId = resolvedParams.id;

  // Menarik data kelulusan beserta relasi data siswanya
  const kelulusan = await prisma.kelulusan.findUnique({
    where: { id: kelulusanId },
    include: {
      santri: true,
    }
  });

  if (!kelulusan) {
    notFound();
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-6 print:space-y-0">
        
        {/* ================= HEADER NAVIGASI (Sembunyi saat dicetak) ================= */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4 print:hidden">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/santri" className="hover:text-emerald-600 transition-colors">Siswa</Link> 
              <span>&gt;</span> 
              <Link href="/dashboard/kelulusan" className="hover:text-emerald-600 transition-colors">Kelulusan</Link> 
              <span>&gt;</span> 
              <span className="font-semibold text-gray-600">Detail Alumni</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">
              Dokumen <span className="uppercase text-emerald-700">Kelulusan</span>
            </h1>
          </div>
          <Link href="/dashboard/kelulusan" className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors">
            Kembali
          </Link>
        </div>

        {/* ================= DOKUMEN SURAT KETERANGAN LULUS ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:border-none print:shadow-none">
          
          {/* Kop Dokumen */}
          <div className="p-6 border-b bg-emerald-50 border-emerald-100 print:bg-white print:border-b-2 print:border-gray-800 flex items-center justify-center flex-col py-8">
            <div className="w-16 h-16 bg-emerald-200 text-emerald-700 rounded-full flex items-center justify-center font-bold text-3xl mb-3 print:hidden">
              🎓
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-emerald-800 print:text-black text-center">
              SURAT KETERANGAN LULUS
            </h2>
            <p className="text-sm font-semibold text-emerald-600 print:text-gray-700 mt-1">
              Tahun Ajaran: {kelulusan.tahunAjaran}
            </p>
            {kelulusan.noSuratKelulusan && (
              <p className="text-xs font-medium text-gray-500 mt-2">
                Nomor: {kelulusan.noSuratKelulusan}
              </p>
            )}
          </div>

          <div className="p-8 md:p-12 space-y-8">
            {/* Teks Pengantar */}
            <p className="text-sm font-medium text-gray-700 leading-relaxed text-justify print:text-black">
              Berdasarkan hasil evaluasi pembelajaran dan rapat dewan guru, Kepala {kelulusan.santri.jenisBukuInduk === 'Madrasah' ? 'Madrasah' : 'Pendidikan Kesetaraan (PKPPS)'} dengan ini menerangkan bahwa peserta didik di bawah ini:
            </p>

            {/* Identitas Siswa */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 print:bg-white print:border-none print:p-0">
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr>
                    <td className="py-2 w-1/3 font-bold text-gray-500 uppercase tracking-wider text-xs print:text-gray-600">Nama Lengkap</td>
                    <td className="py-2 w-4 text-center">:</td>
                    <td className="py-2 font-black text-gray-800 uppercase text-lg print:text-black">{kelulusan.santri.namaLengkap}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-gray-500 uppercase tracking-wider text-xs print:text-gray-600">Tempat, Tanggal Lahir</td>
                    <td className="py-2 text-center">:</td>
                    <td className="py-2 font-semibold text-gray-800 print:text-black">{kelulusan.santri.tempatLahir}, {kelulusan.santri.tanggalLahir}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-gray-500 uppercase tracking-wider text-xs print:text-gray-600">NISN</td>
                    <td className="py-2 text-center">:</td>
                    <td className="py-2 font-semibold text-gray-800 print:text-black">{kelulusan.santri.nisn}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-gray-500 uppercase tracking-wider text-xs print:text-gray-600">Nomor Induk Kependudukan (NIK)</td>
                    <td className="py-2 text-center">:</td>
                    <td className="py-2 font-semibold text-gray-800 print:text-black">{kelulusan.santri.nik}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-gray-500 uppercase tracking-wider text-xs print:text-gray-600">Jenis Kelamin</td>
                    <td className="py-2 text-center">:</td>
                    <td className="py-2 font-semibold text-gray-800 print:text-black">{kelulusan.santri.jenisKelamin}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm font-medium text-gray-700 leading-relaxed text-center py-2 bg-emerald-50 text-emerald-800 font-bold border border-emerald-100 rounded-lg print:bg-white print:border-y-2 print:border-gray-800 print:rounded-none print:py-4">
              Dinyatakan: LULUS
            </p>

            {/* Rincian Kelulusan */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 print:text-black print:border-gray-300">Data Administrasi Lanjutan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Tanggal Ditetapkan</p>
                  <p className="font-bold text-gray-800 print:text-black">{kelulusan.tanggalLulus}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Nomor Ijazah</p>
                  <p className="font-bold text-gray-800 print:text-black">{kelulusan.noIjazah || <span className="italic text-gray-400 font-normal">Belum diinput</span>}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Melanjutkan Ke</p>
                  <p className="font-semibold text-gray-800 print:text-black">{kelulusan.melanjutkanKe || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Keterangan</p>
                  <p className="font-medium text-gray-700 text-sm print:text-black">{kelulusan.keterangan || "-"}</p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Footer Dokumen */}
          <div className="p-6 bg-gray-50 border-t border-gray-100 text-center md:text-right print:bg-white print:border-none print:pt-16">
            <CetakButton />
          </div>
        </div>

      </div>
    </div>
  );
}