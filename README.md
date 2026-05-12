# Finary Frontend

React + Vite frontend untuk Finary. Project ini siap deploy ke Vercel dan memakai backend production di `https://api.finary.my.id/api`.

## Setup Lokal

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

## Environment

Gunakan environment variable berikut di Vercel:

```env
VITE_API_URL=https://api.finary.my.id/api
```

`src/lib/api.js` membaca `VITE_API_URL`, jadi source API client tidak perlu diubah.

## Deploy ke Vercel

1. Import repository ini di Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Tambahkan environment variable `VITE_API_URL`.

`vercel.json` sudah menambahkan SPA rewrite supaya refresh halaman tetap diarahkan ke React app.

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
