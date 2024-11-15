'use client'

import { useState, useEffect, useRef } from 'react'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Home, Users, Activity, MapPin, Phone, Calendar, Search } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Badge } from '@/components/ui/badge'
import KunIcon from '@/components/icon'



interface Location {
  name: string;
  lat: number;
  lng: number;
  volunteer: string;
  phone: string;
  date: string;
  adaTidakKasusKesehatan: string
  rumahRusakBerat: number;
  rumahRusakSedang: number;
  rumahRusakRingan: number;
  sekolahRusakBerat: number;
  sekolahRusakSedang: number;
  sekolahRusakRingan: number;
  faskesBerat: number;
  faskesSedang: number;
  faskesRingan: number;
  fasumBerat: number;
  fasumSedang: number;
  fasumRingan: number;
  jumlahKK: number;
  jumlahJiwa: number;
  jumlahPria: number;
  jumlahWanita: number;
  bayi: number;
  balita: number;
  ibuHamil: number;
  lansia: number;
  kkIslam: number;
  kkKristen: number;
  kkAgamaLain: number;
  anakTanpaPendamping: number;
  lansiaTanpaPendamping: number;
  penyakitKronis: number;
  kepalaKeluargaPerempuan: number;
  disabilitas: number;
  mental: number;
  fisik: number;
  jumlahKematian: number;
  jumlahLukaLuka: number;
  jumlahOrangHilang: number;
  bentukShelter: string;
  luasShelter: string;
  bahanAtap: string;
  bahanAlas: string;
  privacyArea: string;
  peralatanTidur: string;
  deskripsiShelter: string;
  fotoTampakDepanShelter: string;
  fotoTampakSampingShelter: string;
  fotoTampakBelakangShelter: string;
  jenisDapur: string;
  lokasiDapur: string;
  peralatanDapur: string;
  bahanBakar: string;
  deskripsiDapur: string;
  fotoDapurDepan: string;
  fotoDapurSamping: string;
  fotoDapurBelakang: string;
  deskripsKesehatanMental: string
  fotoAir: string;
  jenisSumberAir: string;
  jarakSumberAir: string;
  volumeAir: string;
  jumlahKeran: string;
  deskripsiKelayakanAir: string;
  jarakKeShelter: string;
  jumlahWC: string;
  jumlahWCBerfungsi: string;
  pemisahanGenderWC: string;
  jumlahWCPria: string;
  jumlahWCWanita: string;
  deskripsiWC: string;
  ketersediaanHygieneKit: string;
  gratisBeli: string;
  asalHygieneKit: string;
  pembalutWanita: string;
  popokBayi: string;
  deskripsiHygenkit: string;
  tempatPembuanganSampah: string;
  pemisahanJenisSampah: string;
  pengelolaanSampah: string;
  penyuluhanKebersihan: string;
  deskripsiSampah: string;
  adaTidakPenyuluh: string;
  siapaPenyuluh: string;
  fotoPenyuluh:string;
  tersediaPosko: string;
  tersediaTidakKesehatan: string;
  jumlahTenagaKesehatan: string;
  asalTenagaKesehatan: string;
  namaTenagaKesehatan: string;
  asalObat: string;
  biayaPelayanan: string;
  deskripsiKesehatan: string;
  jenisPenyakitTerbanyak: string;
  penyakitMenular: string;
  korbanMeninggal: string;
  penyebabMeninggal: string;
  deskripsiPenyakit: string;
  adaTidakPenyuluhanKesehatan: string;
  materiPenyuluhan: string;
  pelaksanaPenyuluhan: string;
  frekuensiPenyuluhan: string;
  deskripsiPenyuluhan: string;
  adaTidakPosko: string;
  pelaksanaKonseling: string;
  frekuensiKonseling: string;
  deskripsiPoskoKonseling: string;
  penangananKesehatanMental: string;
  anakTanpaPendampingJumlah: string;
  adaTidakPoskoLayananOrangHilang: string;
  pelaksanaLayananOrangHilang: string;
  deskripsiPoskoLayanan: string;
  jenisAncaman: string;
  ancamanAlami: string;
  bangunanTidakAman: string;
  ancamanLain: string;
  peringatanDini: string;
  sumberInformasi: string;
  penyampaiInformasi: string;
  rencanaEvakuasi: string;
  deskripsiEWS: string;
  fotoEWS: string;
  videoEWS: string;
  fotoTampakDepanWc: string
  fotoTampakSampingWc: string
  fotoTampakBelakangWc: string
  fotoKesehatan: string
}



