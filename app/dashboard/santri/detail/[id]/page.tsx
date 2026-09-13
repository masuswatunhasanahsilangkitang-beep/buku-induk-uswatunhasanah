"use client";
import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export interface PraSekolah {
  tkRa: boolean;
  paud: boolean;
}

export interface Imunisasi {
  hepatitisB: boolean;
  bcg: boolean;
  dpt: boolean;
  polio: boolean;
  campak: boolean;
  covid: boolean;
}

export interface SantriFormData {
  namaLengkap: string;
  namaPanggilan: string;
  nis: string;
  nisn: string;
  nisLokal: string;
  kewarganegaraan: string;
  nik: string;
  tanggalVerifikasi: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  jumlahSaudara: string;
  anakKe: string;
  agama: string;
  citaCita: string;
  nomorHp: string;
  email: string;
  hobi: string;
  yangMembiayai: string;
  statusKeluarga: string;
  praSekolah: PraSekolah;
  imunisasi: Imunisasi;
  nomorKip: string;
  noKk: string;
  namaKepalaKeluarga: string;
}

export default function EditBukuIndukPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoadingData, setIsLoadingData] = useState(true);

  // ================= STATE JENIS BUKU INDUK =================
  const [jenisBukuInduk, setJenisBukuInduk] = useState<"Madrasah" | "PKPPS">("Madrasah");
  const [activeTab, setActiveTab] = useState("DATA SISWA");

  const listTab = [
    "DATA SISWA",
    "DATA ORANG TUA",
    "DATA ALAMAT",
    "AKTIVITAS BELAJAR",
    "KEBUTUHAN KHUSUS",
    "BEASISWA & BANTUAN",
    "PRESTASI SISWA",
  ];

  // ================= OPSI DROPDOWN =================
  const pendidikanOptions = ["Tidak Sekolah", "SD/MI/Ula/Sederajat", "SMP/MTs/Wustha/Sederajat", "SMA/MA/Ulya/Sederajat", "D1", "D2", "D3", "D4/S1", "S2", "S3", "Lainnya"];
  const pekerjaanOptions = ["Tidak Bekerja", "Ibu Rumah Tangga", "Petani/Peternak", "PNS", "TNI/Polri", "Wiraswasta", "Karyawan Swasta", "Pensiunan", "Guru/Dosen", "Pengacara/Jaksa/Hakim/Notaris", "Seniman/Pelukis/Artis/Sejenis", "Dokter/Bidan/Perawat", "Pilot/Pramugara", "Pedagang", "Nelayan", "Buruh (Tani/Pabrik/Bangunan)", "Sopir/Masinis/Kondektur", "Politikus", "Lainnya"];
  const penghasilanOptions = ["di bawah 800.000", "800.001 - 1.200.000", "1.200.001 - 1.800.000", "1.800.001 - 2.500.000", "2.500.001 - 3.500.000", "3.500.001 - 4.800.000", "4.800.001 - 6.500.000", "6.500.001 - 10.000.000", "10.000.001 - 20.000.000", "di atas 20.000.000"];
  const kebutuhanKhususOptions = ["Tidak Ada", "Tunanetra", "Tunarungu", "Tunagrahita Ringan", "Tunagrahita Sedang", "Tunadaksa Ringan", "Tunadaksa Sedang", "Tunalaras", "Kesulitan Belajar", "Lambat Belajar", "Cerdas Istimewa", "Bakat Istimewa", "Autis", "Indigo", "Lainnya"];

  // ================= STATE TAB 1: DATA SISWA =================
  const [formData, setFormData] = useState<SantriFormData>({
    namaLengkap: "", namaPanggilan: "", nis: "", nisn: "", nisLokal: "", kewarganegaraan: "WNI", nik: "", tanggalVerifikasi: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "Laki-laki", jumlahSaudara: "", anakKe: "", agama: "ISLAM", citaCita: "PNS", nomorHp: "", email: "", hobi: "Olahraga", yangMembiayai: "Orang Tua", statusKeluarga: "Anak Kandung", praSekolah: { tkRa: false, paud: false }, imunisasi: { hepatitisB: false, bcg: false, dpt: false, polio: false, campak: false, covid: false }, nomorKip: "", noKk: "", namaKepalaKeluarga: "",
  });

  const [fileFotoSiswa, setFileFotoSiswa] = useState<string | null>(null);
  const [fileAktaSiswa, setFileAktaSiswa] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= STATE TAB 2: DATA ORANG TUA =================
  const [ayah, setAyah] = useState({ namaLengkap: "", status: "Masih Hidup", kewarganegaraan: "WNI", nik: "", tempatLahir: "", tanggalLahir: "", pendidikan: "SMA/Sederajat", pekerjaan: "Tidak Bekerja", nomorHp: "" });
  const [ibu, setIbu] = useState({ namaLengkap: "", status: "Masih Hidup", kewarganegaraan: "WNI", nik: "", tempatLahir: "", tanggalLahir: "", pendidikan: "SMA/Sederajat", pekerjaan: "Tidak Bekerja", nomorHp: "", kkSamaAyah: false });
  const [waliOption, setWaliOption] = useState("Tidak Memiliki Wali");
  const [wali, setWali] = useState({ namaLengkap: "", kewarganegaraan: "WNI", nik: "", tempatLahir: "", tanggalLahir: "", pendidikan: "SMA/Sederajat", pekerjaan: "Tidak Bekerja", nomorHp: "" });
  const [penghasilan, setPenghasilan] = useState({ rataRata: "di bawah 800.000", nomorKks: "", nomorPkh: "" });
  const [berkasOrangTua, setBerkasOrangTua] = useState({ fileKk: null as string | null, fileKks: null as string | null, filePkh: null as string | null });

  // ================= STATE TAB 3: DATA ALAMAT =================
  const [alamatAyah, setAlamatAyah] = useState({ luarNegeri: false, kepemilikanRumah: "Milik Sendiri", provinsi: "", kabupaten: "", kecamatan: "", kelurahan: "", rt: "", rw: "", alamatLengkap: "", kodePos: "" });
  const [alamatIbu, setAlamatIbu] = useState({ luarNegeri: false, kepemilikanRumah: "Milik Sendiri", provinsi: "", kabupaten: "", kecamatan: "", kelurahan: "", rt: "", rw: "", alamatLengkap: "", kodePos: "" });
  const [alamatWali, setAlamatWali] = useState({ luarNegeri: false, kepemilikanRumah: "Milik Sendiri", provinsi: "", kabupaten: "", kecamatan: "", kelurahan: "", rt: "", rw: "", alamatLengkap: "", kodePos: "" });
  const [alamatSiswa, setAlamatSiswa] = useState({ statusTempatTinggal: "Bersama Orang Tua", provinsi: "", kabupaten: "", kecamatan: "", kelurahan: "", rt: "", rw: "", alamatLengkap: "", koordinat: "", kodePos: "", jarak: "Kurang dari 5 Km", transportasi: "Jalan Kaki", waktuTempuh: "10-19 menit" });

  // ================= STATE TAB 4: AKTIVITAS BELAJAR =================
  const [aktivitasList, setAktivitasList] = useState<any[]>([]);
  const [showAktivitasForm, setShowAktivitasForm] = useState(false);
  const [editAktivitasIndex, setEditAktivitasIndex] = useState<number | null>(null);
  const [aktivitasForm, setAktivitasForm] = useState({ ta: "", tanggal: "", nsm: "", jenjang: "", tingkat: "", jurusan: "", rombel: "", status: "Aktif", ket: "" });

  // ================= STATE TAB 5: KEBUTUHAN KHUSUS =================
  const [kebutuhanDetail, setKebutuhanDetail] = useState({ kesulitan: "", alatBantu: "", pendampingan: "", penyesuaian: "" });
  const [kebutuhanKhusus, setKebutuhanKhusus] = useState("Tidak Ada");
  const [disabilitas, setDisabilitas] = useState({ tidakAda: true, tunaNetra: false, tunaRungu: false, tunaDaksa: false, tunaGrahita: false, tunaLaras: false, lainnya: false, tunaWicara: false });

  // ================= STATE TAB 6: BEASISWA & BANTUAN =================
  const [beasiswaList, setBeasiswaList] = useState<any[]>([]);
  const [showBeasiswaForm, setShowBeasiswaForm] = useState(false);
  const [editBeasiswaIndex, setEditBeasiswaIndex] = useState<number | null>(null);
  const [beasiswaForm, setBeasiswaForm] = useState({ tahun: "", kategori: "", namaBantuan: "", namaInstansi: "", jenisInstansi: "", jangkaWaktu: "", nominal: "" });

  // ================= STATE TAB 7: PRESTASI SISWA =================
  const [prestasiList, setPrestasiList] = useState<any[]>([]);
  const [showPrestasiForm, setShowPrestasiForm] = useState(false);
  const [editPrestasiIndex, setEditPrestasiIndex] = useState<number | null>(null);
  const [prestasiForm, setPrestasiForm] = useState({ tahun: "", namaLomba: "", bidangLomba: "", namaPenyelenggara: "", lombaTingkat: "", peringkat: "" });

  // ================= PENGAMBILAN DATA LAMA (GET DATA FROM DB) =================
  useEffect(() => {
    if (!id) return;
    async function loadDataSantri() {
      try {
        const res = await fetch(`/api/santri?id=${id}`);
        const json = await res.json();
        
        if (json.success && json.data) {
          const d = json.data;
          
          setJenisBukuInduk(d.jenisBukuInduk as "Madrasah" | "PKPPS" || "Madrasah");

          setFormData({
            namaLengkap: d.namaLengkap || "",
            namaPanggilan: d.namaPanggilan || "",
            nis: d.nis || "",
            nisn: d.nisn || "",
            nisLokal: d.nisLokal || "",
            kewarganegaraan: d.kewarganegaraan || "WNI",
            nik: d.nik || "",
            tanggalVerifikasi: d.tanggalVerifikasi || "",
            tempatLahir: d.tempatLahir || "",
            tanggalLahir: d.tanggalLahir || "",
            jenisKelamin: d.jenisKelamin || "Laki-laki",
            jumlahSaudara: d.jumlahSaudara || "",
            anakKe: d.anakKe || "",
            agama: d.agama || "ISLAM",
            citaCita: d.citaCita || "",
            nomorHp: d.nomorHp || "",
            email: d.email || "",
            hobi: d.hobi || "",
            yangMembiayai: d.yangMembiayai || "",
            statusKeluarga: d.statusKeluarga || "",
            praSekolah: { tkRa: d.praTkRa || false, paud: d.praPaud || false },
            imunisasi: { hepatitisB: d.imunHepatitisB || false, bcg: d.imunBcg || false, dpt: d.imunDpt || false, polio: d.imunPolio || false, campak: d.imunCampak || false, covid: d.imunCovid || false },
            nomorKip: d.nomorKip || "",
            noKk: d.noKk || "",
            namaKepalaKeluarga: d.namaKepalaKeluarga || "",
          });

          if (d.orangTua && Array.isArray(d.orangTua)) {
            const a = d.orangTua.find((o:any) => o.jenis === "Ayah");
            if (a) setAyah({ namaLengkap: a.namaLengkap||"", status: a.status||"Masih Hidup", kewarganegaraan: a.kewarganegaraan||"WNI", nik: a.nik||"", tempatLahir: a.tempatLahir||"", tanggalLahir: a.tanggalLahir||"", pendidikan: a.pendidikan||"SMA/Sederajat", pekerjaan: a.pekerjaan||"Tidak Bekerja", nomorHp: a.nomorHp||"" });
            
            const i = d.orangTua.find((o:any) => o.jenis === "Ibu");
            if (i) setIbu({ namaLengkap: i.namaLengkap||"", status: i.status||"Masih Hidup", kewarganegaraan: i.kewarganegaraan||"WNI", nik: i.nik||"", tempatLahir: i.tempatLahir||"", tanggalLahir: i.tanggalLahir||"", pendidikan: i.pendidikan||"SMA/Sederajat", pekerjaan: i.pekerjaan||"Tidak Bekerja", nomorHp: i.nomorHp||"", kkSamaAyah: i.kkSamaAyah||false });

            const w = d.orangTua.find((o:any) => o.jenis === "Wali");
            if (w && w.namaLengkap) {
              setWaliOption("Lainnya");
              setWali({ namaLengkap: w.namaLengkap||"", kewarganegaraan: w.kewarganegaraan||"WNI", nik: w.nik||"", tempatLahir: w.tempatLahir||"", tanggalLahir: w.tanggalLahir||"", pendidikan: w.pendidikan||"SMA/Sederajat", pekerjaan: w.pekerjaan||"Tidak Bekerja", nomorHp: w.nomorHp||"" });
            }
          }

          if (d.penghasilanKeluarga) {
            setPenghasilan({ rataRata: d.penghasilanKeluarga.rataRata||"di bawah 800.000", nomorKks: d.penghasilanKeluarga.nomorKks||"", nomorPkh: d.penghasilanKeluarga.nomorPkh||"" });
          }

          if (d.alamat && Array.isArray(d.alamat)) {
            const aa = d.alamat.find((a:any) => a.jenisAlamat === "Ayah");
            if (aa) setAlamatAyah({ luarNegeri: aa.luarNegeri||false, kepemilikanRumah: aa.kepemilikanRumah||"Milik Sendiri", provinsi: aa.provinsi||"", kabupaten: aa.kabupaten||"", kecamatan: aa.kecamatan||"", kelurahan: aa.kelurahan||"", rt: aa.rt||"", rw: aa.rw||"", alamatLengkap: aa.alamatLengkap||"", kodePos: aa.kodePos||"" });
            
            const ai = d.alamat.find((a:any) => a.jenisAlamat === "Ibu");
            if (ai) setAlamatIbu({ luarNegeri: ai.luarNegeri||false, kepemilikanRumah: ai.kepemilikanRumah||"Milik Sendiri", provinsi: ai.provinsi||"", kabupaten: ai.kabupaten||"", kecamatan: ai.kecamatan||"", kelurahan: ai.kelurahan||"", rt: ai.rt||"", rw: ai.rw||"", alamatLengkap: ai.alamatLengkap||"", kodePos: ai.kodePos||"" });

            const aw = d.alamat.find((a:any) => a.jenisAlamat === "Wali");
            if (aw) setAlamatWali({ luarNegeri: aw.luarNegeri||false, kepemilikanRumah: aw.kepemilikanRumah||"Milik Sendiri", provinsi: aw.provinsi||"", kabupaten: aw.kabupaten||"", kecamatan: aw.kecamatan||"", kelurahan: aw.kelurahan||"", rt: aw.rt||"", rw: aw.rw||"", alamatLengkap: aw.alamatLengkap||"", kodePos: aw.kodePos||"" });

            const as = d.alamat.find((a:any) => a.jenisAlamat === "Siswa");
            if (as) setAlamatSiswa({ statusTempatTinggal: as.statusTempatTinggal||"Bersama Orang Tua", provinsi: as.provinsi||"", kabupaten: as.kabupaten||"", kecamatan: as.kecamatan||"", kelurahan: as.kelurahan||"", rt: as.rt||"", rw: as.rw||"", alamatLengkap: as.alamatLengkap||"", koordinat: as.koordinat||"", kodePos: as.kodePos||"", jarak: as.jarak||"Kurang dari 5 Km", transportasi: as.transportasi||"Jalan Kaki", waktuTempuh: as.waktuTempuh||"10-19 menit" });
          }

          if (d.kebutuhanKhusus) {
            setKebutuhanKhusus(d.kebutuhanKhusus.kategoriKhusus || "Tidak Ada");
            setKebutuhanDetail({ kesulitan: d.kebutuhanKhusus.kesulitan||"", alatBantu: d.kebutuhanKhusus.alatBantu||"", pendampingan: d.kebutuhanKhusus.pendampingan||"", penyesuaian: d.kebutuhanKhusus.penyesuaian||"" });
            setDisabilitas({ tidakAda: d.kebutuhanKhusus.disTidakAda??true, tunaNetra: d.kebutuhanKhusus.disTunaNetra||false, tunaRungu: d.kebutuhanKhusus.disTunaRungu||false, tunaDaksa: d.kebutuhanKhusus.disTunaDaksa||false, tunaGrahita: d.kebutuhanKhusus.disTunaGrahita||false, tunaLaras: d.kebutuhanKhusus.disTunaLaras||false, lainnya: d.kebutuhanKhusus.disLainnya||false, tunaWicara: d.kebutuhanKhusus.disTunaWicara||false });
          }

          if (d.aktivitasBelajar) setAktivitasList(d.aktivitasBelajar);
          if (d.beasiswa) setBeasiswaList(d.beasiswa);
          if (d.prestasi) setPrestasiList(d.prestasi);

          setIsLoadingData(false);
        }
      } catch (error) {
        console.error("Gagal menarik data santri:", error);
        setIsLoadingData(false);
      }
    }
    loadDataSantri();
  }, [id]);

  // ================= SINKRONISASI DATA ORTU/WALI & ALAMAT =================
  useEffect(() => {
    if (waliOption === "Sama dengan ayah kandung") setWali({ ...ayah });
    else if (waliOption === "Sama dengan ibu kandung") setWali({ ...ibu });
    else if (waliOption === "Lainnya") setWali({ namaLengkap: "", kewarganegaraan: "WNI", nik: "", tempatLahir: "", tanggalLahir: "", pendidikan: "D4/S1", pekerjaan: "Tidak Bekerja", nomorHp: "" });
  }, [waliOption, ayah, ibu]);

  useEffect(() => {
    if (ibu.kkSamaAyah) setAlamatIbu({ ...alamatAyah });
  }, [alamatAyah, ibu.kkSamaAyah]);

  useEffect(() => {
    if (waliOption === "Sama dengan ayah kandung") setAlamatWali({ ...alamatAyah });
    else if (waliOption === "Sama dengan ibu kandung") setAlamatWali({ ...alamatIbu });
  }, [alamatAyah, alamatIbu, waliOption]);

  // ================= HANDLERS (VALIDATION & API INTEGRATION - MENGGUNAKAN PUT) =================
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.namaLengkap.trim()) errors.namaLengkap = "Nama Lengkap wajib diisi";
    if (!formData.nisn.trim()) errors.nisn = "NISN wajib diisi";
    if (!formData.nik.trim()) errors.nik = "NIK wajib diisi";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === "DATA SISWA" && !validateForm()) {
      alert("Mohon lengkapi field yang wajib diisi (berwarna merah) pada Data Siswa");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload = {
        id, // Wajib disertakan untuk metode PUT
        jenisBukuInduk, formData, ayah, ibu, wali, penghasilan,
        alamatAyah, alamatIbu, alamatWali, alamatSiswa,
        aktivitasList, kebutuhanDetail, kebutuhanKhusus, disabilitas, beasiswaList, prestasiList
      };

      const response = await fetch("/api/santri", {
        method: "PUT", // Berubah dari POST menjadi PUT
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });

      const textResult = await response.text();
      let result;
      
      try {
        result = JSON.parse(textResult);
      } catch (parseError) {
        console.error("===== HTML ERROR LOG =====", textResult);
        alert(`Server Gagal Memproses Data (Error 500)!\n\nPESAN WAJIB DIBACA:\nBuka Terminal VS Code tempat Anda menjalankan project ini. Scroll ke bawah dan cari pesan "=== API Error - Simpan Santri ===" untuk mengetahui field apa yang ditolak oleh Prisma Schema Anda.`);
        setIsSubmitting(false);
        return;
      }

      if (response.ok && result.success) {
        alert(`Sukses! Data perubahan ${activeTab} berhasil diperbarui.`);
        router.push("/dashboard/santri"); // Kembali ke tabel daftar siswa
      } else {
        alert(`GAGAL MEMPERBARUI!\n\nPenyebab:\n${result.errorDetail || result.message}`);
      }
    } catch (error) {
      alert("Koneksi terputus. Pastikan server Next.js sedang menyala (npm run dev).");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= HANDLERS UNGGAH & DISABILITAS =================
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, fieldKey: "fileKk" | "fileKks" | "filePkh") => {
    const file = e.target.files?.[0];
    if (file) setBerkasOrangTua({ ...berkasOrangTua, [fieldKey]: file.name });
  };
  const handleFotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileFotoSiswa(URL.createObjectURL(file));
  };
  const handleAktaUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileAktaSiswa(file.name);
  };
  const handleDisabilitasChange = (key: keyof typeof disabilitas) => {
    if (key === "tidakAda") setDisabilitas({ tidakAda: true, tunaNetra: false, tunaRungu: false, tunaDaksa: false, tunaGrahita: false, tunaLaras: false, lainnya: false, tunaWicara: false });
    else setDisabilitas({ ...disabilitas, tidakAda: false, [key]: !disabilitas[key] });
  };

  // ================= HANDLERS AKTIVITAS =================
  const handleAddAktivitas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aktivitasForm.ta || !aktivitasForm.nsm) { alert("Mohon lengkapi data Tahun Ajaran dan NSM"); return; }
    if (editAktivitasIndex !== null) {
      const updatedList = [...aktivitasList];
      updatedList[editAktivitasIndex] = aktivitasForm;
      setAktivitasList(updatedList);
    } else { setAktivitasList([...aktivitasList, aktivitasForm]); }
    setShowAktivitasForm(false); setEditAktivitasIndex(null);
    setAktivitasForm({ ta: "", tanggal: "", nsm: "", jenjang: "", tingkat: "", jurusan: "", rombel: "", status: "Aktif", ket: "" });
  };
  const openEditAktivitas = (index: number) => { setAktivitasForm(aktivitasList[index]); setEditAktivitasIndex(index); setShowAktivitasForm(true); };
  const deleteAktivitas = (index: number) => { if(window.confirm("Hapus data Aktivitas Belajar ini?")) setAktivitasList(aktivitasList.filter((_, i) => i !== index)); };

  // ================= HANDLERS BEASISWA =================
  const handleAddBeasiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beasiswaForm.tahun || !beasiswaForm.namaBantuan) { alert("Mohon lengkapi data beasiswa (Tahun dan Nama Bantuan wajib diisi)"); return; }
    if (editBeasiswaIndex !== null) {
      const updatedList = [...beasiswaList];
      updatedList[editBeasiswaIndex] = beasiswaForm;
      setBeasiswaList(updatedList);
    } else { setBeasiswaList([...beasiswaList, beasiswaForm]); }
    setShowBeasiswaForm(false); setEditBeasiswaIndex(null);
    setBeasiswaForm({ tahun: "", kategori: "", namaBantuan: "", namaInstansi: "", jenisInstansi: "", jangkaWaktu: "", nominal: "" });
  };
  const openEditBeasiswa = (index: number) => { setBeasiswaForm(beasiswaList[index]); setEditBeasiswaIndex(index); setShowBeasiswaForm(true); };
  const deleteBeasiswa = (index: number) => { if(window.confirm("Hapus data Beasiswa ini?")) setBeasiswaList(beasiswaList.filter((_, i) => i !== index)); };

  // ================= HANDLERS PRESTASI =================
  const handleAddPrestasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestasiForm.tahun || !prestasiForm.namaLomba) { alert("Mohon lengkapi data prestasi (Tahun dan Nama Lomba wajib diisi)"); return; }
    if (editPrestasiIndex !== null) {
      const updatedList = [...prestasiList];
      updatedList[editPrestasiIndex] = prestasiForm;
      setPrestasiList(updatedList);
    } else { setPrestasiList([...prestasiList, prestasiForm]); }
    setShowPrestasiForm(false); setEditPrestasiIndex(null);
    setPrestasiForm({ tahun: "", namaLomba: "", bidangLomba: "", namaPenyelenggara: "", lombaTingkat: "", peringkat: "" });
  };
  const openEditPrestasi = (index: number) => { setPrestasiForm(prestasiList[index]); setEditPrestasiIndex(index); setShowPrestasiForm(true); };
  const deletePrestasi = (index: number) => { if(window.confirm("Hapus data Prestasi ini?")) setPrestasiList(prestasiList.filter((_, i) => i !== index)); };

  const isWaliDisabled = waliOption === "Sama dengan ayah kandung" || waliOption === "Sama dengan ibu kandung" || waliOption === "Tidak Memiliki Wali";

  // ANIMASI LOADING SAAT MENGAMBIL DATA DARI DB
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-bold text-sm tracking-widest uppercase">Menyiapkan Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6 text-gray-800 relative">
      
      {/* ================= MODAL TAMBAH/EDIT AKTIVITAS ================= */}
      {showAktivitasForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">{editAktivitasIndex !== null ? 'Edit' : 'Tambah'} Aktivitas Belajar</h3>
              <button onClick={() => { setShowAktivitasForm(false); setEditAktivitasIndex(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">TAHUN AJARAN - SEMESTER</label>
                <input type="text" value={aktivitasForm.ta} onChange={(e) => setAktivitasForm({...aktivitasForm, ta: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="2024/2025 - Ganjil" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">TANGGAL MULAI MASUK</label>
                <input type="date" value={aktivitasForm.tanggal} onChange={(e) => setAktivitasForm({...aktivitasForm, tanggal: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-600">NSM - NAMA LEMBAGA</label>
                <input type="text" value={aktivitasForm.nsm} onChange={(e) => setAktivitasForm({...aktivitasForm, nsm: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="1312... - MAS PP..." />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">JENJANG</label>
                <input type="text" value={aktivitasForm.jenjang} onChange={(e) => setAktivitasForm({...aktivitasForm, jenjang: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="MA / MTs / MI" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">TINGKAT / KELOMPOK</label>
                <input type="text" value={aktivitasForm.tingkat} onChange={(e) => setAktivitasForm({...aktivitasForm, tingkat: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Kelas 10" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">JURUSAN</label>
                <input type="text" value={aktivitasForm.jurusan} onChange={(e) => setAktivitasForm({...aktivitasForm, jurusan: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="IPA / IPS / Umum" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">ROMBEL</label>
                <input type="text" value={aktivitasForm.rombel} onChange={(e) => setAktivitasForm({...aktivitasForm, rombel: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Kelas X-A" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">STATUS KEAKTIFAN</label>
                <select value={aktivitasForm.status} onChange={(e) => setAktivitasForm({...aktivitasForm, status: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500 bg-white">
                  <option value="Aktif">Aktif</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">KETERANGAN</label>
                <input type="text" value={aktivitasForm.ket} onChange={(e) => setAktivitasForm({...aktivitasForm, ket: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Naik dari kelas sebelumnya" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button type="button" onClick={() => { setShowAktivitasForm(false); setEditAktivitasIndex(null); }} className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">Batal</button>
              <button type="button" onClick={handleAddAktivitas} className="px-4 py-2 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600 transition-colors">{editAktivitasIndex !== null ? 'Simpan Perubahan' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH/EDIT BEASISWA ================= */}
      {showBeasiswaForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">{editBeasiswaIndex !== null ? 'Edit' : 'Tambah'} Beasiswa & Bantuan</h3>
              <button onClick={() => { setShowBeasiswaForm(false); setEditBeasiswaIndex(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">TAHUN</label>
                <input type="text" value={beasiswaForm.tahun} onChange={(e) => setBeasiswaForm({...beasiswaForm, tahun: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Misal: 2024" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">KATEGORI</label>
                <input type="text" value={beasiswaForm.kategori} onChange={(e) => setBeasiswaForm({...beasiswaForm, kategori: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Kategori Bantuan" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">NAMA BEASISWA / BANTUAN</label>
                <input type="text" value={beasiswaForm.namaBantuan} onChange={(e) => setBeasiswaForm({...beasiswaForm, namaBantuan: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Nama Program" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">NAMA INSTANSI PEMBERI</label>
                <input type="text" value={beasiswaForm.namaInstansi} onChange={(e) => setBeasiswaForm({...beasiswaForm, namaInstansi: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Nama Instansi" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">JENIS INSTANSI PEMBERI</label>
                <input type="text" value={beasiswaForm.jenisInstansi} onChange={(e) => setBeasiswaForm({...beasiswaForm, jenisInstansi: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Swasta / Pemerintah / dll" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">JANGKA WAKTU</label>
                <input type="text" value={beasiswaForm.jangkaWaktu} onChange={(e) => setBeasiswaForm({...beasiswaForm, jangkaWaktu: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="1 Tahun / 6 Bulan" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">NOMINAL BEASISWA</label>
                <input type="text" value={beasiswaForm.nominal} onChange={(e) => setBeasiswaForm({...beasiswaForm, nominal: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Rp 0" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button type="button" onClick={() => { setShowBeasiswaForm(false); setEditBeasiswaIndex(null); }} className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">Batal</button>
              <button type="button" onClick={handleAddBeasiswa} className="px-4 py-2 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600 transition-colors">{editBeasiswaIndex !== null ? 'Simpan Perubahan' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH/EDIT PRESTASI ================= */}
      {showPrestasiForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">{editPrestasiIndex !== null ? 'Edit' : 'Tambah'} Prestasi Siswa</h3>
              <button onClick={() => { setShowPrestasiForm(false); setEditPrestasiIndex(null); }} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">TAHUN</label>
                <input type="text" value={prestasiForm.tahun} onChange={(e) => setPrestasiForm({...prestasiForm, tahun: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Misal: 2024" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">NAMA LOMBA</label>
                <input type="text" value={prestasiForm.namaLomba} onChange={(e) => setPrestasiForm({...prestasiForm, namaLomba: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Nama Kejuaraan/Lomba" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">BIDANG LOMBA</label>
                <input type="text" value={prestasiForm.bidangLomba} onChange={(e) => setPrestasiForm({...prestasiForm, bidangLomba: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Akademik / Olahraga / Seni" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">NAMA PENYELENGGARA</label>
                <input type="text" value={prestasiForm.namaPenyelenggara} onChange={(e) => setPrestasiForm({...prestasiForm, namaPenyelenggara: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Instansi Penyelenggara" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">LOMBA TINGKAT</label>
                <input type="text" value={prestasiForm.lombaTingkat} onChange={(e) => setPrestasiForm({...prestasiForm, lombaTingkat: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Kabupaten / Provinsi / Nasional" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">PERINGKAT YANG DIRAIH</label>
                <input type="text" value={prestasiForm.peringkat} onChange={(e) => setPrestasiForm({...prestasiForm, peringkat: e.target.value})} className="w-full px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500" placeholder="Juara 1 / Emas / dll" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <button type="button" onClick={() => { setShowPrestasiForm(false); setEditPrestasiIndex(null); }} className="px-4 py-2 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors">Batal</button>
              <button type="button" onClick={handleAddPrestasi} className="px-4 py-2 text-xs font-bold text-white bg-green-500 rounded hover:bg-green-600 transition-colors">{editPrestasiIndex !== null ? 'Simpan Perubahan' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HEADER PILIHAN JENJANG BUKU INDUK ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-gray-200 p-1.5 rounded-lg w-max shadow-inner">
          <button
            onClick={() => setJenisBukuInduk("Madrasah")}
            className={`px-6 py-2 text-xs font-bold rounded-md transition-all ${
              jenisBukuInduk === "Madrasah" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            BUKU INDUK MADRASAH (MI/MTs/MA)
          </button>
          <button
            onClick={() => setJenisBukuInduk("PKPPS")}
            className={`px-6 py-2 text-xs font-bold rounded-md transition-all ${
              jenisBukuInduk === "PKPPS" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            BUKU INDUK PKPPS (Ula/Wustha/Ulya)
          </button>
        </div>
      </div>

      {/* Top Header Information */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <nav className="text-xs text-gray-400 space-x-1 mb-1">
            <span>Siswa</span> <span>&gt;</span> <span>Daftar Siswa</span> <span>&gt;</span>{" "}
            <span className="font-semibold text-gray-600">Edit Data Siswa</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">
            Perbarui Data <span className="uppercase text-amber-500">{formData.namaLengkap}</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`text-xs font-semibold px-4 py-2 rounded-full ${jenisBukuInduk === 'Madrasah' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
            Tahun Ajaran: <span className="font-bold">2026/2027 - Ganjil</span>
          </div>
          <Link href="/dashboard/santri" className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Navigasi Tab */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-2 scrollbar-none">
        {listTab.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab
                ? jenisBukuInduk === 'Madrasah' ? "bg-blue-500 text-white shadow-sm" : "bg-emerald-600 text-white shadow-sm"
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DATA SISWA                                         */}
      {/* ========================================================= */}
      {activeTab === "DATA SISWA" && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b pb-6">
            <div className="md:col-span-2 flex flex-col items-center gap-2">
              <label htmlFor="foto-input" className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 overflow-hidden cursor-pointer hover:bg-gray-200 transition relative group">
                {fileFotoSiswa ? (
                  <img src={fileFotoSiswa} alt="Foto Siswa" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[10px] text-gray-500 font-medium">Upload Pasfoto</span>
                  </div>
                )}
              </label>
              <input id="foto-input" type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} />
            </div>

            <div className="md:col-span-10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <label className={`absolute -top-2.5 left-3 px-1 text-[10px] font-bold tracking-wider ${formErrors.namaLengkap ? 'text-red-500 bg-white' : 'text-gray-400 bg-white'}`}>NAMA LENGKAP *</label>
                  <input type="text" value={formData.namaLengkap} onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })} className={`w-full px-4 py-3 rounded-md text-sm font-semibold text-gray-800 focus:outline-none uppercase border ${formErrors.namaLengkap ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
                  {formErrors.namaLengkap && <p className="text-red-500 text-[10px] mt-1 absolute -bottom-4 left-1">{formErrors.namaLengkap}</p>}
                </div>
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA PANGGILAN</label>
                  <input type="text" value={formData.namaPanggilan} onChange={(e) => setFormData({ ...formData, namaPanggilan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="relative mt-2">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NIS (NO INDUK SISWA)</label>
                  <input type="text" value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none" />
                </div>
                <div className="relative mt-2">
                  <label className={`absolute -top-2.5 left-3 px-1 text-[10px] font-bold tracking-wider ${formErrors.nisn ? 'text-red-500 bg-white' : 'text-gray-400 bg-white'}`}>NISN *</label>
                  <input type="text" value={formData.nisn} onChange={(e) => setFormData({ ...formData, nisn: e.target.value })} className={`w-full px-4 py-3 rounded-md text-sm font-semibold text-gray-800 focus:outline-none border ${formErrors.nisn ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
                  {formErrors.nisn && <p className="text-red-500 text-[10px] mt-1 absolute -bottom-4 left-1">{formErrors.nisn}</p>}
                </div>
                <div className="relative mt-2">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NIS LOKAL</label>
                  <input type="text" value={formData.nisLokal} onChange={(e) => setFormData({ ...formData, nisLokal: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KEWARGANEGARAAN</label>
              <select value={formData.kewarganegaraan} onChange={(e) => setFormData({ ...formData, kewarganegaraan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </div>
            <div className="relative">
              <label className={`absolute -top-2.5 left-3 px-1 text-[10px] font-bold tracking-wider ${formErrors.nik ? 'text-red-500 bg-white' : 'text-gray-400 bg-white'}`}>NIK SISWA *</label>
              <input type="text" value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} className={`w-full px-4 py-3 rounded-md text-sm font-medium text-gray-800 focus:outline-none border ${formErrors.nik ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`} />
              {formErrors.nik && <p className="text-red-500 text-[10px] mt-1 absolute -bottom-4 left-1">{formErrors.nik}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TEMPAT LAHIR</label>
              <input type="text" value={formData.tempatLahir} onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL LAHIR</label>
              <input type="date" value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none bg-white" />
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL VERIFIKASI</label>
              <input type="date" value={formData.tanggalVerifikasi} onChange={(e) => setFormData({ ...formData, tanggalVerifikasi: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 tracking-wider block uppercase">JENIS KELAMIN</label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="jk" value="Laki-laki" checked={formData.jenisKelamin === "Laki-laki"} onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="jk" value="Perempuan" checked={formData.jenisKelamin === "Perempuan"} onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">JUMLAH SAUDARA</label>
              <input type="number" value={formData.jumlahSaudara} onChange={(e) => setFormData({ ...formData, jumlahSaudara: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">ANAK KE</label>
              <input type="number" value={formData.anakKe} onChange={(e) => setFormData({ ...formData, anakKe: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">AGAMA</label>
              <select value={formData.agama} onChange={(e) => setFormData({ ...formData, agama: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none uppercase">
                <option value="ISLAM">ISLAM</option>
                <option value="KRISTEN">KRISTEN</option>
                <option value="KATOLIK">KATOLIK</option>
                <option value="HINDU">HINDU</option>
                <option value="BUDDHA">BUDDHA</option>
                <option value="KONGHUCU">KONGHUCU</option>
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">CITA-CITA</label>
              <select value={formData.citaCita} onChange={(e) => setFormData({ ...formData, citaCita: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="PNS">PNS</option>
                <option value="TNI/Polri">TNI/Polri</option>
                <option value="Guru/Dosen">Guru/Dosen</option>
                <option value="Dokter">Dokter</option>
                <option value="Politikus">Politikus</option>
                <option value="Seniman/Artis">Seniman/Artis</option>
                <option value="Ilmuwan">Ilmuwan</option>
                <option value="Agamawan">Agamawan</option>
                <option value="Wiraswasta">Wiraswasta</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">HOBI</label>
              <select value={formData.hobi} onChange={(e) => setFormData({ ...formData, hobi: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="Olahraga">Olahraga</option>
                <option value="Membaca">Membaca</option>
                <option value="Menulis">Menulis</option>
                <option value="Jalan-jalan">Jalan-jalan</option>
                <option value="Kesenian">Kesenian</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR HANDPHONE SISWA</label>
              <input type="text" value={formData.nomorHp} onChange={(e) => setFormData({ ...formData, nomorHp: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">EMAIL SISWA</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">YANG MEMBIAYAI SEKOLAH</label>
              <select value={formData.yangMembiayai} onChange={(e) => setFormData({ ...formData, yangMembiayai: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="Orang Tua">Orang Tua</option>
                <option value="Wali">Wali</option>
                <option value="Beasiswa">Beasiswa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS KELUARGA</label>
              <select value={formData.statusKeluarga} onChange={(e) => setFormData({ ...formData, statusKeluarga: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="Anak Kandung">Anak Kandung</option>
                <option value="Anak Tiri">Anak Tiri</option>
                <option value="Anak Angkat">Anak Angkat</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="text-xs font-bold text-gray-600 tracking-wider block uppercase">PRA SEKOLAH</label>
            <div className="flex gap-6">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={formData.praSekolah.tkRa} onChange={(e) => setFormData({ ...formData, praSekolah: { ...formData.praSekolah, tkRa: e.target.checked } }) } className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span>Pernah TK / RA</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={formData.praSekolah.paud} onChange={(e) => setFormData({ ...formData, praSekolah: { ...formData.praSekolah, paud: e.target.checked } }) } className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span>Pernah PAUD</span>
              </label>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="text-xs font-bold text-gray-600 tracking-wider block uppercase">RIWAYAT IMUNISASI</label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { key: "hepatitisB", label: "Hepatitis B" },
                { key: "bcg", label: "BCG" },
                { key: "dpt", label: "DPT" },
                { key: "polio", label: "Polio" },
                { key: "campak", label: "Campak" },
                { key: "covid", label: "COVID-19" },
              ].map((item) => (
                <label key={item.key} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={formData.imunisasi[item.key as keyof Imunisasi]} onChange={(e) => setFormData({ ...formData, imunisasi: { ...formData.imunisasi, [item.key]: e.target.checked } }) } className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <label className="text-xs font-bold text-gray-600 tracking-wider block uppercase">KARTU KELUARGA & KIP</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR KARTU KELUARGA (KK)</label>
                <input type="text" value={formData.noKk} onChange={(e) => setFormData({ ...formData, noKk: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA KEPALA KELUARGA</label>
                <input type="text" value={formData.namaKepalaKeluarga} onChange={(e) => setFormData({ ...formData, namaKepalaKeluarga: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR KIP (BILA ADA)</label>
                <input type="text" value={formData.nomorKip} onChange={(e) => setFormData({ ...formData, nomorKip: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-2 bg-gray-50 text-center">
              <span className="text-red-500 font-bold text-xs">📄 Kartu Keluarga (PDF/IMG)</span>
              <label className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 text-xs font-semibold cursor-pointer hover:bg-blue-100 transition">
                Unggah Berkas KK <input type="file" accept=".pdf,image/*" className="hidden" />
              </label>
            </div>
            <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-2 bg-gray-50 text-center">
              <span className="text-blue-500 font-bold text-xs">📄 Kartu KIP (Opsional)</span>
              <label className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 text-xs font-semibold cursor-pointer hover:bg-blue-100 transition">
                Unggah Berkas KIP <input type="file" accept=".pdf,image/*" className="hidden" />
              </label>
            </div>
            <div className="p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-2 bg-gray-50 text-center">
              <span className="text-green-500 font-bold text-xs">📄 Akta Kelahiran</span>
              <label className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 text-xs font-semibold cursor-pointer hover:bg-blue-100 transition">
                Unggah Akta <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleAktaUpload} />
              </label>
              {fileAktaSiswa && <span className="text-[10px] text-gray-500 font-medium truncate max-w-full">{fileAktaSiswa}</span>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={() => router.push("/dashboard/santri")} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Batal</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-colors flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Memperbarui...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Perbarui Data Siswa
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DATA ORANG TUA                                     */}
      {/* ========================================================= */}
      {activeTab === "DATA ORANG TUA" && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
          {/* AYAH KANDUNG */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">AYAH KANDUNG</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA LENGKAP</label>
                <input type="text" value={ayah.namaLengkap} onChange={(e) => setAyah({ ...ayah, namaLengkap: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS</label>
                <select value={ayah.status} onChange={(e) => setAyah({ ...ayah, status: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal">Meninggal</option>
                  <option value="Tidak Diketahui">Tidak Diketahui</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KEWARGANEGARAAN</label>
                <select value={ayah.kewarganegaraan} onChange={(e) => setAyah({ ...ayah, kewarganegaraan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="WNI">WNI</option>
                  <option value="WNA">WNA</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NIK</label>
                <input type="text" value={ayah.nik} onChange={(e) => setAyah({ ...ayah, nik: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TEMPAT LAHIR</label>
                <input type="text" value={ayah.tempatLahir} onChange={(e) => setAyah({ ...ayah, tempatLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL LAHIR</label>
                <input type="date" value={ayah.tanggalLahir} onChange={(e) => setAyah({ ...ayah, tanggalLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none bg-white" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">PENDIDIKAN TERAKHIR</label>
                <select value={ayah.pendidikan} onChange={(e) => setAyah({ ...ayah, pendidikan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  {pendidikanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">PEKERJAAN UTAMA</label>
                <select value={ayah.pekerjaan} onChange={(e) => setAyah({ ...ayah, pekerjaan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  {pekerjaanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR HANDPHONE</label>
                <input type="text" value={ayah.nomorHp} onChange={(e) => setAyah({ ...ayah, nomorHp: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* IBU KANDUNG */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">IBU KANDUNG</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA LENGKAP</label>
                <input type="text" value={ibu.namaLengkap} onChange={(e) => setIbu({ ...ibu, namaLengkap: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS</label>
                <select value={ibu.status} onChange={(e) => setIbu({ ...ibu, status: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Masih Hidup">Masih Hidup</option>
                  <option value="Meninggal">Meninggal</option>
                  <option value="Tidak Diketahui">Tidak Diketahui</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KEWARGANEGARAAN</label>
                <select value={ibu.kewarganegaraan} onChange={(e) => setIbu({ ...ibu, kewarganegaraan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="WNI">WNI</option>
                  <option value="WNA">WNA</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NIK</label>
                <input type="text" value={ibu.nik} onChange={(e) => setIbu({ ...ibu, nik: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TEMPAT LAHIR</label>
                <input type="text" value={ibu.tempatLahir} onChange={(e) => setIbu({ ...ibu, tempatLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none uppercase" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL LAHIR</label>
                <input type="date" value={ibu.tanggalLahir} onChange={(e) => setIbu({ ...ibu, tanggalLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none bg-white" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">PENDIDIKAN TERAKHIR</label>
                <select value={ibu.pendidikan} onChange={(e) => setIbu({ ...ibu, pendidikan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  {pendidikanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">PEKERJAAN UTAMA</label>
                <select value={ibu.pekerjaan} onChange={(e) => setIbu({ ...ibu, pekerjaan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  {pekerjaanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR HANDPHONE</label>
                <input type="text" value={ibu.nomorHp} onChange={(e) => setIbu({ ...ibu, nomorHp: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <label className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input type="checkbox" checked={ibu.kkSamaAyah} onChange={(e) => setIbu({ ...ibu, kkSamaAyah: e.target.checked })} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                <span>KK sama dengan ayah kandung</span>
              </label>
            </div>
          </div>

          {/* WALI */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">WALI</h2>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">OPSI WALI</label>
              <select value={waliOption} onChange={(e) => setWaliOption(e.target.value)} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="Sama dengan ayah kandung">Sama dengan ayah kandung</option>
                <option value="Sama dengan ibu kandung">Sama dengan ibu kandung</option>
                <option value="Lainnya">Lainnya</option>
                <option value="Tidak Memiliki Wali">Tidak Memiliki Wali</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-1">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NAMA LENGKAP WALI</label>
                <input type="text" disabled={isWaliDisabled} value={wali.namaLengkap} onChange={(e) => setWali({ ...wali, namaLengkap: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-semibold text-gray-800 focus:border-blue-500 focus:outline-none uppercase disabled:bg-white disabled:text-gray-800" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KEWARGANEGARAAN</label>
                <select disabled={isWaliDisabled} value={wali.kewarganegaraan} onChange={(e) => setWali({ ...wali, kewarganegaraan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none disabled:bg-white disabled:text-gray-800">
                  <option value="WNI">WNI</option>
                  <option value="WNA">WNA</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NIK WALI</label>
                <input type="text" disabled={isWaliDisabled} value={wali.nik} onChange={(e) => setWali({ ...wali, nik: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none disabled:bg-white disabled:text-gray-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TEMPAT LAHIR WALI</label>
                <input type="text" disabled={isWaliDisabled} value={wali.tempatLahir} onChange={(e) => setWali({ ...wali, tempatLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none uppercase disabled:bg-white disabled:text-gray-800" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TANGGAL LAHIR WALI</label>
                <input type="date" disabled={isWaliDisabled} value={wali.tanggalLahir} onChange={(e) => setWali({ ...wali, tanggalLahir: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none bg-white disabled:bg-white disabled:text-gray-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">PENDIDIKAN TERAKHIR</label>
                <select disabled={isWaliDisabled} value={wali.pendidikan} onChange={(e) => setWali({ ...wali, pendidikan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none disabled:bg-white disabled:text-gray-800">
                  {pendidikanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">PEKERJAAN UTAMA</label>
                <select disabled={isWaliDisabled} value={wali.pekerjaan} onChange={(e) => setWali({ ...wali, pekerjaan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none disabled:bg-white disabled:text-gray-800">
                  {pekerjaanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
                </select>
              </div>
            </div>
            
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR HANDPHONE WALI</label>
              <input type="text" disabled={isWaliDisabled} value={wali.nomorHp} onChange={(e) => setWali({ ...wali, nomorHp: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none disabled:bg-white disabled:text-gray-800" />
            </div>
          </div>

          {/* PENGHASILAN ORANG TUA/WALI */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div>
              <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase">PENGHASILAN ORANG TUA/WALI</h2>
              <p className="text-xs text-gray-500 font-semibold">Total Gabungan Penghasilan Orang Tua/Wali</p>
            </div>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Penghasilan Rata-rata per Bulan (Rp)</label>
              <select value={penghasilan.rataRata} onChange={(e) => setPenghasilan({ ...penghasilan, rataRata: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                {penghasilanOptions.map((item) => (<option key={item} value={item}>{item}</option>))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR KKS</label>
                <input type="text" placeholder="Bila Ada" value={penghasilan.nomorKks} onChange={(e) => setPenghasilan({ ...penghasilan, nomorKks: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">NOMOR PKH</label>
                <input type="text" placeholder="Bila Ada" value={penghasilan.nomorPkh} onChange={(e) => setPenghasilan({ ...penghasilan, nomorPkh: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 text-red-500 mb-1"><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></div>
                <span className="text-xs text-gray-600 font-bold text-center">Upload Kartu Keluarga</span>
                <label className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 text-[10px] font-semibold cursor-pointer hover:bg-blue-100 transition">
                  Pilih File <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, "fileKk")} />
                </label>
                {berkasOrangTua.fileKk && <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center">{berkasOrangTua.fileKk}</span>}
              </div>

              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 text-blue-500 mb-1"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                <span className="text-xs text-gray-600 font-bold text-center">Upload KKS</span>
                <label className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 text-[10px] font-semibold cursor-pointer hover:bg-blue-100 transition">
                  Pilih File <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, "fileKks")} />
                </label>
                {berkasOrangTua.fileKks ? <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center">{berkasOrangTua.fileKks}</span> : <span className="text-[10px] text-gray-400">Opsional</span>}
              </div>

              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 text-green-500 mb-1"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                <span className="text-xs text-gray-600 font-bold text-center">Upload PKH</span>
                <label className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 text-[10px] font-semibold cursor-pointer hover:bg-blue-100 transition">
                  Pilih File <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileUpload(e, "filePkh")} />
                </label>
                {berkasOrangTua.filePkh ? <span className="text-[10px] text-gray-500 font-medium truncate w-full text-center">{berkasOrangTua.filePkh}</span> : <span className="text-[10px] text-gray-400">Opsional</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Link href="/dashboard/santri" className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
              ← Kembali
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all uppercase tracking-wider flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN DATA ORANG TUA"}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 3: DATA ALAMAT                                        */}
      {/* ========================================================= */}
      {activeTab === "DATA ALAMAT" && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
          
          {/* ALAMAT AYAH KANDUNG */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">
              AYAH KANDUNG
            </h2>
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={alamatAyah.luarNegeri} onChange={(e) => setAlamatAyah({ ...alamatAyah, luarNegeri: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Tinggal Diluar Negeri</span>
            </div>
            
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS KEPEMILIKAN RUMAH</label>
              <select value={alamatAyah.kepemilikanRumah} onChange={(e) => setAlamatAyah({ ...alamatAyah, kepemilikanRumah: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Sewa/Kontrak">Sewa/Kontrak</option>
                <option value="Bebas Sewa/Menumpang">Bebas Sewa/Menumpang</option>
                <option value="Rumah Dinas">Rumah Dinas</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Provinsi</label>
                <select value={alamatAyah.provinsi} onChange={(e) => setAlamatAyah({ ...alamatAyah, provinsi: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Provinsi --</option>
                  <option value="SUMATERA UTARA">SUMATERA UTARA</option>
                  <option value="DKI JAKARTA">DKI JAKARTA</option>
                  <option value="JAWA BARAT">JAWA BARAT</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kabupaten/Kota</label>
                <select value={alamatAyah.kabupaten} onChange={(e) => setAlamatAyah({ ...alamatAyah, kabupaten: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Kabupaten --</option>
                  <option value="LABUHANBATU">LABUHANBATU</option>
                  <option value="MEDAN">MEDAN</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kecamatan</label>
                <select value={alamatAyah.kecamatan} onChange={(e) => setAlamatAyah({ ...alamatAyah, kecamatan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Kecamatan --</option>
                  <option value="BILAH HULU">BILAH HULU</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kelurahan/Desa</label>
                <select value={alamatAyah.kelurahan} onChange={(e) => setAlamatAyah({ ...alamatAyah, kelurahan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Kelurahan --</option>
                  <option value="MERANTI">MERANTI</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RT</label>
                <input type="text" value={alamatAyah.rt} onChange={(e) => setAlamatAyah({ ...alamatAyah, rt: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RW</label>
                <input type="text" value={alamatAyah.rw} onChange={(e) => setAlamatAyah({ ...alamatAyah, rw: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Alamat</label>
              <textarea rows={2} value={alamatAyah.alamatLengkap} onChange={(e) => setAlamatAyah({ ...alamatAyah, alamatLengkap: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none resize-none"></textarea>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KODEPOS</label>
              <input type="text" value={alamatAyah.kodePos} onChange={(e) => setAlamatAyah({ ...alamatAyah, kodePos: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          {/* ALAMAT IBU KANDUNG */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">
              IBU KANDUNG
            </h2>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={ibu.kkSamaAyah} readOnly className="w-4 h-4 text-blue-600 rounded bg-white" />
              <span className="text-sm text-gray-700">Sama Dengan Ayah Kandung</span>
            </div>
            
            <div className="bg-sky-50 text-sky-800 p-3 rounded text-[11px] font-medium leading-relaxed">
              Untuk mengubah status domisili Ibu Kandung di atas, silahkan ubah status KK Ibu Kandung pada tab Data Orang Tua. Jika KK Ibu Kandung sama dengan Ayah Kandung, maka alamat akan sama dengan Ayah Kandung.
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" disabled checked={alamatIbu.luarNegeri} className="w-4 h-4 text-blue-600 rounded bg-white border-gray-300 disabled:bg-white" />
              <span className="text-sm text-gray-700">Tinggal Diluar Negeri</span>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS KEPEMILIKAN RUMAH</label>
              <select disabled value={alamatIbu.kepemilikanRumah} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                <option value={alamatIbu.kepemilikanRumah}>{alamatIbu.kepemilikanRumah}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Provinsi</label>
                <select disabled value={alamatIbu.provinsi} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatIbu.provinsi}>{alamatIbu.provinsi}</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kabupaten/Kota</label>
                <select disabled value={alamatIbu.kabupaten} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatIbu.kabupaten}>{alamatIbu.kabupaten}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kecamatan</label>
                <select disabled value={alamatIbu.kecamatan} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatIbu.kecamatan}>{alamatIbu.kecamatan}</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kelurahan/Desa</label>
                <select disabled value={alamatIbu.kelurahan} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatIbu.kelurahan}>{alamatIbu.kelurahan}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RT</label>
                <input type="text" disabled value={alamatIbu.rt} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RW</label>
                <input type="text" disabled value={alamatIbu.rw} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800" />
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Alamat</label>
              <textarea rows={2} disabled value={alamatIbu.alamatLengkap} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none resize-none disabled:bg-white disabled:text-gray-800"></textarea>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KODEPOS</label>
              <input type="text" disabled value={alamatIbu.kodePos} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800" />
            </div>
          </div>

          {/* ALAMAT WALI */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">
              WALI
            </h2>
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS WALI</label>
              <select disabled value={waliOption} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                <option value={waliOption}>{waliOption}</option>
              </select>
            </div>
            
            <div className="bg-sky-50 text-sky-800 p-3 rounded text-[11px] font-medium leading-relaxed inline-block">
              Untuk mengubah status Wali, silakan lakukan perubahan status Wali pada tab Data Orang Tua
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" disabled checked={alamatWali.luarNegeri} className="w-4 h-4 text-blue-600 rounded bg-white border-gray-300 disabled:bg-white" />
              <span className="text-sm text-gray-700">Tinggal Diluar Negeri</span>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS KEPEMILIKAN RUMAH</label>
              <select disabled value={alamatWali.kepemilikanRumah} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                <option value={alamatWali.kepemilikanRumah}>{alamatWali.kepemilikanRumah}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Provinsi</label>
                <select disabled value={alamatWali.provinsi} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatWali.provinsi}>{alamatWali.provinsi}</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kabupaten/Kota</label>
                <select disabled value={alamatWali.kabupaten} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatWali.kabupaten}>{alamatWali.kabupaten}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kecamatan</label>
                <select disabled value={alamatWali.kecamatan} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatWali.kecamatan}>{alamatWali.kecamatan}</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kelurahan/Desa</label>
                <select disabled value={alamatWali.kelurahan} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800 appearance-none">
                  <option value={alamatWali.kelurahan}>{alamatWali.kelurahan}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RT</label>
                <input type="text" disabled value={alamatWali.rt} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RW</label>
                <input type="text" disabled value={alamatWali.rw} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800" />
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Alamat</label>
              <textarea rows={2} disabled value={alamatWali.alamatLengkap} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none resize-none disabled:bg-white disabled:text-gray-800"></textarea>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KODEPOS</label>
              <input type="text" disabled value={alamatWali.kodePos} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:outline-none disabled:bg-white disabled:text-gray-800" />
            </div>
          </div>

          {/* ALAMAT SISWA */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 tracking-wider uppercase border-b pb-2">
              SISWA
            </h2>
            
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">STATUS TEMPAT TINGGAL</label>
              <select value={alamatSiswa.statusTempatTinggal} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, statusTempatTinggal: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="Bersama Orang Tua">Bersama Orang Tua</option>
                <option value="Asrama/Pondok">Asrama/Pondok</option>
                <option value="Kost">Kost</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Provinsi</label>
                <select value={alamatSiswa.provinsi} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, provinsi: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Provinsi --</option>
                  <option value="SUMATERA UTARA">SUMATERA UTARA</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kabupaten/Kota</label>
                <select value={alamatSiswa.kabupaten} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, kabupaten: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Kabupaten --</option>
                  <option value="LABUHANBATU">LABUHANBATU</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kecamatan</label>
                <select value={alamatSiswa.kecamatan} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, kecamatan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Kecamatan --</option>
                  <option value="BILAH HULU">BILAH HULU</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Kelurahan/Desa</label>
                <select value={alamatSiswa.kelurahan} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, kelurahan: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="">-- Pilih Kelurahan --</option>
                  <option value="MERANTI">MERANTI</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RT</label>
                <input type="text" value={alamatSiswa.rt} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, rt: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">RW</label>
                <input type="text" value={alamatSiswa.rw} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, rw: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">Alamat Lengkap</label>
              <textarea rows={2} value={alamatSiswa.alamatLengkap} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, alamatLengkap: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none resize-none"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KOORDINAT ALAMAT</label>
                <div className="relative">
                  <input type="text" value={alamatSiswa.koordinat} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, koordinat: e.target.value })} className="w-full px-4 py-3 pr-10 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                </div>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">KODE POS</label>
                <input type="text" value={alamatSiswa.kodePos} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, kodePos: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 focus:border-blue-500 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">JARAK TEMPAT TINGGAL - MADRASAH</label>
                <select value={alamatSiswa.jarak} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, jarak: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Kurang dari 5 Km">Kurang dari 5 Km</option>
                  <option value="Antara 5 - 10 Km">Antara 5 - 10 Km</option>
                  <option value="Lebih dari 10 Km">Lebih dari 10 Km</option>
                </select>
              </div>
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">TRANSPORTASI KE SEKOLAH</label>
                <select value={alamatSiswa.transportasi} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, transportasi: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                  <option value="Jalan Kaki">Jalan Kaki</option>
                  <option value="Sepeda Motor">Sepeda Motor</option>
                  <option value="Mobil/Bus Antar Jemput">Mobil/Bus Antar Jemput</option>
                  <option value="Kendaraan Umum">Kendaraan Umum</option>
                </select>
              </div>
            </div>

            <div className="relative w-full md:w-1/2 md:pr-2">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-gray-400 tracking-wider">WAKTU TEMPUH</label>
              <select value={alamatSiswa.waktuTempuh} onChange={(e) => setAlamatSiswa({ ...alamatSiswa, waktuTempuh: e.target.value })} className="w-full px-4 py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 bg-white focus:border-blue-500 focus:outline-none">
                <option value="10-19 menit">10-19 menit</option>
                <option value="20-29 menit">20-29 menit</option>
                <option value="30-39 menit">30-39 menit</option>
                <option value="Lebih dari 40 menit">Lebih dari 40 menit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Link href="/dashboard/santri" className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
              ← Kembali
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all uppercase tracking-wider flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN DATA ALAMAT"}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AKTIVITAS BELAJAR                                  */}
      {/* ========================================================= */}
      {activeTab === "AKTIVITAS BELAJAR" && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6 overflow-x-auto">
          <div className="flex justify-between items-center bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold border border-green-300">i</div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Siswa Aktif</h3>
                <p className="text-xs text-gray-600">Saat ini siswa aktif dalam kegiatan pembelajaran</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowAktivitasForm(true)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold rounded-md transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                TAMBAH
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px] flex flex-col">
            <table className="w-full text-left text-[10px] text-gray-700 whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 pr-4 uppercase">TAHUN AJARAN - SEMESTER</th>
                  <th className="py-3 pr-4 uppercase">TANGGAL MULAI MASUK</th>
                  <th className="py-3 pr-4 uppercase">NSM - NAMA LEMBAGA</th>
                  <th className="py-3 pr-4 uppercase">JENJANG</th>
                  <th className="py-3 pr-4 uppercase">TINGKAT / KELOMPOK</th>
                  <th className="py-3 pr-4 uppercase">JURUSAN</th>
                  <th className="py-3 pr-4 uppercase">ROMBEL</th>
                  <th className="py-3 pr-4 uppercase">STATUS KEAKTIFAN</th>
                  <th className="py-3 pr-4 uppercase">KETERANGAN</th>
                  <th className="py-3 pl-2 uppercase text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {aktivitasList.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4">{row.ta}</td>
                    <td className="py-3 pr-4">{row.tanggal}</td>
                    <td className="py-3 pr-4">{row.nsm}</td>
                    <td className="py-3 pr-4">{row.jenjang}</td>
                    <td className="py-3 pr-4">{row.tingkat}</td>
                    <td className="py-3 pr-4">{row.jurusan}</td>
                    <td className="py-3 pr-4">{row.rombel}</td>
                    <td className="py-3 pr-4">
                      {row.status === "Aktif" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 font-bold border border-green-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> Aktif
                        </span>
                      ) : row.status === "Alumni" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 font-bold border border-red-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg> Alumni
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 font-bold border border-gray-200">
                          Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{row.ket}</td>
                    <td className="py-3 pl-2 flex gap-2 justify-center">
                      <button type="button" onClick={() => openEditAktivitas(idx)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button type="button" onClick={() => deleteAktivitas(idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {aktivitasList.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8">
                <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="text-xs font-semibold text-gray-400">Tidak ada data</span>
              </div>
            )}
          </div>
          <div className="pt-6 border-t border-gray-200 flex justify-between">
            <Link href="/dashboard/santri" className="text-sm font-semibold text-gray-700 flex items-center hover:text-gray-900 transition-colors w-max">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali
            </Link>
            <button onClick={handleSubmit} disabled={isSubmitting} className={`px-8 py-2.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all uppercase tracking-wider flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}>
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: KEBUTUHAN KHUSUS                                   */}
      {/* ========================================================= */}
      {activeTab === "KEBUTUHAN KHUSUS" && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="col-span-1 row-span-2 p-6 border border-gray-200 rounded-lg flex flex-col h-full bg-gray-50/30">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Kesulitan</h3>
              <textarea
                value={kebutuhanDetail.kesulitan}
                onChange={(e) => setKebutuhanDetail({...kebutuhanDetail, kesulitan: e.target.value})}
                placeholder="Deskripsikan kesulitan di sini..."
                className="flex-1 w-full p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none min-h-[120px]"
              ></textarea>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg flex flex-col bg-gray-50/30 min-h-[140px]">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Kebutuhan Alat Bantu</h3>
              <textarea
                value={kebutuhanDetail.alatBantu}
                onChange={(e) => setKebutuhanDetail({...kebutuhanDetail, alatBantu: e.target.value})}
                placeholder="Deskripsikan alat bantu di sini..."
                className="flex-1 w-full p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg flex flex-col bg-gray-50/30 min-h-[140px]">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Kebutuhan Pendampingan</h3>
              <textarea
                value={kebutuhanDetail.pendampingan}
                onChange={(e) => setKebutuhanDetail({...kebutuhanDetail, pendampingan: e.target.value})}
                placeholder="Deskripsikan kebutuhan pendampingan..."
                className="flex-1 w-full p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="w-full p-6 border border-gray-200 rounded-lg flex flex-col bg-gray-50/30 min-h-[140px]">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Kebutuhan Penyesuaian</h3>
            <textarea
                value={kebutuhanDetail.penyesuaian}
                onChange={(e) => setKebutuhanDetail({...kebutuhanDetail, penyesuaian: e.target.value})}
                placeholder="Deskripsikan penyesuaian khusus..."
                className="flex-1 w-full p-3 text-sm text-gray-700 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
              ></textarea>
          </div>

          <div className="space-y-6 pt-4">
            <h3 className="text-sm font-bold text-gray-700">Kebutuhan Khusus</h3>
            
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-blue-500 tracking-wider uppercase">
                KEBUTUHAN KHUSUS
              </label>
              <select
                value={kebutuhanKhusus}
                onChange={(e) => setKebutuhanKhusus(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-blue-400 text-sm font-semibold text-gray-800 bg-white focus:border-blue-600 focus:outline-none appearance-none"
              >
                {kebutuhanKhususOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                KEBUTUHAN DISABILITAS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tidakAda} onChange={() => handleDisabilitasChange("tidakAda")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tidak Ada</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tunaNetra} onChange={() => handleDisabilitasChange("tunaNetra")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tuna Netra</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tunaRungu} onChange={() => handleDisabilitasChange("tunaRungu")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tuna Rungu</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tunaDaksa} onChange={() => handleDisabilitasChange("tunaDaksa")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tuna Daksa</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tunaGrahita} onChange={() => handleDisabilitasChange("tunaGrahita")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tuna Grahita</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tunaLaras} onChange={() => handleDisabilitasChange("tunaLaras")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tuna Laras</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.lainnya} onChange={() => handleDisabilitasChange("lainnya")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Lainnya</span>
                </label>
                <label className="flex items-center space-x-3 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={disabilitas.tunaWicara} onChange={() => handleDisabilitasChange("tunaWicara")} className="w-4 h-4 text-blue-600 rounded bg-gray-100 border-gray-300 focus:ring-blue-500" />
                  <span>Tuna Wicara</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-6">
            <Link href="/dashboard/santri" className="text-sm font-semibold text-gray-700 flex items-center hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-2.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all uppercase tracking-wider flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 6: BEASISWA & BANTUAN                                 */}
      {/* ========================================================= */}
      {activeTab === "BEASISWA & BANTUAN" && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500">
                <option>Urutkan</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <button type="button" onClick={() => setShowBeasiswaForm(true)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold rounded flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              TAMBAH
            </button>
          </div>

          <div className="overflow-x-auto min-h-[300px] flex flex-col">
            <table className="w-full text-left text-[10px] text-gray-700 whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 pr-4 uppercase">TAHUN</th>
                  <th className="py-3 pr-4 uppercase">KATEGORI</th>
                  <th className="py-3 pr-4 uppercase">NAMA BEASISWA/BANTUAN</th>
                  <th className="py-3 pr-4 uppercase">NAMA INSTANSI PEMBERI</th>
                  <th className="py-3 pr-4 uppercase">JENIS INSTANSI PEMBERI</th>
                  <th className="py-3 pr-4 uppercase">JANGKA WAKTU</th>
                  <th className="py-3 pr-4 uppercase">NOMINAL BEASISWA</th>
                  <th className="py-3 pl-2 uppercase text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {beasiswaList.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4">{row.tahun}</td>
                    <td className="py-3 pr-4">{row.kategori}</td>
                    <td className="py-3 pr-4">{row.namaBantuan}</td>
                    <td className="py-3 pr-4">{row.namaInstansi}</td>
                    <td className="py-3 pr-4">{row.jenisInstansi}</td>
                    <td className="py-3 pr-4">{row.jangkaWaktu}</td>
                    <td className="py-3 pr-4">{row.nominal}</td>
                    <td className="py-3 pl-2 flex gap-2 justify-center">
                      <button type="button" onClick={() => openEditBeasiswa(idx)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button type="button" onClick={() => deleteBeasiswa(idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {beasiswaList.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8">
                <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="text-xs font-semibold text-gray-400">Tidak ada data</span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-between">
            <Link href="/dashboard/santri" className="text-sm font-semibold text-gray-700 flex items-center hover:text-gray-900 transition-colors w-max">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali
            </Link>
            <button onClick={handleSubmit} disabled={isSubmitting} className={`px-8 py-2.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all uppercase tracking-wider flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}>
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: PRESTASI SISWA                                     */}
      {/* ========================================================= */}
      {activeTab === "PRESTASI SISWA" && (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500">
                <option>Urutkan</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            <button type="button" onClick={() => setShowPrestasiForm(true)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[11px] font-bold rounded flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              TAMBAH
            </button>
          </div>

          <div className="overflow-x-auto min-h-[300px] flex flex-col">
            <table className="w-full text-left text-[10px] text-gray-700 whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-3 pr-4 uppercase">TAHUN</th>
                  <th className="py-3 pr-4 uppercase">NAMA LOMBA</th>
                  <th className="py-3 pr-4 uppercase">BIDANG LOMBA</th>
                  <th className="py-3 pr-4 uppercase">NAMA PENYELENGGARA</th>
                  <th className="py-3 pr-4 uppercase">LOMBA TINGKAT</th>
                  <th className="py-3 pr-4 uppercase">PERINGKAT YANG DIRAIH</th>
                  <th className="py-3 pl-2 uppercase text-center">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {prestasiList.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4">{row.tahun}</td>
                    <td className="py-3 pr-4">{row.namaLomba}</td>
                    <td className="py-3 pr-4">{row.bidangLomba}</td>
                    <td className="py-3 pr-4">{row.namaPenyelenggara}</td>
                    <td className="py-3 pr-4">{row.lombaTingkat}</td>
                    <td className="py-3 pr-4">{row.peringkat}</td>
                    <td className="py-3 pl-2 flex gap-2 justify-center">
                      <button type="button" onClick={() => openEditPrestasi(idx)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-1.5 rounded" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button type="button" onClick={() => deletePrestasi(idx)} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded" title="Hapus">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {prestasiList.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-8">
                <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span className="text-xs font-semibold text-gray-400">Tidak ada data</span>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-between">
            <Link href="/dashboard/santri" className="text-sm font-semibold text-gray-700 flex items-center hover:text-gray-900 transition-colors w-max">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Kembali
            </Link>
            <button onClick={handleSubmit} disabled={isSubmitting} className={`px-8 py-2.5 rounded-lg text-white text-xs font-bold shadow-sm transition-all uppercase tracking-wider flex items-center gap-2 ${isSubmitting ? 'bg-amber-400 cursor-wait' : 'bg-amber-500 hover:bg-amber-600'}`}>
              {isSubmitting ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PLACEHOLDER UNTUK TAB LAINNYA                             */}
      {/* ========================================================= */}
      {!listTab.includes(activeTab) && (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500 shadow-sm">
          Menampilkan formulir <span className="font-bold text-gray-800">{activeTab}</span>
        </div>
      )}
    </div>
  );
}