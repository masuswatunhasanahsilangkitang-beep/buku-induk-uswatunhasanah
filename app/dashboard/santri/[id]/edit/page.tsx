"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditSiswaLengkapPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // PAYLOAD RAKSASA SESUAI STANDAR API BUKU INDUK
  const [payload, setPayload] = useState<any>({
    id: id,
    jenisBukuInduk: "Madrasah",
    formData: { praSekolah: {}, imunisasi: {} },
    ayah: {}, ibu: {}, wali: {},
    alamatAyah: {}, alamatIbu: {}, alamatWali: {}, alamatSiswa: {},
    penghasilan: {},
    kebutuhanDetail: {}, kebutuhanKhusus: "", disabilitas: {},
    aktivitasList: [], beasiswaList: [], prestasiList: []
  });

  useEffect(() => {
    fetch(`/api/santri?id=${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          const d = json.data;
          const getOrtu = (jenis: string) => d.orangTua?.find((o: any) => o.jenis === jenis) || {};
          const getAlamat = (jenis: string) => d.alamat?.find((a: any) => a.jenisAlamat === jenis) || {};

          setPayload({
            id: d.id,
            jenisBukuInduk: d.jenisBukuInduk || "Madrasah",
            formData: {
              namaLengkap: d.namaLengkap, namaPanggilan: d.namaPanggilan, nisn: d.nisn, nik: d.nik, nis: d.nis, nisLokal: d.nisLokal,
              tempatLahir: d.tempatLahir, tanggalLahir: d.tanggalLahir, jenisKelamin: d.jenisKelamin, 
              agama: d.agama, kewarganegaraan: d.kewarganegaraan, nomorHp: d.nomorHp, email: d.email,
              anakKe: d.anakKe, jumlahSaudara: d.jumlahSaudara, statusKeluarga: d.statusKeluarga,
              citaCita: d.citaCita, hobi: d.hobi, nomorKip: d.nomorKip, noKk: d.noKk, namaKepalaKeluarga: d.namaKepalaKeluarga,
              praSekolah: { tkRa: d.praTkRa, paud: d.praPaud },
              imunisasi: { hepatitisB: d.imunHepatitisB, bcg: d.imunBcg, dpt: d.imunDpt, polio: d.imunPolio, campak: d.imunCampak, covid: d.imunCovid }
            },
            ayah: getOrtu("Ayah"), ibu: getOrtu("Ibu"), wali: getOrtu("Wali"),
            alamatSiswa: getAlamat("Siswa"), alamatAyah: getAlamat("Ayah"), alamatIbu: getAlamat("Ibu"),
            penghasilan: d.penghasilanKeluarga || {},
            kebutuhanDetail: d.kebutuhanKhusus || {},
            disabilitas: {
              tidakAda: d.kebutuhanKhusus?.disTidakAda, tunaNetra: d.kebutuhanKhusus?.disTunaNetra, 
              tunaRungu: d.kebutuhanKhusus?.disTunaRungu, tunaDaksa: d.kebutuhanKhusus?.disTunaDaksa
            },
            kebutuhanKhusus: d.kebutuhanKhusus?.kategoriKhusus || "",
            aktivitasList: d.aktivitasBelajar || [], beasiswaList: d.beasiswa || [], prestasiList: d.prestasi || []
          });
        }
        setLoading(false);
      });
  }, [id]);

  // FUNGSI HANDLER INPUT
  const handleFormChange = (e: any) => setPayload({ ...payload, formData: { ...payload.formData, [e.target.name]: e.target.value } });
  const handleGroupChange = (group: string, e: any) => setPayload({ ...payload, [group]: { ...payload[group], [e.target.name]: e.target.value } });
  
  // Handler Checkbox Bersarang (Untuk Imunisasi & Disabilitas)
  const handleNestedCheckbox = (group: string, subGroup: string, field: string, checked: boolean) => {
    setPayload({ ...payload, [group]: { ...payload[group], [subGroup]: { ...payload[group][subGroup], [field]: checked } } });
  };

  // Handler Array Dinamis (Untuk Riwayat/Prestasi)
  const handleArrayChange = (arrayName: string, index: number, field: string, value: string) => {
    const newArr = [...payload[arrayName]];
    newArr[index][field] = value;
    setPayload({ ...payload, [arrayName]: newArr });
  };
  const addArrayItem = (arrayName: string, template: any) => setPayload({ ...payload, [arrayName]: [...payload[arrayName], template] });
  const removeArrayItem = (arrayName: string, index: number) => {
    const newArr = [...payload[arrayName]];
    newArr.splice(index, 1);
    setPayload({ ...payload, [arrayName]: newArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMessage(null);
    try {
      const res = await fetch("/api/santri", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMessage({ type: "success", text: "✅ Seluruh Data Siswa Berhasil Diperbarui!" });
        setTimeout(() => router.push(`/dashboard/santri/${id}`), 1500);
      } else {
        setMessage({ type: "error", text: json.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Menyiapkan Formulir Komprehensif...</div>;

  const TabBtn = ({ n, label }: { n: number, label: string }) => (
    <button type="button" onClick={() => setActiveTab(n)} className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === n ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
      {label}
    </button>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Data Komprehensif Siswa</h1>
            <p className="text-sm text-gray-500">Buku Induk (Pribadi, Orang Tua, Kesejahteraan, Kebutuhan Khusus, Riwayat)</p>
          </div>
          <Link href={`/dashboard/santri/${id}`} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-bold text-gray-700 transition-colors">
            Batal & Kembali
          </Link>
        </div>

        {/* TAB MENU */}
        <div className="bg-white px-2 pt-2 border-b border-gray-200 flex gap-1 overflow-x-auto rounded-t-xl shadow-sm">
          <TabBtn n={1} label="1. Data Pribadi" />
          <TabBtn n={2} label="2. Alamat & Kontak" />
          <TabBtn n={3} label="3. Orang Tua & Wali" />
          <TabBtn n={4} label="4. Kesehatan & Kesejahteraan" />
          <TabBtn n={5} label="5. Riwayat Akademik (Mutasi/Prestasi)" />
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-b-xl shadow-sm border border-gray-100 border-t-0 space-y-6">
          
          {message && <div className={`p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}

          {/* ======================================= */}
          {/* TAB 1: DATA PRIBADI */}
          {activeTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-300">
              <div className="md:col-span-3 pb-2 border-b font-bold text-gray-700">Identitas Utama</div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Nama Sesuai Akta</label><input type="text" name="namaLengkap" value={payload.formData.namaLengkap || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm uppercase" required /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">NISN / NIS Lokal</label><div className="flex gap-2"><input type="number" name="nisn" value={payload.formData.nisn || ""} onChange={handleFormChange} placeholder="NISN" className="w-full px-3 py-2 border rounded text-sm" required /><input type="text" name="nis" value={payload.formData.nis || ""} onChange={handleFormChange} placeholder="NIS" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">NIK Siswa (Wajib)</label><input type="number" name="nik" value={payload.formData.nik || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" required /></div>
              
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Tempat, Tgl Lahir</label><div className="flex gap-2"><input type="text" name="tempatLahir" value={payload.formData.tempatLahir || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /><input type="date" name="tanggalLahir" value={payload.formData.tanggalLahir || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Jenis Kelamin</label><select name="jenisKelamin" value={payload.formData.jenisKelamin || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm"><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Agama & Kewarganegaraan</label><div className="flex gap-2"><input type="text" name="agama" value={payload.formData.agama || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /><input type="text" name="kewarganegaraan" value={payload.formData.kewarganegaraan || "WNI"} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              
              <div className="md:col-span-3 pb-2 border-b font-bold text-gray-700 mt-4">Keterangan Keluarga & Pribadi</div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Anak Ke / Jumlah Saudara</label><div className="flex gap-2"><input type="number" name="anakKe" value={payload.formData.anakKe || ""} onChange={handleFormChange} placeholder="Ke" className="w-full px-3 py-2 border rounded text-sm" /><input type="number" name="jumlahSaudara" value={payload.formData.jumlahSaudara || ""} onChange={handleFormChange} placeholder="Dr Jml" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Status dlm Keluarga</label><input type="text" name="statusKeluarga" value={payload.formData.statusKeluarga || ""} onChange={handleFormChange} placeholder="Anak Kandung/Tiri" className="w-full px-3 py-2 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Cita-cita / Hobi</label><div className="flex gap-2"><input type="text" name="citaCita" value={payload.formData.citaCita || ""} onChange={handleFormChange} placeholder="Cita-cita" className="w-full px-3 py-2 border rounded text-sm" /><input type="text" name="hobi" value={payload.formData.hobi || ""} onChange={handleFormChange} placeholder="Hobi" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 2: ALAMAT & KONTAK */}
          {activeTab === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in duration-300">
              <div className="md:col-span-2 pb-2 border-b font-bold text-gray-700">Alamat Domisili Siswa & Kontak Pribadi</div>
              <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 mb-1">Alamat Jalan / Dusun</label><input type="text" name="alamatLengkap" value={payload.alamatSiswa.alamatLengkap || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} className="w-full px-3 py-2 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">RT / RW</label><div className="flex gap-2"><input type="text" name="rt" value={payload.alamatSiswa.rt || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} placeholder="RT" className="w-full px-3 py-2 border rounded text-sm" /><input type="text" name="rw" value={payload.alamatSiswa.rw || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} placeholder="RW" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Desa / Kelurahan</label><input type="text" name="kelurahan" value={payload.alamatSiswa.kelurahan || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} className="w-full px-3 py-2 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Kecamatan</label><input type="text" name="kecamatan" value={payload.alamatSiswa.kecamatan || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} className="w-full px-3 py-2 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Kabupaten / Kota</label><input type="text" name="kabupaten" value={payload.alamatSiswa.kabupaten || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} className="w-full px-3 py-2 border rounded text-sm" /></div>
              
              <div className="md:col-span-2 pb-2 border-b font-bold text-gray-700 mt-4">Keterangan Jarak & Transportasi</div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Status Tempat Tinggal</label><input type="text" name="statusTempatTinggal" value={payload.alamatSiswa.statusTempatTinggal || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} placeholder="Contoh: Bersama Orang Tua" className="w-full px-3 py-2 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Jarak (Km) / Waktu Tempuh / Transportasi</label><div className="flex gap-2"><input type="text" name="jarak" value={payload.alamatSiswa.jarak || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} placeholder="Jarak (Km)" className="w-full px-3 py-2 border rounded text-sm" /><input type="text" name="transportasi" value={payload.alamatSiswa.transportasi || ""} onChange={(e) => handleGroupChange('alamatSiswa', e)} placeholder="Transportasi" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Nomor HP / WhatsApp Aktif</label><input type="text" name="nomorHp" value={payload.formData.nomorHp || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /></div>
              <div><label className="block text-xs font-bold text-gray-500 mb-1">Alamat Email</label><input type="email" name="email" value={payload.formData.email || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /></div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 3: ORANG TUA & WALI */}
          {activeTab === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Nama Kepala Keluarga</label><input type="text" name="namaKepalaKeluarga" value={payload.formData.namaKepalaKeluarga || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm uppercase" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Nomor Kartu Keluarga (KK)</label><input type="number" name="noKk" value={payload.formData.noKk || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /></div>
              </div>

              {['ayah', 'ibu', 'wali'].map((jenis) => (
                <div key={jenis} className="p-4 border bg-gray-50/50 rounded-xl space-y-4">
                  <h3 className="font-bold text-gray-700 text-sm border-b pb-2 capitalize">Data {jenis}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label><input type="text" name="namaLengkap" value={payload[jenis].namaLengkap || ""} onChange={(e) => handleGroupChange(jenis, e)} className="w-full px-3 py-2 border bg-white rounded text-sm uppercase" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">NIK</label><input type="number" name="nik" value={payload[jenis].nik || ""} onChange={(e) => handleGroupChange(jenis, e)} className="w-full px-3 py-2 border bg-white rounded text-sm" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Status (Hidup/Meninggal)</label><input type="text" name="status" value={payload[jenis].status || ""} onChange={(e) => handleGroupChange(jenis, e)} className="w-full px-3 py-2 border bg-white rounded text-sm" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Tempat, Tgl Lahir</label><div className="flex gap-2"><input type="text" name="tempatLahir" value={payload[jenis].tempatLahir || ""} onChange={(e) => handleGroupChange(jenis, e)} className="w-full px-3 py-2 border bg-white rounded text-sm" /><input type="date" name="tanggalLahir" value={payload[jenis].tanggalLahir || ""} onChange={(e) => handleGroupChange(jenis, e)} className="w-full px-3 py-2 border bg-white rounded text-sm" /></div></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Pendidikan & Pekerjaan</label><div className="flex gap-2"><input type="text" name="pendidikan" value={payload[jenis].pendidikan || ""} onChange={(e) => handleGroupChange(jenis, e)} placeholder="Pendidikan" className="w-full px-3 py-2 border bg-white rounded text-sm" /><input type="text" name="pekerjaan" value={payload[jenis].pekerjaan || ""} onChange={(e) => handleGroupChange(jenis, e)} placeholder="Pekerjaan" className="w-full px-3 py-2 border bg-white rounded text-sm" /></div></div>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">Nomor HP</label><input type="text" name="nomorHp" value={payload[jenis].nomorHp || ""} onChange={(e) => handleGroupChange(jenis, e)} className="w-full px-3 py-2 border bg-white rounded text-sm" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 4: KESEHATAN & KESEJAHTERAAN */}
          {activeTab === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
              {/* Kiri: Kesejahteraan */}
              <div className="space-y-4">
                <div className="pb-2 border-b font-bold text-gray-700">Data Kesejahteraan / Bantuan</div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Rata-Rata Penghasilan (Ortu)</label><input type="text" name="rataRata" value={payload.penghasilan.rataRata || ""} onChange={(e) => handleGroupChange('penghasilan', e)} placeholder="Misal: 2000000" className="w-full px-3 py-2 border rounded text-sm" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Nomor KIP (Kartu Indonesia Pintar)</label><input type="text" name="nomorKip" value={payload.formData.nomorKip || ""} onChange={handleFormChange} className="w-full px-3 py-2 border rounded text-sm" /></div>
                <div><label className="block text-xs font-bold text-gray-500 mb-1">Nomor PKH & KKS</label><div className="flex gap-2"><input type="text" name="nomorPkh" value={payload.penghasilan.nomorPkh || ""} onChange={(e) => handleGroupChange('penghasilan', e)} placeholder="No. PKH" className="w-full px-3 py-2 border rounded text-sm" /><input type="text" name="nomorKks" value={payload.penghasilan.nomorKks || ""} onChange={(e) => handleGroupChange('penghasilan', e)} placeholder="No. KKS" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              </div>

              {/* Kanan: Kesehatan & Disabilitas */}
              <div className="space-y-4">
                <div className="pb-2 border-b font-bold text-gray-700">Kesehatan & Kebutuhan Khusus</div>
                
                <label className="block text-xs font-bold text-gray-500 mb-1">Riwayat Imunisasi Dasar</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {['bcg', 'dpt', 'polio', 'campak', 'hepatitisB', 'covid'].map(v => (
                    <label key={v} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={payload.formData.imunisasi?.[v] || false} onChange={(e) => handleNestedCheckbox('formData', 'imunisasi', v, e.target.checked)} className="w-4 h-4"/> {v.toUpperCase()}</label>
                  ))}
                </div>

                <label className="block text-xs font-bold text-gray-500 mb-1">Disabilitas / Kekhususan</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <label className="flex items-center gap-2 text-sm text-emerald-600 font-bold"><input type="checkbox" checked={payload.disabilitas?.tidakAda || false} onChange={(e) => setPayload({...payload, disabilitas: { ...payload.disabilitas, tidakAda: e.target.checked }})} className="w-4 h-4"/> Tidak Ada (Normal)</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={payload.disabilitas?.tunaNetra || false} onChange={(e) => setPayload({...payload, disabilitas: { ...payload.disabilitas, tunaNetra: e.target.checked }})} className="w-4 h-4"/> Tuna Netra</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={payload.disabilitas?.tunaRungu || false} onChange={(e) => setPayload({...payload, disabilitas: { ...payload.disabilitas, tunaRungu: e.target.checked }})} className="w-4 h-4"/> Tuna Rungu</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={payload.disabilitas?.tunaDaksa || false} onChange={(e) => setPayload({...payload, disabilitas: { ...payload.disabilitas, tunaDaksa: e.target.checked }})} className="w-4 h-4"/> Tuna Daksa</label>
                </div>

                <div><label className="block text-xs font-bold text-gray-500 mb-1">Alat Bantu & Penyesuaian</label><div className="flex gap-2"><input type="text" name="alatBantu" value={payload.kebutuhanDetail.alatBantu || ""} onChange={(e) => handleGroupChange('kebutuhanDetail', e)} placeholder="Contoh: Kacamata" className="w-full px-3 py-2 border rounded text-sm" /><input type="text" name="penyesuaian" value={payload.kebutuhanDetail.penyesuaian || ""} onChange={(e) => handleGroupChange('kebutuhanDetail', e)} placeholder="Penyesuaian KBM" className="w-full px-3 py-2 border rounded text-sm" /></div></div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 5: RIWAYAT AKADEMIK */}
          {activeTab === 5 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* TABEL MUTASI / KENAIKAN KELAS */}
              <div>
                <div className="flex justify-between border-b pb-2 mb-3">
                  <h3 className="font-bold text-gray-700">Aktivitas Belajar / Riwayat Mutasi</h3>
                  <button type="button" onClick={() => addArrayItem('aktivitasList', { ta: "", jenjang: "MA", tingkat: "", rombel: "", status: "Aktif", ket: "" })} className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded">+ Tambah Baris</button>
                </div>
                {payload.aktivitasList.length === 0 ? <p className="text-sm italic text-gray-400">Belum ada riwayat aktivitas.</p> : (
                  <div className="space-y-2">
                    {payload.aktivitasList.map((act: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={act.ta} onChange={(e) => handleArrayChange('aktivitasList', idx, 'ta', e.target.value)} placeholder="Tahun Ajaran" className="w-1/6 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={act.tingkat} onChange={(e) => handleArrayChange('aktivitasList', idx, 'tingkat', e.target.value)} placeholder="Tingkat (10/11/12)" className="w-1/6 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={act.rombel} onChange={(e) => handleArrayChange('aktivitasList', idx, 'rombel', e.target.value)} placeholder="Nama Rombel" className="w-1/5 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={act.status} onChange={(e) => handleArrayChange('aktivitasList', idx, 'status', e.target.value)} placeholder="Status (Naik/Tinggal)" className="w-1/5 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={act.ket} onChange={(e) => handleArrayChange('aktivitasList', idx, 'ket', e.target.value)} placeholder="Ket (Mutasi Masuk/Keluar)" className="w-1/4 px-2 py-1.5 border rounded text-xs" />
                        <button type="button" onClick={() => removeArrayItem('aktivitasList', idx)} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TABEL PRESTASI */}
              <div>
                <div className="flex justify-between border-b pb-2 mb-3">
                  <h3 className="font-bold text-gray-700">Riwayat Prestasi & Penghargaan</h3>
                  <button type="button" onClick={() => addArrayItem('prestasiList', { tahun: "", namaLomba: "", lombaTingkat: "", peringkat: "" })} className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded">+ Tambah Prestasi</button>
                </div>
                {payload.prestasiList.length === 0 ? <p className="text-sm italic text-gray-400">Belum ada catatan prestasi.</p> : (
                  <div className="space-y-2">
                    {payload.prestasiList.map((p: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={p.tahun} onChange={(e) => handleArrayChange('prestasiList', idx, 'tahun', e.target.value)} placeholder="Tahun" className="w-20 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={p.namaLomba} onChange={(e) => handleArrayChange('prestasiList', idx, 'namaLomba', e.target.value)} placeholder="Nama Lomba / Kejuaraan" className="flex-1 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={p.lombaTingkat} onChange={(e) => handleArrayChange('prestasiList', idx, 'lombaTingkat', e.target.value)} placeholder="Tingkat (Kab/Prov/Nas)" className="w-1/4 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={p.peringkat} onChange={(e) => handleArrayChange('prestasiList', idx, 'peringkat', e.target.value)} placeholder="Peringkat (Juara 1)" className="w-1/4 px-2 py-1.5 border rounded text-xs" />
                        <button type="button" onClick={() => removeArrayItem('prestasiList', idx)} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TABEL BEASISWA */}
              <div>
                <div className="flex justify-between border-b pb-2 mb-3">
                  <h3 className="font-bold text-gray-700">Riwayat Penerimaan Beasiswa</h3>
                  <button type="button" onClick={() => addArrayItem('beasiswaList', { tahun: "", namaBantuan: "", namaInstansi: "" })} className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded">+ Tambah Beasiswa</button>
                </div>
                {payload.beasiswaList.length === 0 ? <p className="text-sm italic text-gray-400">Belum ada catatan beasiswa.</p> : (
                  <div className="space-y-2">
                    {payload.beasiswaList.map((b: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input type="text" value={b.tahun} onChange={(e) => handleArrayChange('beasiswaList', idx, 'tahun', e.target.value)} placeholder="Tahun" className="w-24 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={b.namaBantuan} onChange={(e) => handleArrayChange('beasiswaList', idx, 'namaBantuan', e.target.value)} placeholder="Nama Beasiswa / Bantuan" className="flex-1 px-2 py-1.5 border rounded text-xs" />
                        <input type="text" value={b.namaInstansi} onChange={(e) => handleArrayChange('beasiswaList', idx, 'namaInstansi', e.target.value)} placeholder="Penyelenggara / Instansi" className="w-1/3 px-2 py-1.5 border rounded text-xs" />
                        <button type="button" onClick={() => removeArrayItem('beasiswaList', idx)} className="text-red-500 font-bold px-2 hover:bg-red-50 rounded">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ACTION BUTTONS (Selalu Terlihat di Bawah) */}
          <div className="pt-6 border-t border-gray-200 flex justify-end mt-8 sticky bottom-0 bg-white pb-2">
            <button 
              type="submit" disabled={saving} 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? "⏳ Menyimpan Seluruh Data..." : "💾 Simpan & Perbarui Buku Induk"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}