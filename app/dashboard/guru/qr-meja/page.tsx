import prisma from "@/lib/prisma";

export default async function CetakQRGuruPage() {
  // Mengambil semua data guru dari database
  const daftarGuru = await prisma.guru.findMany({
    orderBy: { namaLengkap: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0">
        
        {/* HEADER (Sembunyi saat dicetak) */}
        <div className="flex justify-between items-center mb-8 border-b pb-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cetak QR Code Meja Guru</h1>
            <p className="text-sm text-gray-500 mt-1">Gunting dan tempelkan QR Code ini di meja masing-masing kelas/guru.</p>
          </div>
          <button 
            onClick="window.print()" 
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow cursor-pointer"
          >
            🖨️ Cetak Stiker
          </button>
        </div>

        {/* GRID QR CODE UNTUK DICETAK */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
          {daftarGuru.map((guru) => {
            // Gunakan NIP jika ada, jika tidak gunakan NIK, jika tidak gunakan ID unik sistem
            const qrData = guru.nip || guru.nik || guru.id;
            
            return (
              <div key={guru.id} className="border-2 border-dashed border-gray-300 p-4 rounded-xl flex flex-col items-center text-center page-break-inside-avoid">
                <div className="text-[10px] font-bold text-gray-400 mb-2 tracking-wider">
                  MAS PP USWATUN HASANAH
                </div>
                
                {/* Otomatis generate QR gambar */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`} 
                  alt={`QR ${guru.namaLengkap}`}
                  className="w-28 h-28 object-contain mb-3"
                  crossOrigin="anonymous"
                />
                
                <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                  {guru.namaLengkap}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {qrData}
                </p>
                <div className="mt-2 text-[9px] font-bold text-blue-600 bg-blue-50 w-full py-1 rounded border border-blue-100">
                  SCAN UNTUK BUKA SESI
                </div>
              </div>
            );
          })}
        </div>

        {daftarGuru.length === 0 && (
          <div className="text-center py-12 text-gray-400 italic">
            Belum ada data Guru di database Anda.
          </div>
        )}

      </div>
    </div>
  );
}