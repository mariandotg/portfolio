import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import {
  PLANETSCALE_DATABASE_SECRET,
  PLANETSCALE_DATABASE_URL,
} from '@/config';

export const PUT = async (request: NextRequest) => {
  const secret = request.headers.get('keep-ps-awake-api-secret');

  if (secret !== PLANETSCALE_DATABASE_SECRET) {
    return NextResponse.json({ status: 403, error: 'Unauthorized' });
  }

  const connection = await mysql.createConnection(
    PLANETSCALE_DATABASE_URL || ''
  );

  await connection.execute(
    'INSERT INTO keep_alive (created_at) VALUES (CURRENT_TIMESTAMP)'
  );
  const ping = new Date().toISOString();

  connection.end();
  return NextResponse.json({ status: 200, ping });
};
