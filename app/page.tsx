'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Users, MapPin, Phone, Calendar, Search,User,Dna } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import KunIcon from '@/components/icon'
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/location'
import L from 'leaflet';
import DynamicMap from './DynamicMap';

export default function DisasterHealthDashboard() {
  const [jumlahData, setJumlahData] = useState(0)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const mapInstance = useRef<L.Map | null>(null);
  // const [jumlahLembaga, setJumlahLembaga] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/16f6FJ-53dwaWp8h25nS6fo36gs4SUaO6A4Oj0V4zzu4/values/Data%20Assessment!A2:EU?key=AIzaSyDE91NcMJV-41M7jDExssNNAXJN5I7LnnE
      `)
      const data = await response.json()
      const rows = data.values || [];
      setJumlahData(rows.length);
      const parsedLocations = rows.map((row: string[]) => {
        const convertImageUrl = (url: string) => {
          if (url && url.includes("wix:image://")) {
            const wixImageId = url.split("wix:image://v1/")[1].split("/")[0];
            // Membuat URL yang dapat diakses publik
            return `https://static.wixstatic.com/media/${wixImageId}`;
          }
          return url;
        };




        return {
          // Nama Lokasi
          name: row[0],
          // Coordinate
          lat: parseFloat(row[1].split(',')[0]),
          lng: parseFloat(row[1].split(',')[1]),
          // Nama Relawan
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
          fotoTampakDepanShelter: convertImageUrl(row[45]),
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
          fotoAir: convertImageUrl(row[56]),
          jenisSumberAir: row[57],
          jarakSumberAir: row[58],
          volumeAir: row[59],
          jumlahKeran: row[60],
          deskripsiKelayakanAir: row[61],
          fotoTampakDepanWc: convertImageUrl(row[62]),
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
          fotoKesehatan: convertImageUrl(row[85]),
          tersediaTidakKesehatan: row[86],
          jumlahTenagaKesehatan: row[87],
          asalTenagaKesehatan: row[88],
          namaTenagaKesehatan: row[89],
          asalObat: row[90],
          biayaPelayanan: row[91],
          deskripsiKesehatan: row[92],
          
          // Penyakit
          jenisPenyakitTerbanyak: row[93],
          penyakitMenular: row[94],
          korbanMeninggal: row[95],
          penyebabMeninggal: row[96],
          deskripsiPenyakit: row[97],
          
          // Penyuluhan Kesehatan
          adaTidakPenyuluhanKesehatan: row[98],
          materiPenyuluhan: row[99],
          pelaksanaPenyuluhan: row[100],
          frekuensiPenyuluhan: row[101],
          deskripsiPenyuluhan: row[102],
          
          // Posko Konseling Mental Dan Psikososial
          adaTidakPosko: row[103],
          pelaksanaKonseling: row[104],
          frekuensiKonseling: row[105],
          deskripsiPoskoKonseling: row[106],
          
          // Kasus Kesehatan Mental
          adaTidakKasusKesehatan: row[107],
          penangananKesehatanMental: row[108],
          deskripsKesehatanMental: row[109],
          
          // Anak tanpa pendamping/yang terpisah dari keluarga
          adaTidakAnakTanpaPendamping: row[110],
          jumlahAnakTanpaPendamping: row[111],
          deskripsiAnakTanpaPendamping: row[112],

          // Posko layanan/bantuan orang hilang atau terpisah dari keluarga
          adaTidakPoskoLayananOrangHilang: row[113],
          pelaksanaLayanan: row[114],  
          deskripsiPoskoLayanan: row[115],
          // Jenis Ancaman
          AdaTidakAncaman: row[116],                
          ancamanAlami: row[117],                               
          bangunanTidakAman: row[118],               
          ancamanLain: row[119],
          
          // EARLY WARNING SYSTEM
          peringatanDini: row[120],
          tersediaTidakEarly: row[121],
          sumberInformasi: row[122],
          penyampaiInformasi: row[123],
          rencanaEvakuasi: row[124],
          deskripsiEWS: row[125],
          fotoEWS: convertImageUrl(row[126]),
          videoEWS: convertImageUrl(row[127]),
          kebutuhanMendesak: row[128],
          
          // Tim Medis Posko Pengungsian
          namaPoskoPengungsian: row[129],
          namaPetugas: row[130],
          noTelephone: row[131],
          namaPenanggungJawab: row[132],
          NoPenanggungJawab: row[133],
          namaLembaga: row[134],
          tanggalMasuk: row[135],
          mulaiJamPelayanan: row[136],
          akhirJamPelayanan: row[137],
          totalPelayanan: row[138],
          jadwalPelayanan: row[139],
          kebutuhanMendesakPosko: row[140],

          // 5 Penyskit Tertinggi
          namaPenyakit1: row[141],
          jumlahPenyakit1: row[142],

          namaPenyakit2: row[143],
          jumlahPenyakit2: row[144],

          namaPenyakit3: row[145],
          jumlahPenyakit3: row[146],

          namaPenyakit4: row[147],
          jumlahPenyakit4: row[148],

          namaPenyakit5: row[149],
          jumlahPenyakit5: row[150],

        }
      });
      

      setLocations(parsedLocations)
    }

    fetchData()
  }, [])



  
  // Menghitung jumlah lembaga
  const totalNamaLembaga = locations.reduce((sum, loc) => {
    const isValid = loc.namaLembaga && typeof loc.namaLembaga === "string" && loc.namaLembaga.trim() !== "";
    return sum + (isValid ? 1 : 0);
  }, 0);

  const totalPetugas = locations.reduce((sum, loc) => {
    const isValid = loc.namaPetugas && typeof loc.namaPetugas === "string" && loc.namaPetugas.trim() !== "";
    return sum + (isValid ? 1 : 0);
  }, 0);
  
  
  
    // const totalKematian = locations.reduce((sum, loc) => 
    // sum + (Number(loc.jumlahKematian) || 0), 0);

    const filteredLocations = locations.filter(location =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPenduduk = locations.reduce((sum, loc) => {
      // Menambahkan jumlahWanita, jumlahPria, dan jumlahKK dari setiap volunteer
      return sum + (Number(loc.jumlahKK) || 0);
    }, 0);

    const totalPelayananData = locations.reduce((sum, loc) => {
      // Menambahkan jumlahWanita, jumlahPria, dan jumlahKK dari setiap volunteer
      return sum + (Number(loc.totalPelayanan) || 0);
    }, 0);
    

  return (
    <div className="container mx-auto py-8 space-y-8">
  <div className="flex items-center justify-center space-x-4">
    <KunIcon/>
  </div>
  {/* <ModeToggle/> */}
    <h1 className="text-5xl text-center font-bold text-primary">Dashboard Bencana</h1>
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
            <CardTitle className="text-sm font-medium">Total Penduduk/KK</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPenduduk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lembaga</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNamaLembaga}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Petugas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPetugas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelayanan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPelayananData}</div>
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
                    <User className="text-yellow-500" />
                    <span>Relawan: {selectedLocation.volunteer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="text-green-500" />
                    <span>Phone: {selectedLocation.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-green-500" />
                    <span>Nama Petugas: {selectedLocation.namaPetugas}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-blue-500" />
                    <span>Date: {selectedLocation.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dna className="text-blue-500" />
                    <span>5 Penyakit Tertinggi: {selectedLocation.namaPenyakit1}, {" "}
                    {selectedLocation.namaPenyakit2}, {" "}
                    {selectedLocation.namaPenyakit3},{" "}
                    {selectedLocation.namaPenyakit4},{" "}
                    {selectedLocation.namaPenyakit5} {" "}
                    </span>
                    
                  </div>
                  <Tabs defaultValue="data" className="w-full">
                    {/* Tab List */}
                  <TabsList className="grid w-full grid-cols-6"> 
                    <TabsTrigger value="data">Data Demografi</TabsTrigger> 
                    <TabsTrigger value="shelter">Shelter</TabsTrigger> 
                    <TabsTrigger value="wash">Wash</TabsTrigger> 
                    <TabsTrigger value="kesehatan">Kesehatan / Health</TabsTrigger> 
                    <TabsTrigger value="mental">Kesehatan Mental</TabsTrigger>
                    <TabsTrigger value="child">Child Protection</TabsTrigger>
                  </TabsList>
                    {/*  Data Demografi Posko Pengungsian */}
                    <TabsContent value="data">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Data Demografi Posko Pengungsian</TableHead>
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
                              <TableCell className="font-medium">Kepala keluarga perempuan</TableCell>
                              <TableCell>{selectedLocation.kepalaKeluargaPerempuan}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell colSpan={3}><Badge>Disabilitas/difabel</Badge></TableCell>
                            </TableRow>
                          
                            <TableRow>
                              <TableCell className="font-medium">Fisik</TableCell>
                              <TableCell>{selectedLocation.fisik}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Mental</TableCell>
                              <TableCell>{selectedLocation.mental}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Kematian</TableCell>
                              <TableCell>{selectedLocation.jumlahKematian}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Luka-luka (sedang ke : berat)</TableCell>
                              <TableCell>{selectedLocation.jumlahLukaLuka}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah Orang Hilang</TableCell>
                              <TableCell>{selectedLocation.jumlahOrangHilang}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Data Shelter */}
                    <TabsContent value="shelter">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Shelter</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Bentuk Shelter</TableCell>
                              <TableCell>{selectedLocation.bentukShelter}</TableCell>
                            </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Foto</TableCell>
                                <TableCell>
                                  <Link className='text-blue-500'
                                    href={selectedLocation.fotoTampakDepanShelter} 
                                    target='_blank'>
                                    Foto
                                  </Link>
                                </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* WaSH (Water and Sanitasion Hygiene) */}
                    <TabsContent value="wash">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Water and Sanitasion Hygiene</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                          <TableRow>
                              <TableCell className="font-medium"><Badge>Air</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto</TableCell>
                              <TableCell>
                                <Link className='text-blue-500' 
                                href={selectedLocation.fotoAir} >Foto
                                </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sumber Air</TableCell>
                              <TableCell>{selectedLocation.jenisSumberAir}</TableCell>
                            </TableRow>
                            
                            <TableRow>
                              <TableCell className="font-medium"><Badge>WC</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto</TableCell>
                              <TableCell>
                                <Link className='text-blue-500' 
                                href={selectedLocation.fotoTampakDepanWc} >
                                  Foto
                                </Link>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Jumlah WC</TableCell>
                              <TableCell>{selectedLocation.jumlahWC}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Sampah</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto Tempat Pembuangan Sampah</TableCell>
                              <TableCell>{selectedLocation.tempatPembuanganSampah}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium"><Badge>Penyuluhan Kebersihan</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada / Tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPenyuluh}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Siapa penyuluh</TableCell>
                              <TableCell>{selectedLocation.siapaPenyuluh}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Frequensi</TableCell>
                              <TableCell>{selectedLocation.frekuensiPenyuluhan}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Kesehatan / Health */}
                    <TabsContent value="kesehatan">
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kesehatan / Health</TableHead>
                              <TableHead>Keterangan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium" colSpan={3}><Badge>Posko Kesehatan Lapangan</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Foto</TableCell>
                              <TableCell>
                                <Link className='text-blue-500' 
                                href={selectedLocation.fotoKesehatan} >
                                  Foto
                                </Link>
                                </TableCell>
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
                              <TableCell className="font-medium">Pelayanan Kesehatan Terakhir</TableCell>
                              <TableCell>{selectedLocation.jumlahKeran}</TableCell>
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
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </TabsContent>
                    {/* Kesehatan Mental */}
                    <TabsContent value="mental">
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
                              <TableCell>
                                <Link className='text-blue-500' 
                                href={selectedLocation.fotoKesehatan} >
                                  Foto
                                </Link>
                                </TableCell>
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
                              <TableCell className="font-medium" colSpan={3}><Badge>Penyuluhan Kesehatan</Badge></TableCell>
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
                              <TableCell className="font-medium">Jumlah</TableCell>
                              <TableCell>{selectedLocation.anakTanpaPendampingJumlah}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPoskoLayanan}</TableCell>
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
                              <TableCell className="font-medium"><Badge>Posko layanan/bantuan orang hilang atau terpisah dari keluarga</Badge></TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Ada/tidak</TableCell>
                              <TableCell>{selectedLocation.adaTidakPoskoLayananOrangHilang}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Pelaksana layanan</TableCell>
                              <TableCell>{selectedLocation.pelaksanaLayanan}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Deskripsi</TableCell>
                              <TableCell>{selectedLocation.deskripsiPoskoLayanan}</TableCell>
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