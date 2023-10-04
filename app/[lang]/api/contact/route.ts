import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const nodemailer = require('nodemailer');
  const body = await request.json();
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.NEXT_PUBLIC_NODEMAILER_AUTH_USER,
      pass: process.env.NEXT_PUBLIC_NODEMAILER_AUTH_PASS,
    },
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailData = {
    from: process.env.NEXT_PUBLIC_NODEMAILER_AUTH_USER,
    to: process.env.NEXT_PUBLIC_NODEMAILER_RECEPTOR,
    subject: `Nuevo mensaje: ${body?.subject}`,
    text: `${body?.message} | Escrito por: ${body?.from}`,
    html: `<div>${body?.message}</div><p>Escrito por:
     ${body?.from}</p>`,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err: any, info: any) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  return NextResponse.json({ sent: true });
}
