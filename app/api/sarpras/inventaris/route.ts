import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const barangBaru = await prisma.barangInventaris.create({ 
      data: {
        ...body,
        jumlahTotal: parseInt(body.jumlahTotal) || 0,
        kondisiBaik: parseInt(body.kondisiBaik) || 0,
        kondisiRusakRingan: parseInt(body.kondisiRusakRingan) || 0,
        kondisiRusakBerat: parseInt(body.kondisiRusakBerat) || 0,
      }
    });
    return NextResponse.json({ success: true, data: barangBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}