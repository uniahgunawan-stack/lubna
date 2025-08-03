import prisma from "@/lib/prisma";
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";



export async function POST (req: NextRequest) {
    try {
        const { email,name, password,} = await req.json();

        if (!email || !password){
            return NextResponse.json({massage:'Email dan Password di butuhkan'}, {status: 404});
        }

        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return NextResponse.json({error:'Email sudah terdaftar '},{status: 409});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await prisma.user.create({
            data: {
                email,
                name,
                role:'USER',
                password:hashedPassword,
            },
        });
        return NextResponse.json({message:'Pendaftaran berhasil'}, {status: 200});
        
    } catch (error){
        console.log('error register:',error);
        return NextResponse.json({error: 'Terjadi kesalahan server.'},{status:500});
    }
}