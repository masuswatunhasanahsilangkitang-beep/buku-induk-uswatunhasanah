"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- State untuk atur buka/tutup mata
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Username/Email dan Password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        window.location.href = "/dashboard";
      } else {
        setErrorMessage(result.message);
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Gagal terhubung ke server. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Ornamen */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10">
        
        {/* SISI KIRI: Branding & Informasi */}
        <div className="w-full md:w-5/12 bg-blue-600 p-10 flex flex-col justify-between relative overflow-hidden text-white hidden md:flex">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 opacity-90 z-0"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl z-0"></div>
          <div className="absolute top-10 -left-10 w-32 h-32 bg-green-300 opacity-20 rounded-full blur-2xl z-0"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white text-blue-600 font-black text-2xl flex items-center justify-center rounded-lg shadow-md mb-6">
              UH
            </div>
            <h1 className="text-3xl font-black mb-4 leading-tight">
              Sistem Informasi<br />Buku Induk
            </h1>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">
              Platform manajemen data santri terpadu untuk Madrasah (MI, MTs, MA) dan PKPPS (Ula, Wustha, Ulya) di bawah naungan Yayasan Pondok Pesantren Salafiyah Uswatun Hasanah.
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-xs text-blue-200 font-medium">
              Versi 1.0.0 &copy; 2026 Uswatun Hasanah
            </p>
          </div>
        </div>

        {/* SISI KANAN: Formulir Login */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            
            <div className="md:hidden flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-blue-600 text-white font-black text-2xl flex items-center justify-center rounded-lg shadow-md mb-3">
                UH
              </div>
              <h2 className="text-xl font-black text-gray-800">Buku Induk Terpadu</h2>
              <p className="text-xs text-gray-500 mt-1">PP Salafiyah Uswatun Hasanah</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Selamat Datang Kembali</h2>
              <p className="text-sm font-medium text-gray-500">Silakan masukkan kredensial Anda untuk melanjutkan ke dashboard panel admin.</p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-xs font-bold text-red-700 leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Alamat Email / Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                  </div>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: admin" 
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Kata Sandi</label>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Lupa sandi?</Link>
                </div>
                <div className="relative">
                  {/* Ikon Gembok di Kiri */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>

                  {/* Input Password (Tipe Berubah Berdasarkan State showPassword) */}
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />

                  {/* Tombol Ikon Mata di Kanan */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                  >
                    {showPassword ? (
                      // Ikon Mata Terbuka (Sandi Terlihat)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      // Ikon Mata Dicoret (Sandi Disembunyikan)
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                <label htmlFor="remember" className="text-xs font-medium text-gray-600 cursor-pointer">Ingat saya di perangkat ini</label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-lg text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 tracking-wide uppercase ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      Masuk ke Dashboard
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-100 pt-6">
              <p className="text-[10px] font-semibold text-gray-400">
                Pusat Bantuan & Dukungan Teknis: <br />
                <a href="#" className="text-blue-500 hover:underline">support@uswatunhasanah.id</a>
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}