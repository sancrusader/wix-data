import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID, SHEET_NAME } = process.env;

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log('Received data:', data);

        // Autentikasi Google Sheets API dengan OAuth2
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_CLIENT_EMAIL,
                private_key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Mengganti \n pada private key
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Ambil semua data dari sheet untuk mengecek apakah userId sudah ada
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: `${SHEET_NAME}!A:Z`,  // Ambil seluruh kolom sampai Z
        });

        const rows = res.data.values || [];
        const headers = rows[0] || [];  // Baris pertama adalah header
        console.log('Headers:', headers);

        // Normalisasi header untuk pencarian tidak case-sensitive dan spasi-insensitive
        const normalizedHeaders = headers.map(header =>
            header.toLowerCase().replace(/\s+/g, '')  // Ubah semua header menjadi lowercase dan hilangkan spasi
        );

        // Cari apakah userId sudah ada
        const userRowIndex = rows.findIndex((row) => row[0] === data.userId);
        console.log('Found userRowIndex:', userRowIndex);

        // Jika userId ditemukan, update kolom yang sesuai
        if (userRowIndex !== -1) {
            const existingRow = rows[userRowIndex];
            console.log('Existing row before update:', existingRow);

            // Menggabungkan data baru dengan data yang sudah ada
            const updatedRow = [...existingRow];

            Object.keys(data).forEach((key) => {
                const normalizedKey = key.toLowerCase().replace(/\s+/g, ''); // Ubah key menjadi lowercase dan hilangkan spasi
                const colIndex = normalizedHeaders.indexOf(normalizedKey);  // Cari index kolom berdasarkan header yang sudah dinormalisasi

                if (colIndex !== -1) {
                    updatedRow[colIndex] = data[key];  // Update nilai di kolom yang sesuai
                } else {
                    console.log(`Column ${key} not found in headers, adding new column.`);
                    // Jika kolom tidak ada, tambahkan ke kolom berikutnya
                    updatedRow.push(data[key]);
                    normalizedHeaders.push(normalizedKey); // Tambahkan header kolom baru
                }
            });

            // Tentukan range untuk update berdasarkan baris userId yang ditemukan
            const range = `${SHEET_NAME}!A${userRowIndex + 1}:Z${userRowIndex + 1}`;
            console.log('Updating range:', range);
            await sheets.spreadsheets.values.update({
                spreadsheetId: GOOGLE_SHEET_ID,
                range: range,
                valueInputOption: 'RAW',
                requestBody: { values: [updatedRow] },
            });

            return NextResponse.json(
                { message: 'Data successfully updated in Google Sheets', data: updatedRow },
                { status: 200 }
            );
        }

        // Jika userId tidak ditemukan, tambahkan data baru di baris terakhir
        const newRow = [
            data.userId,
            data.namaLokasi || '',
            data.cordinate || '',
            data.relawanPenginputData || '',
            data.noTelepon || '',
            data.tanggal || '',
            data.rumahRusakBerat || '',
            data.rusakSedang || '',
            data.rusakRingan || '',
            data.sekolahRusakBerat || '',
            data.sekolahRusakSedang || '',
            data.sekolahRusakRingan || '',
            data.FasilitasUmumLainnyaRusakBerat || '',
            
        ];

        const range = `${SHEET_NAME}!A${rows.length + 1}:Z${rows.length + 1}`;
        console.log('Adding new row:', newRow);
        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            requestBody: { values: [newRow] },
        });

        return NextResponse.json(
            { message: 'Data successfully added to Google Sheets', data: newRow },
            { status: 201 }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating Google Sheets:', error.message);
            return NextResponse.json(
                { message: 'Error updating Google Sheets', error: error.message },
                { status: 500 }
            );
        } else {
            console.error('Unknown error:', error);
            return NextResponse.json(
                { message: 'Unknown error occurred', error: 'Unknown error' },
                { status: 500 }
            );
        }
    }
}
