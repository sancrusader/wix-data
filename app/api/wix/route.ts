// app/api/wixData/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json(); // Extract JSON data from the request body

  console.log(data);

  // Send a response back
  return NextResponse.json({ message: 'Data received', data });
}

export async function GET() {
  // Handle unsupported GET method
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
