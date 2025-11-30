# TelcoAdmin DWP Dashboard

Platform dashboard modern untuk mempermudah manajemen pelanggan (*Customer Relationship Management*) dan transaksi paket data internet. Dibangun menggunakan React (Vite).

---

## ⚡ Quick Start (Cara Menjalankan)

Tidak perlu konfigurasi rumit, cukup jalankan **dua terminal** secara bersamaan untuk Backend dan Frontend.

### 1️⃣ Persiapan Awal
Pastikan Anda sudah menginstall dependensi:
```bash
npm install
````

### 2️⃣ Jalankan Simulasi Backend

Aplikasi ini menggunakan `json-server` sebagai database dummy. Jalankan perintah ini di **Terminal 1**:

```bash
npm run server
```

*(Server berjalan di port 3001)*

### 3️⃣ Jalankan Aplikasi (Frontend)

Jalankan antarmuka React di **Terminal 2**:

```bash
npm run dev
```

*(Akses aplikasi di browser melalui link yang muncul, biasanya `http://localhost:5173`)*

-----

## 🔑 Akses Demo

Silakan login menggunakan akun administrator berikut:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Super Admin** | `Admin` | `123` |

-----

## 💎 Sorotan Fitur (Key Features)

Aplikasi ini dibagi menjadi tiga modul utama:

### 🛡️ Autentikasi & Keamanan

  * **Secure Login**: Validasi kredensial pengguna sebelum masuk ke dashboard.
  * **Protected Routes**: Mencegah akses ke halaman internal tanpa login (menggunakan Context API).

### 👥 Modul Pelanggan (Customer)

  * **Input Validasi Real-time**: Mencegah kesalahan input pada Email dan Nomor HP.
  * **CRUD Intuitif**: Tambah, Edit, dan Hapus data pelanggan dengan *feedback* visual (Snackbar).
  * **Smart Actions**: Akses cepat tombol "Beli Paket" langsung dari baris data pelanggan.

### 🛒 Modul Transaksi (Commerce)

  * **Katalog Produk Dinamis**: Data paket diambil langsung dari server (`db.json`).
  * **Transaction Logging**: Setiap pembelian tercatat otomatis dengan ID unik (UUID).
  * **History Management**: Admin memiliki kontrol penuh untuk menghapus riwayat transaksi yang salah.

-----

-----
📂 Struktur Proyek
Berikut adalah peta struktur folder untuk memudahkan navigasi kode:

Plaintext

inet-app/
├── public/                  # Aset statis (Favicon, Logo)
├── screenshots/             # Dokumentasi gambar aplikasi
├── src/                     # Kode sumber utama (Source Code)
│   ├── api/                 # Konfigurasi Axios & API Endpoint
│   ├── components/          # Komponen UI Reusable (Modal, Dialog)
│   ├── context/             # Global State Management (Auth)
│   ├── hooks/               # Custom Hooks (Logic Terpisah)
│   ├── layout/              # Template Halaman (Dashboard Layout)
│   ├── pages/               # Halaman Aplikasi (Login, Customer, Transaction)
│   ├── App.jsx              # Konfigurasi Routing
│   ├── main.jsx             # Entry Point React
│   └── theme.js             # Kustomisasi Tema Material UI
├── db.json                  # Database Simulasi (Users, Customers, Transactions)
├── index.html               # File HTML Utama
├── package.json             # Daftar Dependensi & Script
└── vite.config.js           # Konfigurasi Build Tool Vite

-----

## 📸 Galeri Aplikasi

Berikut adalah dokumentasi visual dari antarmuka aplikasi:

*Pastikan Anda menyimpan gambar screenshot di folder `screenshots/` agar tampil.*

\<details\>
\<summary\>\<b\>🔻 Klik untuk melihat Screenshot\</b\>\</summary\>

<br>

**1. Halaman Login**

**2. Dashboard Pelanggan**

**3. Form Input Pelanggan**

**4. Modal Pembelian Paket**

**5. Riwayat Transaksi**

\</details\>

-----

## 💻 Stack Teknologi

Project ini dikembangkan menggunakan teknologi modern standar industri:

  * **Frontend Engine**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Build tool super cepat)
  * **User Interface**: [Material UI (MUI)](https://mui.com/) v7 (Desain konsisten & aksesibel)
  * **Data Fetching**: [Axios](https://axios-http.com/)
  * **Backend Mock**: [JSON Server](https://github.com/typicode/json-server)
  * **Routing**: React Router v7

-----

## 📅 Estimasi Waktu

  * **Mulai Pengerjaan**: 29 November 2025, pukul 11.00 WIB
  * **Selesai Pengerjaan**: 30 November 2025, pukul 13.00 WIB
  * **Total Durasi**: ± 12 Jam

-----

