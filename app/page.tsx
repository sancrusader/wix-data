'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component() {
  const [cordinate, setCordinate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('cordinate:', cordinate);
  };

  useEffect(() => {
    // Ambil data dari localStorage Wix
    const fetchCoordinates = () => {
      const storedCoordinates = localStorage.getItem('userCoordinates'); // Mengambil dari localStorage
      if (storedCoordinates) {
        setCordinate(storedCoordinates); // Mengupdate state dengan koordinat
      }
    };

    fetchCoordinates();

    const handleMessage = (event: MessageEvent) => {
      // Memeriksa asal pesan untuk keamanan
      if (event.origin === 'https://kun.or.id') { // Ganti dengan URL situs Wix Anda
        const { coordinates } = event.data; // Mengambil data koordinat dari pesan
        if (coordinates) {
          setCordinate(coordinates); // Mengupdate state dengan koordinat
          localStorage.setItem('userCoordinates', coordinates); // Simpan ke localStorage
        }
      }
    };

    // Menambahkan event listener untuk pesan
    window.addEventListener('message', handleMessage);

    // Cleanup listener on component unmount
    return () => {
      // Menghapus listener saat komponen di-unmount
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Formulir Assessment</CardTitle>
          <CardDescription className="text-gray-600">Stay updated with the latest Next.js news and updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="cordinate" className="text-sm font-medium text-gray-700">
                Koordinat
              </label>
              <Input
                type="text"
                id="cordinate"
                value={cordinate} // Nilai input diambil dari state
                onChange={(e) => setCordinate(e.target.value)} // Memperbarui state saat input berubah
                required
                className="bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan Koordinat"
              />
            </div>
            <Button type="submit" className="w-full">Kirim</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
