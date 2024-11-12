'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component() {
  const [cordinate, setCordinate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('cordinate:', cordinate);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Memeriksa asal pesan untuk keamanan
      if (event.origin === 'https://kun.or.id') { // Ganti dengan URL situs Wix Anda
        const { coordinates } = event.data; // Mengambil data koordinat dari pesan
        if (coordinates) {
          setCordinate(coordinates); // Mengupdate state dengan koordinat
        }
      }
    };

    // Menambahkan event listener untuk pesan
    window.addEventListener('message', handleMessage);

    // Cleanup listener on component unmount
    return () => {
      // Menghapus listener saat komponen di-unmount
      window.removeEventListener('message', handleMessage); // Pastikan tidak ada spasi di "message"
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
                Cordinate
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
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
            >
              Subscribe
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500 text-center w-full">
            By subscribing, you agree to our terms and privacy policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
