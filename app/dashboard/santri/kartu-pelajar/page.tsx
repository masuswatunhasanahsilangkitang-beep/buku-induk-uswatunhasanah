"use client";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function KartuPelajarPage() {
  const [listSantri, setListSantri] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSantri() {
      try {
        const res = await fetch("/api/santri");
        const json = await res.json();
        // PERBAIKAN: Ambil array 'santri' dari dalam object json.data
        if (json.success) {
          setListSantri(json.data.santri ? json.data.santri : json.data || []);
        }
      } catch (error) {
        console.error("Gagal memuat data santri:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSantri();
  }, []);

  const handleCetakKartu = () => {
    window.print();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === (listSantri?.length || 0)) {
      setSelectedIds([]);
    } else {
      // PERBAIKAN: Safe check dengan tanda tanya
      setSelectedIds(listSantri?.map(s => s.id) || []);
    }
  };

  // Tentukan data mana yang akan dicetak (Safe check dengan tanda tanya)
  const dataToPrint = selectedIds.length > 0 
    ? listSantri?.filter(s => selectedIds.includes(s.id)) 
    : listSantri;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800 print:p-0 print:bg-transparent">
      
      {/* CSS INLINE KHUSUS CETAK */}
      <style jsx global>{`
        @media screen {
          #print-area { display: none !important; }
        }
        @media print {
          body * { visibility: hidden; }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 15px !important;
            padding: 10mm !important;
            background-color: transparent !important;
          }
          .print-card-box {
            width: 8.56cm !important;
            height: 5.4cm !important;
            background: linear-gradient(135deg, #1e3a8a, #1e40af, #312e81) !important;
            border-radius: 12px !important;
            padding: 12px !important;
            position: relative !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            border: 1px solid #94a3b8 !important;
            page-break-inside: avoid !important;
            margin-bottom: 5px !important;
          }
          .text-white-print { color: white !important; }
          .text-blue-200-print { color: #bfdbfe !important; }
          .text-gray-200-print { color: #e5e7eb !important; }
          .bg-white-print { background-color: white !important; }
          .bg-gray-200-print { background-color: #e5e7eb !important; }
          .border-blue-print { border-color: rgba(29, 78, 216, 0.6) !important; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      {/* TAMPILAN LAYAR BROWSER */}
      <div className="max-w-7xl mx-auto space-y-6 print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-2">
              <span>Siswa</span> <span>&gt;</span> <span className="font-semibold text-gray-600">Cetak Kartu Pelajar</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-800">Kartu Pelajar & Barcode Absensi</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {listSantri?.length > 0 && (
              <button 
                onClick={toggleSelectAll}
                className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg shadow-sm text-xs transition-colors"
              >
                {selectedIds.length === listSantri.length ? "Batal Pilih Semua" : "Pilih Semua"}
              </button>
            )}
            <button 
              onClick={handleCetakKartu}
              disabled={isLoading || !listSantri || listSantri.length === 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-xs transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <span>🖨️</span> 
              {selectedIds.length > 0 ? `Cetak ${selectedIds.length} Terpilih` : "Cetak Semua Kartu"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400 py-12 animate-pulse">Memuat data siswa...</p>
        ) : !listSantri || listSantri.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <span className="text-4xl text-gray-300">🪪</span>
            <p className="text-gray-400 text-sm font-semibold mt-2">Belum ada data siswa yang terdaftar di sistem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PERBAIKAN: Safe check map */}
            {listSantri?.map((santri) => {
              const isSelected = selectedIds.includes(santri.id);
              return (
                <div key={santri.id} className={`relative mx-auto transition-transform ${isSelected ? 'scale-[1.02]' : ''}`}>
                  <div className="absolute -top-3 -right-3 z-10">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => toggleSelect(santri.id)}
                      className="w-6 h-6 text-emerald-600 bg-white border-2 border-gray-300 rounded-md focus:ring-emerald-500 cursor-pointer shadow-sm"
                    />
                  </div>
                  
                  <div className={`w-[323px] h-[204px] bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white rounded-xl shadow-md p-4 relative overflow-hidden flex flex-col justify-between border-2 ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-blue-700'}`}>
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex items-center justify-between border-b border-blue-700/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏫</span>
                        <div>
                          <h4 className="text-[10px] font-bold tracking-wider uppercase text-blue-200">KARTU PELAJAR MADRASAH</h4>
                          <p className="text-[8px] text-gray-300">TAHUN AJARAN 2026/2027</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 my-auto">
                      <div className="w-[50px] h-[65px] bg-gray-200 rounded border-2 border-white/80 overflow-hidden flex-shrink-0 flex items-center justify-center text-gray-500 text-[9px] font-bold">
                        {santri.fileFotoSiswa ? <img src={santri.fileFotoSiswa} alt="Foto" className="w-full h-full object-cover" /> : <span>FOTO</span>}
                      </div>
                      <div className="space-y-1 text-xs overflow-hidden flex-grow">
                        <div>
                          <p className="text-[8px] text-blue-300 font-semibold uppercase leading-none">Nama Lengkap</p>
                          <p className="font-bold truncate text-white uppercase text-[10px]">{santri.namaLengkap}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-blue-300 font-semibold uppercase leading-none">NISN / NIS</p>
                          <p className="font-mono text-gray-200 text-[10px]">{santri.nisn || santri.nis || "-"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-blue-300 font-semibold uppercase leading-none">Rombel / Kelas</p>
                          <p className="text-gray-200 font-medium text-[10px]">{santri.rombel?.namaRombel || "Belum ada"}</p>
                        </div>
                      </div>
                      <div className="bg-white p-1 rounded flex-shrink-0 shadow-sm ml-auto">
                        <QRCodeSVG value={santri.nisn || santri.id} size={50} level="M" />
                      </div>
                    </div>
                    <div className="text-[7px] text-center text-blue-200 border-t border-blue-700/60 pt-1 flex justify-between px-1">
                      <span>Gunakan kartu ini untuk absensi kehadiran.</span>
                      <span className="font-mono">ID: {santri.id.substring(0, 6)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AREA KHUSUS CETAK */}
      <div id="print-area">
        {/* PERBAIKAN: Safe check map */}
        {dataToPrint?.map((santri) => (
          <div key={`print-${santri.id}`} className="print-card-box">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(29, 78, 216, 0.6)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🏫</span>
                <div>
                  <div className="text-blue-200-print" style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>KARTU PELAJAR MADRASAH</div>
                  <div className="text-gray-200-print" style={{ fontSize: '8px' }}>TAHUN AJARAN 2026/2027</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', marginBottom: 'auto' }}>
              <div className="bg-gray-200-print" style={{ width: '50px', height: '65px', borderRadius: '4px', border: '2px solid rgba(255,255,255,0.8)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {santri.fileFotoSiswa ? (
                  <img src={santri.fileFotoSiswa} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#6b7280' }}>FOTO</span>
                )}
              </div>

              <div style={{ flexGrow: 1 }}>
                <div style={{ marginBottom: '4px' }}>
                  <div className="text-blue-200-print" style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Nama Lengkap</div>
                  <div className="text-white-print" style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{santri.namaLengkap}</div>
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <div className="text-blue-200-print" style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>NISN / NIS</div>
                  <div className="text-gray-200-print" style={{ fontSize: '10px', fontFamily: 'monospace' }}>{santri.nisn || santri.nis || "-"}</div>
                </div>
                <div>
                  <div className="text-blue-200-print" style={{ fontSize: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>Rombel / Kelas</div>
                  <div className="text-gray-200-print" style={{ fontSize: '10px', fontWeight: '500' }}>{santri.rombel?.namaRombel || "Belum ada"}</div>
                </div>
              </div>

              <div className="bg-white-print" style={{ padding: '4px', borderRadius: '4px' }}>
                <QRCodeSVG value={santri.nisn || santri.id} size={50} level="M" />
              </div>
            </div>

            <div className="border-blue-print text-blue-200-print" style={{ borderTopWidth: '1px', borderTopStyle: 'solid', paddingTop: '4px', fontSize: '7px', textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <span>Gunakan kartu ini untuk absensi kehadiran.</span>
              <span style={{ fontFamily: 'monospace' }}>ID: {santri.id.substring(0, 6)}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}