import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate the data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Log the received data
    console.log('Received Wix form data:', data);

    // Process the data here (e.g., save to database, send email, etc.)
    // For now, we'll just echo it back

    // Send a response back
    return NextResponse.json(
      { message: 'Form data received successfully', data },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*', // Adjust this to your Wix domain in production
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error processing Wix form data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  // Handle CORS preflight request
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this to your Wix domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

export async function GET() {
  // Handle unsupported GET method
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
