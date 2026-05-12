# Finary Frontend

React + Vite frontend untuk Finary. Project ini siap deploy ke Vercel dan memakai backend production di `https://api-finary.my.id/api`.

## Setup Lokal

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

## Konfigurasi API

Contoh `.env` untuk production:

```env
VITE_API_URL=https://api-finary.my.id/api
```

Untuk lokal, gunakan `VITE_API_URL=http://127.0.0.1:8000/api`.

Salin `.env.example` jika perlu membuat konfigurasi lokal baru. `src/lib/api.js` membaca `VITE_API_URL` dan tidak perlu diubah.

## Deploy ke Vercel

1. Import repository ini di Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Tambahkan environment variable `VITE_API_URL` ke `https://api-finary.my.id/api`.

## Connect ke Backend

Jalankan backend Laravel dari folder `finary-backend/` di port `8000`, lalu jalankan frontend ini. Vite sudah dikonfigurasi dengan proxy `/api` ke `http://127.0.0.1:8000` untuk membantu flow development lokal.

## Struktur Folder

```text
src/
├── assets/
├── components/
│   └── layout/
│       └── Navbar.jsx
├── constants/
│   └── index.js
├── lib/
│   ├── api.js
│   ├── format.js
│   └── helpers.js
├── pages/
│   ├── AssessmentPage.jsx
│   ├── AuthPage.jsx
│   ├── DashboardPage.jsx
│   ├── ForumPage.jsx
│   ├── HustlePage.jsx
│   ├── OnboardingPage.jsx
│   ├── ProfilePage.jsx
│   └── TransactionsPage.jsx
└── App.jsx
```

`App.jsx` mengatur state dan handlers, lalu merender page components via props. Constants dan pure helpers dipindahkan ke `src/constants` dan `src/lib/helpers.js`.
