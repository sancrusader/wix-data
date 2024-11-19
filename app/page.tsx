'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Home, Users, Activity, MapPin, Phone, Calendar, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import KunIcon from '@/components/icon'
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/location'
import L from 'leaflet';
import DynamicMap from './DynamicMap'; // Adjust the import path as necessary

export default function DisasterHealthDashboard() {
  const [jumlahData, setJumlahData] = useState(0); 
  const mapInstance = useRef<L.Map | null>(null);
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/16f6FJ-53dwaWp8h25nS6fo36gs4SUaO6A4Oj0V4zzu4/values/Data%20Assessment!A2:EN?key=AIzaSyDE91NcMJV-41M7jDExssNNAXJN5I7LnnE
      `)
      const data = await response.json()
      const rows = data.values;
      setJumlahData(rows.length);
       // Menghitung jumlah baris
      // console.log(`Jumlah data: ${jumlahData}`); 
      const parsedLocations = rows.map((row: string[]) => ({
        name: row[0],
        lat: parseFloat(row[1].split(',')[0]),
        lng: parseFloat(row[1].split(',')[1]),
        volunteer: row[2],
        phone: row[3],
        date: row[4],
        rumahRusakBerat: row[5],
        rumahRusakSedang: row[6],
        rumahRusakRingan: row[7],
        sekolahRusakBerat: row[8],
        sekolahRusakSedang: row[9],
        sekolahRusakRingan: row[10],
        faskesBerat: row[11],
        faskesSedang: row[12],
        faskesRingan: row[13],
        fasumBerat: row[14],
        fasumSedang: row[15],
        fasumRingan: row[16],
        jumlahKK: row[17],
        jumlahJiwa: row[18],
        jumlahPria: row[19],
        jumlahWanita: row[20],
        bayi: row[21],
        balita: row[22],
        ibuHamil: row[23],
        lansia: row[24],
        kkIslam: row[25],
        kkKristen: row[26],
        kkAgamaLain: row[27],
        anakTanpaPendamping: row[28],
        lansiaTanpaPendamping: row[29],
        penyakitKronis: row[30],
        kepalaKeluargaPerempuan: row[31],
        disabilitas: row[32],
        fisik: row[33],
        mental: row[34],
        jumlahKematian: row[35],
        jumlahLukaLuka: row[36],
        jumlahOrangHilang: row[37],
        bentukShelter: row[38],
        luasShelter: row[39],
        bahanAtap: row[40],
        bahanAlas: row[41],
        privacyArea: row[42],
        peralatanTidur: row[43],
        deskripsiShelter: row[44],
        fotoTampakDepanShelter: row[45],
        fotoTampakSampingShelter: row[46],
        fotoTampakBelakangShelter: row[47],
        jenisDapur: row[48],
        lokasiDapur: row[49],
        peralatanDapur: row[50],
        bahanBakar: row[51],
        deskripsiDapur: row[52],
        fotoDapurDepan: row[53],
        fotoDapurSamping: row[54],
        fotoDapurBelakang: row[55],
        // Wash
        fotoAir: row[56],
        jenisSumberAir: row[57],
        jarakSumberAir: row[58],
        volumeAir: row[59],
        jumlahKeran: row[60],
        deskripsiKelayakanAir: row[61],
        fotoTampakDepanWc: row[62],
        fotoTampakBelakangWc: row[63],
        fotoTampakSampingWc: row[64],
        jarakKeShelter: row[65],
        jumlahWC: row[66],
        jumlahWCBerfungsi: row[67],
        pemisahanGenderWC: row[68],
        jumlahWCPria: row[69],
        jumlahWCWanita: row[70],
        deskripsiWC: row[71],
        ketersediaanHygieneKit: row[72],
        gratisBeli: row[73],
        asalHygieneKit: row[74],
        pembalutWanita: row[75],
        popokBayi: row[76],
        deskripsiHygenkit: row[77],
        tempatPembuanganSampah: row[78],
        pemisahanJenisSampah: row[79],
        pengelolaanSampah: row[80],
        deskripsiSampah: row[81],
        adaTidakPenyuluh: row[82],
        siapaPenyuluh: row[83],
        fotoPenyuluh: row[84],
        
        // Kesehatan (Health)
        fotoKesehatan: row[85],
        tersediaTidakKesehatan: row[86],  // Indeks diperbaiki ke 86
        jumlahTenagaKesehatan: row[87],    // Indeks diperbaiki ke 87
        asalTenagaKesehatan: row[88],      // Indeks diperbaiki ke 88
        namaTenagaKesehatan: row[89],      // Indeks diperbaiki ke 89
        asalObat: row[90],                 // Indeks diperbaiki ke 90
        biayaPelayanan: row[91],           // Indeks diperbaiki ke 91
        deskripsiKesehatan: row[92],       // Indeks diperbaiki ke 92
        
        // Penyakit
        jenisPenyakitTerbanyak: row[93],   // Indeks diperbaiki ke 93
        penyakitMenular: row[94],          // Indeks diperbaiki ke 94
        korbanMeninggal: row[95],          // Indeks diperbaiki ke 95
        penyebabMeninggal: row[96],        // Indeks diperbaiki ke 96
        deskripsiPenyakit: row[97],        // Indeks diperbaiki ke 97
        
        // Penyuluhan Kesehatan
        adaTidakPenyuluhanKesehatan: row[98],  // Indeks diperbaiki ke 98
        materiPenyuluhan: row[99],             // Indeks diperbaiki ke 99
        pelaksanaPenyuluhan: row[100],         // Indeks diperbaiki ke 100
        frekuensiPenyuluhan: row[101],         // Indeks diperbaiki ke 101
        deskripsiPenyuluhan: row[102],         // Indeks diperbaiki ke 102
        
        // Posko Konseling Mental Dan Psikososial
        adaTidakPosko: row[103],               // Indeks diperbaiki ke 103
        pelaksanaKonseling: row[104],          // Indeks diperbaiki ke 104
        frekuensiKonseling: row[105],          // Indeks diperbaiki ke 105
        deskripsiPoskoKonseling: row[106],     // Indeks diperbaiki ke 106
        
        // Kasus Kesehatan Mental
        adaTidakKasusKesehatan: row[107],     // Indeks diperbaiki ke 107
        penangananKesehatanMental: row[108],   // Indeks diperbaiki ke 108
        deskripsKesehatanMental: row[109],     // Indeks diperbaiki ke 109
        
        // Posko layanan/bantuan orang hilang atau terpisah dari keluarga
        adaTidakPoskoLayananOrangHilang: row[110],  // Indeks diperbaiki ke 110
        anakTanpaPendampingJumlah: row[111],        // Indeks diperbaiki ke 111
        deskripsiPoskoLayanan: row[112],            // Indeks diperbaiki ke 112
        
        // Jenis Ancaman
        AdaTidakAncaman: row[113],                  // Indeks diperbaiki ke 113
        ancamanAlami: row[114],                     // Indeks diperbaiki ke 114
        jenisAncaman: row[115],                     // Indeks diperbaiki ke 115
        bangunanTidakAman: row[116],                // Indeks diperbaiki ke 116
        ancamanLain: row[117],                     // Indeks diperbaiki ke 117
        
        // EARLY WARNING SYSTEM
        peringatanDini: row[118],                   // Indeks diperbaiki ke 118
        tersediaTidakEarly: row[119],               // Indeks diperbaiki ke 119
        sumberInformasi: row[120],                  // Indeks diperbaiki ke 120
        penyampaiInformasi: row[121],               // Indeks diperbaiki ke 121
        rencanaEvakuasi: row[122],                  // Indeks diperbaiki ke 122
        deskripsiEWS: row[123],                     // Indeks diperbaiki ke 123
        fotoEWS: row[124],                          // Indeks diperbaiki ke 124
        videoEWS: row[125],    
        kebutuhanMendesak: row[126],                      // Indeks diperbaiki ke 125        

      }))

      setLocations(parsedLocations)
    }

    fetchData()
  }, [])

  

  
  // const totalRumahRusak = locations.reduce((sum, loc) => 
  //   sum + 
  //   (Number(loc.rumahRusakBerat) || 0) + 
  //   (Number(loc.rumahRusakSedang) || 0) + 
  //   (Number(loc.rumahRusakRingan) || 0) +
  //   (Number(loc.sekolahRusakBerat) || 0) +
  //   (Number(loc.sekolahRusakRingan) || 0) +
  //   (Number(loc.sekolahRusakSedang) || 0 ) +
  //   (Number(loc.faskesBerat) || 0 ) +
  //   (Number(loc.faskesRingan) || 0 ) +
  //   (Number(loc.faskesSedang) || 0 ) +
  //   (Number(loc.fasumBerat) || 0 ) +
  //   (Number(loc.fasumSedang) || 0 ) +
  //   (Number(loc.fasumRingan) || 0 ), 0);

    const totalKematian = locations.reduce((sum, loc) => 
    sum + (Number(loc.jumlahKematian) || 0), 0);


    const filteredLocations = locations.filter(location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  return (
    <div className="container mx-auto py-8 space-y-8">
  <div className="flex items-center justify-center space-x-4">
    <KunIcon />
  </div>
    <h1 className="text-4xl text-center font-bold text-primary">Dashboard Kesehatan Bencana</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tiktik Pengungsian</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jumlahData}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penduduk</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">17</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Jumlah Kematian</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalKematian}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Peta Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
               <DynamicMap 
                  locations={locations} 
                  setSelectedLocation={setSelectedLocation} 
                />
            
              {selectedLocation ? (
                <div className="space-y-4 mb-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="text-primary" />
                    <span className="font-semibold">{selectedLocation.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="text-yellow-500" />
                    <span>Relawan: {selectedLocation.volunteer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="text-green-500" />
                    <span>Phone: {selectedLocation.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-blue-500" />
                    <span>Date: {selectedLocation.date}</span>
                  </div>
                  <Tabs defaultValue="kerusakan" className="w-full">
                    {/* Tab List */}
                  <TabsList className="grid w-full grid-cols-9"> 
                    <TabsTrigger value="kerusakan">Kerusakan</TabsTrigger> 
                    <TabsTrigger value="demografi">Demografi</TabsTrigger> 
                    <TabsTrigger value="shelter">Shelter</TabsTrigger> 
                    <TabsTrigger value="wash">Wash</TabsTrigger> 
                    <TabsTrigger value="kesehatan">Kesehatan</TabsTrigger> 
                    <TabsTrigger value="kesehatanMental">kesehatan M</TabsTrigger> 
                    <TabsTrigger value="child">Child</TabsTrigger> 
                    <TabsTrigger value="Hazard">Hazard</TabsTrigger> 
                    <TabsTrigger value="Early">Early </TabsTrigger> 
                  </TabsList>
                    {/*  Kerusakan */}
                    <TabsContent value="kerusakan">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Jenis Kerusakan</TableHead>
                              <TableHead>Jumlah</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Rumah Rusak Berat</TableCell>
                              <TableCell>{selectedLocation.rumahRusakBerat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Rumah Rusak Sedang</TableCell>
                              <TableCell>{selectedLocation.rumahRusakSedang}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Rumah Rusak Ringan</TableCell>
                              <TableCell>{selectedLocation.rumahRusakRingan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sekolah Rusak Berat</TableCell>
                              <TableCell>{selectedLocation.sekolahRusakBerat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sekolah Rusak Sedang</TableCell>
                              <TableCell>{selectedLocation.sekolahRusakSedang}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sekolah Rusak Ringan</TableCell>
                              <TableCell>{selectedLocation.sekolahRusakRingan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fasilitas Kesehatan Rusak Berat</TableCell>
                              <TableCell>{selectedLocation.faskesBerat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fasilitas Kesehatan Rusak Sedang</TableCell>
                              <TableCell>{selectedLocation.faskesSedang}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fasilitas Kesehatan Rusak Ringan</TableCell>
                              <TableCell>{selectedLocation.faskesRingan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fasilitas Umum Lainnya Rusak Berat</TableCell>
                              <TableCell>{selectedLocation.fasumBerat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fasilitas Umum Lainnya Rusak Sedang</TableCell>
                              <TableCell>{selectedLocation.fasumSedang}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fasilitas Umum Lainnya Rusak Ringan</TableCell>
                              <TableCell>{selectedLocation.fasumRingan}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Data Demografi */}
                    <TabsContent value="demografi">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data Demografi</TableHead>
                              <TableHead>Jumlah</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah KK</TableCell>
                              <TableCell>{selectedLocation.jumlahKK}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Jiwa</TableCell>
                              <TableCell>{selectedLocation.jumlahJiwa}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Pria</TableCell>
                              <TableCell>{selectedLocation.jumlahPria}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Wanita</TableCell>
                              <TableCell>{selectedLocation.jumlahWanita}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Bayi (0-12 bulan)</TableCell>
                              <TableCell>{selectedLocation.bayi}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Balita (1-5 tahun)</TableCell>
                              <TableCell>{selectedLocation.balita}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ibu Hamil</TableCell>
                              <TableCell>{selectedLocation.ibuHamil}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Lansia</TableCell>
                              <TableCell>{selectedLocation.lansia}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">KK Islam</TableCell>
                              <TableCell>{selectedLocation.kkIslam}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">KK Kristen</TableCell>
                              <TableCell>{selectedLocation.kkKristen}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">KK Agama Lain</TableCell>
                              <TableCell>{selectedLocation.kkAgamaLain}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Anak dibawah umur tanpa pendamping/terpisah dari keluarga</TableCell>
                              <TableCell>{selectedLocation.anakTanpaPendamping}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Lansia tanpa pendamping/terpisah dari keluarga</TableCell>
                              <TableCell>{selectedLocation.lansiaTanpaPendamping}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Memiliki penyakit kronis</TableCell>
                              <TableCell>{selectedLocation.penyakitKronis}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Kepala Keluarga Perempuan</TableCell>
                              <TableCell>{selectedLocation.kepalaKeluargaPerempuan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Disabilitas/difadel</TableCell>
                              <TableCell>{selectedLocation.disabilitas}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Fisik</TableCell>
                              <TableCell>{selectedLocation.fisik}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Mental</TableCell>
                              <TableCell>{selectedLocation.mental}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Shelter */}
                    <TabsContent value="shelter">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Shelter</TableHead>
                              <TableHead>Jumlah/Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Bentuk Shelter</TableCell>
                              <TableCell>{selectedLocation.bentukShelter}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Luas Shelter</TableCell>
                              <TableCell>{selectedLocation.luasShelter}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Bahan Atap</TableCell>
                              <TableCell>{selectedLocation.bahanAtap}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Bahan Alas</TableCell>
                              <TableCell>{selectedLocation.bahanAlas}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Privacy Area</TableCell>
                              <TableCell>{selectedLocation.privacyArea}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Peralatan tidur</TableCell>
                              <TableCell>{selectedLocation.peralatanTidur}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiShelter}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tampak Depan Shelter</TableCell>
                              <TableCell>{selectedLocation.fotoTampakDepanShelter}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tampak Belakang Shelter</TableCell>
                              <TableCell>{selectedLocation.fotoTampakDepanShelter}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tampak Samping</TableCell>
                              <TableCell>{selectedLocation.fotoTampakSampingShelter}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Peralatan Dapur</TableCell>
                              <TableCell>{selectedLocation.peralatanDapur}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Bahan Bakar</TableCell>
                              <TableCell>{selectedLocation.bahanBakar}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi Dapur</TableCell>
                              <TableCell>{selectedLocation.deskripsiDapur}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tampak Depan Dapur</TableCell>
                              <TableCell>{selectedLocation.fotoDapurDepan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tampak Samping Dapur</TableCell>
                              <TableCell>{selectedLocation.fotoDapurSamping}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tampak Belakang Dapur</TableCell>
                              <TableCell>{selectedLocation.fotoDapurBelakang}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Wash */}
                    <TabsContent value="wash">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>WaSH (Water and Sanitasion Hygiene)</TableHead>
                              <TableHead>Jumlah/Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Foto Air</TableCell>
                              <TableCell>{selectedLocation.fotoAir}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jenis Sumber Air</TableCell>
                              <TableCell>{selectedLocation.jenisSumberAir}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jarak Sumber Air ke Shelter</TableCell>
                              <TableCell>{selectedLocation.jarakSumberAir}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Volume Air</TableCell>
                              <TableCell>{selectedLocation.volumeAir}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Keran</TableCell>
                              <TableCell>{selectedLocation.jumlahKeran}</TableCell>
                            </TableRow>
                            <TableRow className='mb-4'>
                              <TableCell className="font-medium">Deskripsi Kelayakan Air</TableCell>
                              <TableCell>{selectedLocation.deskripsiKelayakanAir}</TableCell>
                            </TableRow>
                            {/* Wc */}
                            <TableRow>
                              <TableCell className="font-medium"><Badge>WC</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Wc tampak Depan</TableCell>
                              <TableCell>{selectedLocation.fotoTampakDepanWc}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Wc tampak Samping</TableCell>
                              <TableCell>{selectedLocation.fotoTampakSampingWc}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Wc Tampak Belakang</TableCell>
                              <TableCell>{selectedLocation.fotoTampakBelakangWc}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah WC</TableCell>
                              <TableCell>{selectedLocation.jumlahWC}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah WC berfungsi</TableCell>
                              <TableCell>{selectedLocation.jumlahWCBerfungsi}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pemisahan gender WC</TableCell>
                              <TableCell>{selectedLocation.pemisahanGenderWC}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah WC Pria</TableCell>
                              <TableCell>{selectedLocation.jumlahWCPria}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah WC Wanita</TableCell>
                              <TableCell>{selectedLocation.jumlahWCWanita}</TableCell>
                            </TableRow>
                              {/* Kategori Hygiene Kit */}
                            
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Hygiene Kit</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ketersediaan</TableCell>
                              <TableCell>{selectedLocation.ketersediaanHygieneKit}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Gratis / Beli</TableCell>
                              <TableCell>{selectedLocation.gratisBeli}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Hygiene Kit</TableCell>
                              <TableCell>{selectedLocation.asalHygieneKit}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pembalut Wanita</TableCell>
                              <TableCell>{selectedLocation.pembalutWanita}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Popok Bayi</TableCell>
                              <TableCell>{selectedLocation.popokBayi}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi Hygenkit</TableCell>
                              <TableCell>{selectedLocation.deskripsiHygenkit}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Sampah</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tempat Pembuangan Sampah</TableCell>
                              <TableCell>{selectedLocation.tempatPembuanganSampah}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pemisahan Jenis Sampah</TableCell>
                              <TableCell>{selectedLocation.pemisahanJenisSampah}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pengelolaan Sampah</TableCell>
                              <TableCell>{selectedLocation.pengelolaanSampah}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi Sampah</TableCell>
                              <TableCell>{selectedLocation.deskripsiSampah}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyuluhan Kebersihan</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada / Tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPenyuluh}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Siapa Penyuluh</TableCell>
                              <TableCell>{selectedLocation.siapaPenyuluh}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Penyuluh</TableCell>
                              <TableCell>{selectedLocation.fotoPenyuluh}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Kesehatan Mental */}
                    <TabsContent value="kesehatan">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kesehatan</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Foto</TableCell>
                              <TableCell>{selectedLocation.fotoKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tersedoa Tidak</TableCell>
                              <TableCell>{selectedLocation.tersediaTidakKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.jumlahTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.asalTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Nama Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.namaTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Obat</TableCell>
                              <TableCell>{selectedLocation.asalObat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Biaya Pelayanan</TableCell>
                              <TableCell>{selectedLocation.biayaPelayanan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyakit</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jenis Penyakit Terbanyak</TableCell>
                              <TableCell>{selectedLocation.jenisPenyakitTerbanyak}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyakit Menular</TableCell>
                              <TableCell>{selectedLocation.penyakitMenular}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Korban Meninggal</TableCell>
                              <TableCell>{selectedLocation.korbanMeninggal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyebab Meninggal</TableCell>
                              <TableCell>{selectedLocation.penyebabMeninggal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPenyakit}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyuluhan Kesehatan</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada/Tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPenyuluhanKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Materi</TableCell>
                              <TableCell>{selectedLocation.materiPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pelaksana</TableCell>
                              <TableCell>{selectedLocation.pelaksanaPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Frekuensi</TableCell>
                              <TableCell>{selectedLocation.frekuensiPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPenyuluhan}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="kesehatanMental">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kesehatan Mental</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Ada/tidak (salah satu atau keduanya)</TableCell>
                              <TableCell>{selectedLocation.adaTidakPosko}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pelaksana Layanan Konseling/Psikososial (salah satu atau keduanya)</TableCell>
                              <TableCell>{selectedLocation.pelaksanaKonseling}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pelaksana Layanan Konseling/Psikososial (salah satu atau keduanya)</TableCell>
                              <TableCell>{selectedLocation.pelaksanaKonseling}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Frekuensi</TableCell>
                              <TableCell>{selectedLocation.frekuensiKonseling}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPoskoKonseling}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Kasus Kesehatan Mental</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada/tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakKasusKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penanganan</TableCell>
                              <TableCell>{selectedLocation.penangananKesehatanMental}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsKesehatanMental}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="child">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Anak tanpa pendamping/yang terpisah dari keluarga</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Ada/tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPoskoLayananOrangHilang}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tersedia / Tidak</TableCell>
                              <TableCell>{selectedLocation.tersediaTidakKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.jumlahTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.asalTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Nama Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.namaTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Obat</TableCell>
                              <TableCell>{selectedLocation.asalObat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Biaya Pelayanan</TableCell>
                              <TableCell>{selectedLocation.biayaPelayanan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyakit</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jenis Penyakit Terbanyak</TableCell>
                              <TableCell>{selectedLocation.jenisPenyakitTerbanyak}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyakit Menular</TableCell>
                              <TableCell>{selectedLocation.penyakitMenular}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Korban Meninggal</TableCell>
                              <TableCell>{selectedLocation.korbanMeninggal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyebab Meninggal</TableCell>
                              <TableCell>{selectedLocation.penyebabMeninggal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPenyakit}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyuluhan Kesehatan</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada/Tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPenyuluhanKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Materi</TableCell>
                              <TableCell>{selectedLocation.materiPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pelaksana</TableCell>
                              <TableCell>{selectedLocation.pelaksanaPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Frekuensi</TableCell>
                              <TableCell>{selectedLocation.frekuensiPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPenyuluhan}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="Hazard">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kesehatan</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Foto Kesehatan</TableCell>
                              <TableCell>{selectedLocation.fotoKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tersedia / Tidak</TableCell>
                              <TableCell>{selectedLocation.tersediaTidakKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.jumlahTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.asalTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Nama Tenaga Kesehatan</TableCell>
                              <TableCell>{selectedLocation.namaTenagaKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Asal Obat</TableCell>
                              <TableCell>{selectedLocation.asalObat}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Biaya Pelayanan</TableCell>
                              <TableCell>{selectedLocation.biayaPelayanan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyakit</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jenis Penyakit Terbanyak</TableCell>
                              <TableCell>{selectedLocation.jenisPenyakitTerbanyak}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyakit Menular</TableCell>
                              <TableCell>{selectedLocation.penyakitMenular}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Korban Meninggal</TableCell>
                              <TableCell>{selectedLocation.korbanMeninggal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyebab Meninggal</TableCell>
                              <TableCell>{selectedLocation.penyebabMeninggal}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPenyakit}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyuluhan Kesehatan</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada/Tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPenyuluhanKesehatan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Materi</TableCell>
                              <TableCell>{selectedLocation.materiPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pelaksana</TableCell>
                              <TableCell>{selectedLocation.pelaksanaPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Frekuensi</TableCell>
                              <TableCell>{selectedLocation.frekuensiPenyuluhan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPenyuluhan}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="Early">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kesehatan</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Peringatan Dini</TableCell>
                              <TableCell>{selectedLocation.peringatanDini}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Tersedia/tidak</TableCell>
                              <TableCell>{selectedLocation.tersediaTidakEarly}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sumber Informasi</TableCell>
                              <TableCell>{selectedLocation.sumberInformasi}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Penyampai Informasi</TableCell>
                              <TableCell>{selectedLocation.penyampaiInformasi}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Rencana Evakuasi</TableCell>
                              <TableCell>{selectedLocation.rencanaEvakuasi}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiEWS}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Video</TableCell>
                              <TableCell>{selectedLocation.videoEWS}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto</TableCell>
                              <TableCell>{selectedLocation.fotoEWS}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Kebutuhan Mendesak</TableCell>
                              <TableCell>{selectedLocation.kebutuhanMendesak}</TableCell>
                            </TableRow> 
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Pilih lokasi pada peta atau daftar untuk melihat detail</p>
              )}
            
          
          </CardContent>
        </Card>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Cari Lokasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Search className="text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[300px] mt-4">
                {filteredLocations.map((location, index) => (
                  <Button
                    key={location.name || index}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedLocation(location);
                      if (mapInstance.current) {
                        mapInstance.current.setView([location.lat, location.lng], 12);
                      }
                    }}
                  >
                    {location.name}
                  </Button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
          
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      </div>
    </div>
  )
}