export default function DisasterHealthDashboard() {
  const mapRef = useRef(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/16f6FJ-53dwaWp8h25nS6fo36gs4SUaO6A4Oj0V4zzu4/values/Data%20Assessment!A2:EN?key=AIzaSyDE91NcMJV-41M7jDExssNNAXJN5I7LnnE
      `)
      const data = await response.json()
      const rows = data.values

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
        videoEWS: row[125]                          // Indeks diperbaiki ke 125        

      }))

      setLocations(parsedLocations)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (locations.length === 0) return

    const loadMap = async () => {
        if (typeof window !== 'undefined' && window.google && mapRef.current) {
          const { Map, InfoWindow } = await window.google.maps.importLibrary("maps") as google.maps.MapsLibrary
          const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker") as google.maps.MarkerLibrary

          // Tentukan batas wilayah Lewotobi
          const lewotobiBounds = new window.google.maps.LatLngBounds(
            { lat: -8.6, lng: 122.65 }, // Titik barat daya Lewotobi
            { lat: -8.4, lng: 122.8 }   // Titik timur laut Lewotobi (latitude utara lebih besar)
          );

          const map = new Map(mapRef.current, {
            center: { lat: -8.2, lng: 122}, // Titik pusat wilayah Lewotobi
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: false,
            zoomControl: true,
            scrollwheel: true,
            // draggable: false,
            minZoom: 11,
            // maxZoom: 13,
          })

          // Set bounds agar peta hanya menampilkan area Lewotobi
          map.fitBounds(lewotobiBounds)
          map.setOptions({
            restriction: {
              latLngBounds: lewotobiBounds, // Membatasi peta hanya di wilayah Lewotobi
              strictBounds: true, // Mengaktifkan batas ketat agar tidak bisa keluar dari area
            },
          })

          const infoWindow = new InfoWindow({
            content: "",
            disableAutoPan: true,
          })

          const markers = locations.map((location, i) => {
            const marker = new AdvancedMarkerElement({
              position: { lat: location.lat, lng: location.lng },
              content: createMarkerContent(i + 1),
            })

            marker.addListener("click", () => {
              setSelectedLocation(location)
              infoWindow.setContent(createInfoWindowContent(location))
              infoWindow.open(map, marker)
            })
            return marker
          })

          new MarkerClusterer({ markers, map })
        }
      }


    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCtOYqK3_rXI-XOPixdiBEpNJE96Manrs4
    &libraries=places`
    script.async = true
    script.defer = true
    script.onload = loadMap
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [locations])

  const createMarkerContent = (number: number) => {
    const div = document.createElement('div')
    div.className = 'marker'
    div.textContent = number.toString()
    div.style.backgroundColor = 'hsl(var(--primary))'
    div.style.color = 'hsl(var(--primary-foreground))'
    div.style.width = '30px'
    div.style.height = '30px'
    div.style.display = 'flex'
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center'
    div.style.borderRadius = '50%'
    div.style.fontWeight = 'bold'
    return div
  }

  const createInfoWindowContent = (location: Location) => {
    return `
      <div class="info-window p-2">
        <h3 class="text-lg font-bold mb-2">${location.name}</h3>
        <p>Volunteer: ${location.volunteer}</p>
        <p>Phone: ${location.phone}</p>
        <p>Date: ${location.date}</p>
        <p>Rumah Rusak Berat: ${location.rumahRusakBerat}</p>
        <p>Rumah Rusak Sedang: ${location.rumahRusakSedang}</p>
        <p>Rumah Rusak Ringan: ${location.rumahRusakRingan}</p>
      </div>
    `
  }

  const totalRumahRusak = locations.reduce((sum, loc) =>
    sum + loc.rumahRusakBerat + loc.rumahRusakSedang + loc.rumahRusakRingan, 0)
  // const totalPendudukTerdampak = locations.reduce((sum, loc) => sum + loc.jumlahJiwa, 0)
  // const totalKasusKesehatan = locations.reduce((sum, loc) =>
  //   sum + loc.penyakitKronis + loc.jumlahKematian + loc.jumlahLukaLuka, 0)

  // Menghitung total kematian
  // const totalKematian = locations.reduce((sum,loc) => sum + loc.jumlahKematian, 0)

  const kerusakanData = [
    { name: 'Rumah', value: totalRumahRusak },
    { name: 'Sekolah', value: locations.reduce((sum, loc) =>
      sum + loc.sekolahRusakBerat + loc.sekolahRusakSedang + loc.sekolahRusakRingan, 0) },
    { name: 'Fasilitas Kesehatan', value: locations.reduce((sum, loc) =>
      sum + loc.faskesBerat + loc.faskesSedang + loc.faskesRingan, 0) },
    { name: 'Fasilitas Umum', value: locations.reduce((sum, loc) =>
      sum + loc.fasumBerat + loc.fasumSedang + loc.fasumRingan, 0) },
  ]

  const demografiData = [
    { name: 'Pria', value: locations.reduce((sum, loc) => sum + loc.jumlahPria, 0) },
    { name: 'Wanita', value: locations.reduce((sum, loc) => sum + loc.jumlahWanita, 0) },
    { name: 'Bayi', value: locations.reduce((sum, loc) => sum + loc.bayi, 0) },
    { name: 'Balita', value: locations.reduce((sum, loc) => sum + loc.balita, 0) },
    { name: 'Ibu Hamil', value: locations.reduce((sum, loc) => sum + loc.ibuHamil, 0) },
    { name: 'Lansia', value: locations.reduce((sum, loc) => sum + loc.lansia, 0) },
  ]

  const kesehatanData = [
    { name: 'Penyakit Kronis', value: locations.reduce((sum, loc) => sum + loc.penyakitKronis, 0) },
    { name: 'Kematian', value: locations.reduce((sum, loc) => sum + loc.jumlahKematian, 0) },
    { name: 'Luka-luka', value: locations.reduce((sum, loc) => sum + loc.jumlahLukaLuka, 0) },
    { name: 'Orang Hilang', value: locations.reduce((sum, loc) => sum + loc.jumlahOrangHilang, 0) },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']




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
            <CardTitle className="text-sm font-medium">Total Bangunan Rusak</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penduduk Terdampak</CardTitle>
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
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="bg-primary text-primary-foreground shadow-lg rounded-lg mb-4">
            <CardTitle>Peta Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="w-full h-[400px] lg:h-[600px] rounded-lg mb-4" />
             
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
                {filteredLocations.map((location) => (
                  <Button
                    key={location.name}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedLocation(location)}
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
        <Card>
          <CardHeader>
            <CardTitle>Kerusakan Bangunan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={kerusakanData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {kerusakanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demografi Penduduk</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demografiData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demografiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kasus Kesehatan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kesehatanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


