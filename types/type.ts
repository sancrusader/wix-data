import { Location } from '../app/page'

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.NEXT_PUBLIC_SPREADS_SHEETS_ID}/values/Data%20Assessment!A2:EN?key=${process.env.NEXT_PUBLIC_SPREADS_SHEETS_KEY}`)
  const data = await response.json()
  const rows = data.values

  return rows.map((row: string[]): Location => {
    const [lat, lng] = row[1].split(',').map(Number)
    return {
      name: row[0] || '',
      lat,
      lng,
      volunteer: row[2],
      phone: row[3],
      date: row[4],
      rumahRusakBerat: parseInt(row[5]),
      rumahRusakSedang: parseInt(row[6]),
      rumahRusakRingan: parseInt(row[7]),
      sekolahRusakBerat: parseInt(row[8]),
      sekolahRusakSedang: parseInt(row[9]),
      sekolahRusakRingan: parseInt(row[10]),
      faskesBerat: parseInt(row[11]),
      faskesSedang: parseInt(row[12]),
      faskesRingan: parseInt(row[13]),
      jumlahKK: parseInt(row[14]),
      jumlahJiwa: parseInt(row[15]),
      jumlahPria: parseInt(row[16]),
      jumlahWanita: parseInt(row[17]),
      bayi: parseInt(row[18]),
      balita: parseInt(row[19]),
      ibuHamil: parseInt(row[20]),
      lansia: parseInt(row[21]),
      kkIslam: parseInt(row[22]),
      kkKristen: parseInt(row[23]),
      kkAgamaLain: parseInt(row[24]),
      anakTanpaPendamping: parseInt(row[25]),
      lansiaTanpaPendamping: parseInt(row[26]),
      penyakitKronis: parseInt(row[27]),
      kepalaKeluargaPerempuan: parseInt(row[28]),
      disabilitas: parseInt(row[29]),
      jumlahKematian: parseInt(row[30]),
      jumlahLukaLuka: parseInt(row[31]),
      jumlahOrangHilang: parseInt(row[32]),
    }
  })
}
