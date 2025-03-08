import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './FirebaseConfig';

const App = () => {
  const [inputKomposisi, setInputKomposisi] = useState('');
  const [hasil, setHasil] = useState([]);
  const [semuaData, setSemuaData] = useState([]);

  const cekHalalHaram = async () => {
    if (!inputKomposisi.trim()) {
      alert('Masukkan komposisi makanan terlebih dahulu!');
      return;
    }

    if (inputKomposisi.length > 1000) {
      alert('Input terlalu panjang! Maksimal 1000 karakter.');
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'hasil_klasifikasi'));
      let produkDitemukan = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        if (
          typeof data.komposisi === 'string' &&
          data.komposisi.toLowerCase().includes(inputKomposisi.trim().toLowerCase())
        ) {
          produkDitemukan.push({
            namaProduk: data.nama_produk,
            komposisi: data.komposisi,
            knn: data.klasifikasi_knn,
            cosine: data.klasifikasi_cosine,
          });
        }
      });

      if (produkDitemukan.length > 0) {
        setHasil(produkDitemukan);
      } else {
        setHasil([]);
        alert('Komposisi tidak ditemukan dalam database.');
      }
    } catch (error) {
      console.error('Error saat mengambil data:', error);
      alert('Terjadi kesalahan saat mengambil data.');
    }
  };

  const tampilkanSemuaData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'hasil_klasifikasi'));
      let semuaProduk = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        semuaProduk.push({
          namaProduk: data.nama_produk,
          komposisi: data.komposisi,
          knn: data.klasifikasi_knn,
          cosine: data.klasifikasi_cosine,
        });
      });

      setSemuaData(semuaProduk);
    } catch (error) {
      console.error('Error saat mengambil semua data:', error);
      alert('Terjadi kesalahan saat mengambil semua data.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Cek Status Halal / Haram</h2>
      <textarea
        className="border border-gray-300 rounded-lg p-2 w-80 h-32 resize-none focus:ring-2 focus:ring-blue-400"
        placeholder="Masukkan komposisi makanan (max 1000 karakter)..."
        value={inputKomposisi}
        onChange={(e) => setInputKomposisi(e.target.value)}
        maxLength={1000}
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={cekHalalHaram}
          className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Cek
        </button>
        <button
          onClick={tampilkanSemuaData}
          className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Tampilkan Semua Data
        </button>
      </div>

      {(hasil.length > 0 || semuaData.length > 0) && (
        <div className="mt-6 w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-2">
            {hasil.length > 0 ? 'Hasil Pencarian:' : 'Seluruh Data:'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border border-gray-300 p-2">Nama Produk</th>
                  <th className="border border-gray-300 p-2">Komposisi</th>
                  <th className="border border-gray-300 p-2">Klasifikasi KNN</th>
                  <th className="border border-gray-300 p-2">Klasifikasi Cosine</th>
                </tr>
              </thead>
              <tbody>
                {(hasil.length > 0 ? hasil : semuaData).map((item, index) => (
                  <tr key={index} className="bg-white text-center">
                    <td className="border border-gray-300 p-2">{item.namaProduk}</td>
                    <td className="border border-gray-300 p-2">{item.komposisi}</td>
                    <td
                      className={`border border-gray-300 p-2 font-bold ${
                        item.knn === 'Halal' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.knn}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 font-bold ${
                        item.cosine === 'Halal' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.cosine}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
