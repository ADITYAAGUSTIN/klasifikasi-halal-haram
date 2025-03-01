import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './FirebaseConfig';

const App = () => {
  const [inputKomposisi, setInputKomposisi] = useState('');
  const [hasil, setHasil] = useState([]);

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
      console.log('Jumlah data di Firestore:', querySnapshot.size);

      let produkDitemukan = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Data dari Firestore:', data);

        // ✅ Cek apakah input ada dalam komposisi produk
        if (
          typeof data.komposisi === 'string' &&
          data.komposisi
            .toLowerCase()
            .includes(inputKomposisi.trim().toLowerCase())
        ) {
          produkDitemukan.push({
            namaProduk: data.nama_produk,
            komposisi: data.komposisi,
            knn: data.klasifikasi_knn,
            cosine: data.klasifikasi_cosine,
          });
        }
      });

      console.log('Produk yang cocok:', produkDitemukan);

      if (produkDitemukan.length > 0) {
        setHasil(produkDitemukan);
      } else {
        setHasil([]); // Kosongkan jika tidak ditemukan
        alert('Komposisi tidak ditemukan dalam database.');
      }
    } catch (error) {
      console.error('Error saat mengambil data:', error);
      alert('Terjadi kesalahan saat mengambil data.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Cek Status Halal / Haram</h2>
      <textarea
        placeholder="Masukkan komposisi makanan (max 1000 karakter)..."
        value={inputKomposisi}
        onChange={(e) => setInputKomposisi(e.target.value)}
        maxLength={1000}
        rows={6}
        cols={50}
      />
      <br />
      <button onClick={cekHalalHaram}>Cek</button>

      {hasil.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Hasil Pencarian:</h3>
          <table
            border="1"
            style={{ margin: 'auto', width: '80%', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px' }}>Nama Produk</th>
                <th>Komposisi</th>
                <th>Klasifikasi KNN</th>
                <th>Klasifikasi Cosine</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px' }}>{item.namaProduk}</td>
                  <td>{item.komposisi}</td>
                  <td
                    style={{
                      color: item.knn === 'Halal' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.knn}
                  </td>
                  <td
                    style={{
                      color: item.cosine === 'Halal' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.cosine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
