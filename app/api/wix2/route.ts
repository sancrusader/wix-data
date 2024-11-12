import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID, SHEET_NAME } = process.env;

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log('Received data:', data); // Log data yang diterima

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
        console.log('Headers:', headers); // Log headers untuk verifikasi kolom

        const userRowIndex = rows.findIndex((row) => row[0] === data.userId);  // Mencari userId di kolom A
        console.log('Found userRowIndex:', userRowIndex); // Log index baris yang ditemukan

        // Jika userId ditemukan, update hanya kolom yang relevan
        if (userRowIndex !== -1) {
            const existingRow = rows[userRowIndex];
            console.log('Existing row before update:', existingRow); // Log existing row sebelum update

            // Hanya memperbarui kolom yang ada di dalam data yang diterima
            const updatedRow = [...existingRow];

            Object.keys(data).forEach((key) => {
                const colIndex = headers.indexOf(key);  // Cari index kolom berdasarkan header
                console.log(`Updating column ${key} at index ${colIndex}`); // Log kolom yang sedang diupdate
                if (colIndex !== -1) {
                    updatedRow[colIndex] = data[key];  // Update nilai kolom yang sesuai
                }
            });

            const range = `${SHEET_NAME}!A${userRowIndex + 1}:Z${userRowIndex + 1}`; // Tentukan range berdasarkan row index
            console.log('Updating range:', range); // Log range yang akan diupdate
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
            data.namaLokasi,
            data.cordinate,
            data.relawanPenginputData,
            data.noTelepon,
            data.tanggal,
            data.rumahRusakBerat,
            data.rumahRusakSedang,
            data.rumahRusakRingan,
            data.sekolahRusakBerat,  // Field baru: Sekolah Rusak Berat
            data.sekolahRusakSedang, // Field baru: Sekolah Rusak Sedang
            data.sekolahRusakRingan, // Field baru: Sekolah Rusak Ringan
            data.fasilitasKesehatanRusakBerat,  // Field baru: Fasilitas Kesehatan Rusak Berat
            data.fasilitasKesehatanRusakSedang, // Field baru: Fasilitas Kesehatan Rusak Sedang
            data.fasilitasKesehatanRusakRingan // Field baru: Fasilitas Kesehatan Rusak Ringan
        ];

        const range = `${SHEET_NAME}!A${rows.length + 1}:Z${rows.length + 1}`; // Tentukan range untuk baris baru
        console.log('Adding new row:', newRow); // Log data baru yang akan ditambahkan
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
    } catch (error) {
        console.error('Error updating Google Sheets:', error);
        return NextResponse.json(
            { message: 'Error updating Google Sheets' },
            { status: 500 }
        );
    }
}
