import Link from "next/link";

export default function AssetTetapPage() {
  // 13 Menu Sesuai Standar EMIS Kemenag
  const menuAsset = [
    { title: "Lahan", icon: "🗺️", link: "/dashboard/sarpras/asset-tetap/lahan" },
    { title: "Gedung", icon: "🏢", link: "/dashboard/sarpras/asset-tetap/gedung" },
    { title: "Ruangan", icon: "🚪", link: "/dashboard/sarpras/asset-tetap/ruangan" },
    { title: "Air Sanitasi", icon: "🚰", link: "/dashboard/sarpras/asset-tetap/air-sanitasi" },
    { title: "Mebel", icon: "🪑", link: "/dashboard/sarpras/asset-tetap/mebel" },
    { title: "Sarana Administrasi", icon: "🗄️", link: "/dashboard/sarpras/asset-tetap/administrasi" },
    { title: "Perlengkapan Penunjang", icon: "🪜", link: "/dashboard/sarpras/asset-tetap/penunjang" },
    { title: "Olah Raga & Seni", icon: "⚽", link: "/dashboard/sarpras/asset-tetap/olahraga-seni" },
    { title: "Perlengkapan Laboratorium", icon: "🔬", link: "/dashboard/sarpras/asset-tetap/laboratorium" },
    { title: "Fasilitas Keterampilan", icon: "🛠️", link: "/dashboard/sarpras/asset-tetap/keterampilan" },
    { title: "Listrik dan Internet", icon: "⚡", link: "/dashboard/sarpras/asset-tetap/listrik-internet" },
    { title: "Kebutuhan Tambahan", icon: "➕", link: "/dashboard/sarpras/asset-tetap/tambahan" },
    { title: "Sarana Pembelajaran", icon: "📖", link: "/dashboard/sarpras/asset-tetap/pembelajaran" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <nav className="text-xs text-gray-400 space-x-1 mb-1">
              <Link href="/dashboard/sarpras" className="hover:text-blue-600">Sarpras</Link>
              <span>&gt;</span>
              <span className="font-semibold text-gray-600">Asset Tetap</span>
            </nav>
            <h1 className="text-2xl font-black text-gray-800">Kategori Asset Tetap</h1>
          </div>
        </div>

        {/* Grid 13 Menu */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuAsset.map((item, index) => (
            <Link key={index} href={item.link} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-700 group-hover:text-blue-600 leading-tight">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}