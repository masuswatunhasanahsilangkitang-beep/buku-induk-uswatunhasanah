import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tahunAjaran, jenisKurikulum, statusAktif } = body;
    
    const kurikulumBaru = await prisma.kurikulum.create({
      data: { 
        tahunAjaran: String(tahunAjaran), 
        jenisKurikulum: String(jenisKurikulum),
        statusAktif: Boolean(statusAktif)
      }
    });
    return NextResponse.json({ success: true, data: kurikulumBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}