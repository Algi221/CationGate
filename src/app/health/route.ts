import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Next.js Dev Server is running properly',
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
