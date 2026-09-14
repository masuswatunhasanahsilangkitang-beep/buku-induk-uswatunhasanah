"use client";
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode"; // Menggunakan mesin murni, bukan scanner UI

export default function AbsensiHarianPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [riwayatHariIni, setRiwayatHariIni] = useState<any[]>([]);
  
  const [hariIniString, setHariIniString] = useState("");
  const [jadwalHariIni, setJadwalHariIni] = useState<any[]>([]);
  const [selectedJadwalId, setSelectedJadwalId] = useState("manual");
  const [jenisKegiatan, setJenisKegiatan] = useState("KBM Harian");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const lastScanTime = useRef<number>(0);
  const prosesAbsensiRef = useRef<any>(null); // Penyelamat agar state tidak kadaluarsa

  useEffect(() => {
    const hari = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(new Date());
    setHariIniString(hari);
    const fetchJadwal = async () => {
      try {
        const res = await fetch(`/api/jadwal?hari=${hari}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setJadwalHariIni(json.data);
          setSelectedJadwalId(json.data[0].id);
          setJenisKegiatan(json.data[0].jenisKegiatan);
          setNamaKegiatan(json.data[0].namaKegiatan);
        }
      } catch (error) {}
    };
    fetchJadwal();
  }, []);

  const fetchRiwayat = async () => {
    try {
      const res = await fetch(`/api/absensi?jenisKegiatan=${encodeURIComponent(jenisKegiatan)}`);
      const json = await res.json();
      if (json.success) setRiwayatHariIni(json.data || []);
    } catch (error) {}
  };

  useEffect(() => { fetchRiwayat(); }, [jenisKegiatan]);

  // Fungsi Absen Utama
  const prosesAbsensi = async (idScan: string) => {
    if (!idScan || idScan.trim() === "") return; 
    if (loading) return; 

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          identifier: idScan.trim(), 
          status: "Hadir",
          jenisKegiatan,
          namaKegiatan: namaKegiatan.trim() === "" ? null : namaKegiatan,
          jadwalId: selectedJadwalId !== "manual" ? selectedJadwalId : null
        })
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMessage({ type: "success", text: json.message });
        fetchRiwayat(); 
        const audio = new Audio("data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YTEAAAAA"); 
        audio.play().catch(()=> {}); 
      } else {
        setMessage({ type: "error", text: json.message || "Gagal mencatat absensi." });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: `Jaringan terputus: ${error.message}` });
    } finally {
      setLoading(false);
      setIdentifier("");
      if (!isCameraActive) inputRef.current?.focus(); 
    }
  };

  // Update ref setiap kali fungsi prosesAbsensi berubah (mencegah state kadaluarsa)
  useEffect(() => {
    prosesAbsensiRef.current = prosesAbsensi;
  }, [prosesAbsensi]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prosesAbsensiRef.current) prosesAbsensiRef.current(identifier.trim());
  };

  // KAMERA MURNI TANPA BLINK
  useEffect(() => {
    if (!isCameraActive) return;

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" }, // Paksa gunakan kamera belakang HP
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        const now = Date.now();
        // Jeda pintar 3 detik agar tidak dobel scan
        if (now - lastScanTime.current < 3000) return; 
        lastScanTime.current = now;
        
        if (prosesAbsensiRef.current) {
          prosesAbsensiRef.current(decodedText);
        }
      },
      (errorMessage) => { /* Abaikan error cari bingkai */ }
    ).catch((err) => {
      setMessage({ type: "error", text: "Gagal mengakses kamera. Pastikan izin kamera diberikan." });
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
      }
    };
  }, [isCameraActive]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <nav className="text-xs text-gray-400 space-x-1 mb-2">
            <span>Absensi</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Mobile Scanner</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-800">Scanner Kamera Guru</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            
            {/* PANEL JADWAL DINAMIS */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-3 border-b pb-2">
                <h3 className="text-sm font-bold text-gray-800">📅 Jadwal Kegiatan</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Hari {hariIniString}</span>
              </div>
              <div className="space-y-3">
                <select 
                  value={selectedJadwalId}
                  onChange={(e) => {
                     const val = e.target.value;
                     setSelectedJadwalId(val);
                     if (val === "manual") {
                        setJenisKegiatan("KBM Harian");
                        setNamaKegiatan("");
                     } else {
                        const jadwal = jadwalHariIni.find(j => j.id === val);
                        if (jadwal) {
                           setJenisKegiatan(jadwal.jenisKegiatan);
                           setNamaKegiatan(jadwal.namaKegiatan);
                        }
                     }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold focus:border-blue-500 outline-none bg-gray-50"
                  disabled={isCameraActive}
                >
                  {jadwalHariIni.length > 0 && (
                    <optgroup label={`Tersedia ${jadwalHariIni.length} Jadwal:`}>
                      {jadwalHariIni.map(j => (
                        <option key={j.id} value={j.id}>{j.jamMulai} - {j.namaKegiatan}</option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Lainnya">
                    <option value="manual">Input Manual (Di Luar Jadwal)</option>
                  </optgroup>
                </select>

                {selectedJadwalId === "manual" && (
                  <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Mode Manual Aktif</p>
                    <select 
                      value={jenisKegiatan} 
                      onChange={e => setJenisKegiatan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:border-blue-500 outline-none"
                    >
                      <option value="KBM Harian">KBM Harian</option>
                      <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                      <option value="Kegiatan Asrama">Kegiatan Asrama</option>
                      <option value="Acara Khusus">Acara Khusus</option>
                    </select>
                    <input 
                      type="text" 
                      value={namaKegiatan}
                      onChange={e => setNamaKegiatan(e.target.value)}
                      placeholder="Nama Kegiatan (Cth: Sholat Dhuha)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:border-blue-500 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* AREA SCANNER */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex bg-gray-100 p-1">
                <button 
                  onClick={() => setIsCameraActive(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${isCameraActive ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  📸 Buka Kamera
                </button>
                <button 
                  onClick={() => setIsCameraActive(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${!isCameraActive ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ⌨️ Input Manual
                </button>
              </div>

              <div className="p-5">
                {isCameraActive ? (
                  <div className="space-y-4 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Arahkan Kamera ke Kartu</p>
                    {/* Pembungkus Kamera Murni */}
                    <div id="reader" className="w-full bg-black rounded-lg overflow-hidden border-2 border-dashed border-gray-300 min-h-[250px] relative"></div>
                    {message && (
                      <div className={`p-3 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleManualSubmit} className="space-y-4 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Ketik NISN Secara Manual</p>
                    <input 
                      ref={inputRef}
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Contoh: 0012345678"
                      className="w-full px-4 py-3 border-2 border-blue-200 focus:border-blue-600 rounded-xl text-center text-lg font-bold uppercase tracking-wider outline-none transition-all shadow-inner"
                      disabled={loading}
                    />
                    <button 
                      type="submit" 
                      disabled={loading || !identifier}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors text-sm disabled:opacity-50"
                    >
                      {loading ? "MEMPROSES..." : "CATAT KEHADIRAN"}
                    </button>
                    {message && (
                      <div className={`p-3 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {message.text}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* TABEL RIWAYAT */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Log Kehadiran: {namaKegiatan || jenisKegiatan}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{hariIniString}, {new Date().toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                  Total Hadir: {riwayatHariIni.length}
                </span>
              </div>

              {riwayatHariIni.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center">
                  <span className="text-4xl text-gray-200 mb-3">📭</span>
                  <p className="text-gray-400 text-xs font-semibold">Belum ada absen tercatat sesi ini.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-y">
                      <tr>
                        <th className="px-3 py-3">Masuk</th>
                        <th className="px-3 py-3">Keluar</th>
                        <th className="px-3 py-3">Nama Santri/Guru</th>
                        <th className="px-3 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {riwayatHariIni.map((item) => (
                        <tr key={item.id} className={`hover:bg-blue-50/50 ${item.role === 'Guru' ? 'bg-purple-50/30' : ''}`}>
                          <td className="px-3 py-2.5 font-mono font-bold text-emerald-600 whitespace-nowrap">
                            {item.waktu}
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold text-rose-600 whitespace-nowrap">
                            {item.waktuKeluar ? item.waktuKeluar : <span className="text-gray-400 font-normal italic">Belum Keluar</span>}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-gray-800">
                            {item.namaLengkap}
                            {item.role === 'Guru' && (
                              <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] uppercase shadow-sm">
                                GURU PENGAJAR
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span className={`px-2 py-1 font-bold rounded shadow-sm text-[9px] uppercase ${
                              item.status === 'Hadir' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}