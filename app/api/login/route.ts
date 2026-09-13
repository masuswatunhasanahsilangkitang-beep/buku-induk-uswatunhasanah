import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Verifikasi kecocokan username dan sandi
    if (username === "admin" && password === "admin123") {
      const response = NextResponse.json({ success: true, message: "Login Berhasil" });
      
      // Menerbitkan Cookie (Kartu Akses)
      response.cookies.set({
        name: "auth_token",
        value: "sah",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 8, // Akses berlaku selama 8 jam
      });

      return response;
    }

    // Jika sandi salah
    return NextResponse.json(
      { success: false, message: "Username atau Password salah!" }, 
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" }, 
      { status: 500 }
    );
  }
}