# 📡 DevLens AI — Documentation

> **DevLens AI** adalah platform berbasis kecerdasan buatan yang dirancang untuk menyederhanakan dan menganalisis dokumentasi teknis secara otomatis. Dibangun dengan arsitektur full-stack modern menggunakan Express.js di sisi backend dan React + Vite di sisi frontend.

---

## 📋 Daftar Isi

1. [Gambaran Umum](#gambaran-umum)
2. [Tech Stack](#tech-stack)
3. [Struktur Folder](#struktur-folder)
4. [Arsitektur Sistem](#arsitektur-sistem)
5. [Backend — Detail & Setup](#backend--detail--setup)
6. [Frontend — Detail & Setup](#frontend--detail--setup)
7. [API Reference](#api-reference)
8. [Environment Variables](#environment-variables)
9. [Menjalankan dengan Docker](#menjalankan-dengan-docker)
10. [Panduan Kontribusi](#panduan-kontribusi)

---

## Gambaran Umum

DevLens AI membantu developer dan tim teknis untuk:

- 📄 Menganalisis dan menyederhanakan dokumentasi teknis yang kompleks
- 🤖 Memanfaatkan Google Gemini AI untuk pemrosesan dan generasi konten otomatis
- 📁 Mengunggah dan memproses file PDF untuk ekstraksi konten
- 🔐 Mengelola autentikasi pengguna dengan JWT dan bcrypt
- ☁️ Menyimpan dan mengelola file via Cloudinary
- 📊 Mengakses API documentation interaktif melalui Swagger UI

---

## Tech Stack

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Node.js** | LTS | Runtime environment |
| **Express.js** | ^5.2.1 | Web framework |
| **PostgreSQL** | Latest | Relational database |
| **Prisma ORM** | ^7.8.0 | Database client & migrations |
| **Google Gemini AI** | ^0.24.1 (`@google/generative-ai`) | AI processing & text generation |
| **JWT** | ^9.0.3 (`jsonwebtoken`) | Autentikasi token |
| **bcrypt** | ^6.0.0 | Password hashing |
| **Cloudinary** | ^2.10.0 | Cloud file storage |
| **Multer** | ^2.1.1 | File upload handling |
| **pdf-parse** | ^2.4.5 | Ekstraksi konten PDF |
| **marked** | ^18.0.3 | Markdown parser |
| **cheerio** | ^1.2.0 | HTML parsing |
| **Swagger UI Express** | ^5.0.1 | API documentation UI |
| **Docker** | Latest | Containerization |
| **dotenv** | ^17.4.2 | Environment variable management |
| **cors** | ^2.8.6 | Cross-Origin Resource Sharing |
| **cookie-parser** | ^1.4.7 | Cookie management |
| **nodemon** | ^3.1.14 | Development auto-reload |

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **React** | ^19.2.6 | UI library |
| **Vite** | ^8.0.12 | Build tool & dev server |
| **Tailwind CSS** | ^4.3.0 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Component library |
| **JavaScript** | ES2023+ | Bahasa pemrograman |
| **React Router DOM** | ^7.15.0 | Client-side routing |
| **Axios** | ^1.16.0 | HTTP client |
| **Lucide React** | ^1.14.0 | Icon library |
| **React Hot Toast** | ^2.6.0 | Notifikasi/toast messages |

---

## Struktur Folder

```
DevLens/                          # Root repository
├── .agent/                       # Konfigurasi AI agent
├── Backend/                      # Server-side application
│   ├── main.js                   # Entry point aplikasi
│   ├── package.json              # Backend dependencies
│   ├── Dockerfile                # Docker image untuk backend
│   ├── .env.example              # Contoh environment variables
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema & model definitions
│   │   └── migrations/           # Database migration files
│   └── src/
│       ├── config/
│       │   ├── database.js       # Konfigurasi koneksi PostgreSQL
│       │   ├── cloudinary.js     # Konfigurasi Cloudinary
│       │   └── gemini.js         # Konfigurasi Google Gemini AI
│       ├── controllers/
│       │   ├── authController.js       # Login, register, logout
│       │   ├── documentController.js   # Upload & analisis dokumen
│       │   └── userController.js       # Manajemen profil pengguna
│       ├── middlewares/
│       │   ├── authMiddleware.js       # JWT verification
│       │   ├── uploadMiddleware.js     # Multer file upload config
│       │   └── errorMiddleware.js      # Global error handler
│       ├── routes/
│       │   ├── authRoutes.js           # Route autentikasi
│       │   ├── documentRoutes.js       # Route dokumen
│       │   └── userRoutes.js           # Route pengguna
│       ├── services/
│       │   ├── geminiService.js        # Integrasi Gemini AI
│       │   ├── pdfService.js           # Pemrosesan file PDF
│       │   └── cloudinaryService.js    # Upload/delete file
│       └── utils/
│           ├── responseHelper.js       # Standarisasi format response
│           └── jwtHelper.js            # Generasi & verifikasi token
│
├── frontend/                     # Client-side application
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies
│   ├── vite.config.js            # Konfigurasi Vite
│   ├── eslint.config.js          # ESLint configuration
│   ├── .env.example              # Contoh environment variables FE
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Root component & routing
│       ├── assets/               # Static assets (images, icons)
│       ├── components/
│       │   ├── ui/               # shadcn/ui base components
│       │   ├── Navbar.jsx        # Navigation bar
│       │   ├── Sidebar.jsx       # Sidebar navigasi
│       │   ├── DocumentCard.jsx  # Kartu dokumen
│       │   └── LoadingSpinner.jsx# Loading indicator
│       ├── pages/
│       │   ├── LandingPage.jsx   # Halaman utama / landing
│       │   ├── LoginPage.jsx     # Halaman login
│       │   ├── RegisterPage.jsx  # Halaman register
│       │   ├── DashboardPage.jsx # Halaman dashboard utama
│       │   ├── UploadPage.jsx    # Halaman upload dokumen
│       │   └── ResultPage.jsx    # Halaman hasil analisis AI
│       ├── hooks/
│       │   ├── useAuth.js        # Custom hook autentikasi
│       │   └── useDocument.js    # Custom hook manajemen dokumen
│       ├── services/
│       │   ├── api.js            # Axios instance & interceptors
│       │   ├── authService.js    # Fungsi API autentikasi
│       │   └── documentService.js# Fungsi API dokumen
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state (React Context)
│       └── utils/
│           └── helpers.js        # Utility functions
│
├── openspec/                     # OpenAPI / Swagger specifications
│   └── openapi.yaml              # API spec definition
│
├── .gitignore                    # Git ignore rules
└── README.md                     # Dokumentasi singkat repo
```

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│              React + Vite + Tailwind CSS                 │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST (Axios)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  Routes  │→ │Middleware│→ │     Controllers       │  │
│  └──────────┘  └──────────┘  └──────────┬───────────┘  │
│                                          │               │
│                     ┌────────────────────┤               │
│                     ▼                    ▼               │
│              ┌─────────────┐   ┌──────────────────┐     │
│              │  Services   │   │   Prisma ORM     │     │
│              └──────┬──────┘   └────────┬─────────┘     │
└─────────────────────┼───────────────────┼───────────────┘
                      │                   │
          ┌───────────┼──────┐            │
          ▼           ▼      ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────┐  ┌────────────┐
   │ Gemini   │ │Cloudinary│ │ PDF  │  │ PostgreSQL │
   │   AI     │ │ Storage  │ │Parse │  │  Database  │
   └──────────┘ └──────────┘ └──────┘  └────────────┘
```

---

## Backend — Detail & Setup

### Prasyarat

- Node.js >= 18.x
- PostgreSQL >= 14
- Docker (opsional)
- Akun Google AI Studio (untuk Gemini API Key)
- Akun Cloudinary

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Aldofariz/DevLens.git
cd DevLens/Backend

# 2. Install dependencies
npm install

# 3. Salin dan isi environment variables
cp .env.example .env

# 4. Generate Prisma client
npm run prisma:generate

# 5. Jalankan migrasi database
npm run prisma:migrate

# 6. Jalankan development server
npm run dev
```

### Scripts

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| `dev` | `nodemon main.js` | Jalankan server dengan auto-reload |
| `start` | `node main.js` | Jalankan server production |
| `test` | `node --test` | Jalankan test suite |
| `prisma:generate` | `prisma generate` | Generate Prisma client |
| `prisma:migrate` | `prisma migrate dev` | Jalankan database migration |

### Fitur Utama Backend

- **Autentikasi** — Register, login, dan logout dengan JWT token + bcrypt password hashing
- **Manajemen Dokumen** — Upload, simpan, dan kelola dokumen teknis pengguna
- **AI Processing** — Analisis dan simplifikasi konten menggunakan Google Gemini AI
- **PDF Parsing** — Ekstraksi teks dari file PDF yang diunggah
- **File Storage** — Penyimpanan file di cloud via Cloudinary
- **API Documentation** — Dokumentasi endpoint interaktif via Swagger UI (tersedia di `/api-docs`)
- **Database ORM** — Manajemen database PostgreSQL menggunakan Prisma

---

## Frontend — Detail & Setup

### Prasyarat

- Node.js >= 18.x
- npm atau yarn

### Instalasi

```bash
# 1. Masuk ke folder frontend
cd DevLens/frontend

# 2. Install dependencies
npm install

# 3. Salin dan isi environment variables
cp .env.example .env

# 4. Jalankan development server
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### Scripts

| Script | Perintah | Deskripsi |
|--------|----------|-----------|
| `dev` | `vite` | Jalankan development server |
| `build` | `vite build` | Build untuk production |
| `preview` | `vite preview` | Preview hasil build |
| `lint` | `eslint .` | Cek kualitas kode |

### Halaman Aplikasi

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Landing Page | Halaman utama & pengenalan produk |
| `/login` | Login | Autentikasi pengguna |
| `/register` | Register | Pendaftaran akun baru |
| `/dashboard` | Dashboard | Ringkasan dokumen & aktivitas |
| `/upload` | Upload | Unggah dokumen untuk dianalisis |
| `/result/:id` | Result | Tampilkan hasil analisis AI |

---

## API Reference

Dokumentasi API lengkap tersedia di Swagger UI pada endpoint:

```
http://localhost:3000/api-docs
```

### Ringkasan Endpoint

#### 🔐 Auth

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/auth/register` | Daftarkan akun baru | ❌ |
| `POST` | `/api/auth/login` | Login & dapatkan JWT token | ❌ |
| `POST` | `/api/auth/logout` | Logout & hapus token | ✅ |

#### 📄 Documents

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/documents` | Ambil semua dokumen milik user | ✅ |
| `POST` | `/api/documents/upload` | Upload & analisis dokumen baru | ✅ |
| `GET` | `/api/documents/:id` | Ambil detail dokumen | ✅ |
| `DELETE` | `/api/documents/:id` | Hapus dokumen | ✅ |

#### 👤 Users

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/api/users/profile` | Ambil profil pengguna | ✅ |
| `PUT` | `/api/users/profile` | Update profil pengguna | ✅ |

### Contoh Request & Response

#### Register

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Aldo Fariz",
  "email": "aldo@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid-xxx",
    "name": "Aldo Fariz",
    "email": "aldo@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Upload & Analisis Dokumen

**Request:**
```http
POST /api/documents/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <pdf_file>
title: "Dokumentasi API v2"
```

**Response:**
```json
{
  "success": true,
  "message": "Dokumen berhasil dianalisis",
  "data": {
    "id": "doc-uuid-xxx",
    "title": "Dokumentasi API v2",
    "originalUrl": "https://res.cloudinary.com/...",
    "summary": "Ringkasan hasil analisis AI...",
    "simplifiedContent": "Konten yang disederhanakan oleh Gemini AI...",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## Environment Variables

### Backend (`Backend/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/devlens_db"

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Cookie
COOKIE_SECRET=your_cookie_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Menjalankan dengan Docker

### Menggunakan Docker Compose

Buat file `docker-compose.yml` di root repository:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: devlens_db
    restart: always
    environment:
      POSTGRES_DB: devlens_db
      POSTGRES_USER: devlens_user
      POSTGRES_PASSWORD: devlens_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    container_name: devlens_backend
    restart: always
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://devlens_user:devlens_password@db:5432/devlens_db
    depends_on:
      - db
    env_file:
      - ./Backend/.env

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: devlens_frontend
    restart: always
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Menjalankan

```bash
# Build dan jalankan semua service
docker compose up --build

# Jalankan di background
docker compose up -d

# Hentikan semua service
docker compose down

# Lihat logs
docker compose logs -f backend
```

### Akses Aplikasi

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |
| Swagger UI | `http://localhost:3000/api-docs` |
| PostgreSQL | `localhost:5432` |

---

## Panduan Kontribusi

### Branching Strategy

```
main              ← Production-ready code
├── develop-be    ← Backend development
├── develop-fe    ← Frontend development
└── feature/*     ← Feature branches
```

### Langkah Kontribusi

```bash
# 1. Fork repository
# 2. Clone fork kamu
git clone https://github.com/<your-username>/DevLens.git

# 3. Buat branch baru dari develop
git checkout develop-be
git checkout -b feature/nama-fitur-kamu

# 4. Lakukan perubahan & commit
git add .
git commit -m "feat: tambah fitur xyz"

# 5. Push dan buat Pull Request
git push origin feature/nama-fitur-kamu
```

### Konvensi Commit Message

| Prefix | Kegunaan |
|--------|----------|
| `feat:` | Menambahkan fitur baru |
| `fix:` | Memperbaiki bug |
| `docs:` | Update dokumentasi |
| `refactor:` | Refactoring kode |
| `chore:` | Update dependency / config |

---

## 👨‍💻 Author

**Aldo Fariz** — [@Aldofariz](https://github.com/Aldofariz)

---

*DevLens AI — Simplifying Technical Documentation with the Power of AI*
