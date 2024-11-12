import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'AIzaSyB24BVebnlHWYaU-jAUrLa15ow8uDJ17B0';  // Ganti dengan API Key kamu
const SPREADSHEET_ID = '16f6FJ-53dwaWp8h25nS6fo36gs4SUaO6A4Oj0V4zzu4';  // Ganti dengan ID Google Sheets kamu
const SHEET_NAME = 'FormulirAssesment';  // Ganti dengan nama sheet yang sesuai

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validasi data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Log data yang diterima
    console.log('Received Wix form data:', data);

    // Siapkan data yang akan disimpan ke Google Sheets
    const row = [
      data.namaLokasi,
      data.cordinate,
      // Tambahkan data lain sesuai kebutuhan
    ];

    // Kirim data ke Google Sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:append?valueInputOption=RAW&key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row], // Data yang akan ditambahkan
        }),
      }
    );

    // Periksa jika ada kesalahan dalam mengirim data
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
      return NextResponse.json({ error: 'Failed to add data to Google Sheets' }, { status: 500 });
    }

    // Jika berhasil, kirimkan respon sukses
    return NextResponse.json(
      { message: 'Form data received and added to Google Sheets', data },
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

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Adjust this to your Wix domain in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
