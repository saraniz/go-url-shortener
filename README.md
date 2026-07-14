# ShrinkIt - Modern URL Shortener

ShrinkIt is a fast, lightweight, and modern URL Shortener application built with a **Go** backend (using the Gin web framework, GORM, and PostgreSQL) and a **React TypeScript** frontend (using Vite and Vanilla CSS).

---

## 🌐 Live Deployments

- **Live Frontend (Vercel)**: [https://srinklt-url-shortener.vercel.app/](https://srinklt-url-shortener.vercel.app/)
- **Live Backend (Render)**: [https://shrinklt-url-shortener.onrender.com/](https://shrinklt-url-shortener.onrender.com/)

---

## 🚀 Implemented Features

- **Instant URL Shortening**: Paste any long link and get a unique 6-character shortened URL alias instantly.
- **Analytics Lookup**: Switch to the statistics tab to search any short code and inspect visitor click-through metrics in real time.
- **Clipboard Integration**: Quick-action buttons to copy shortened links to your clipboard.
- **Dynamic QR Codes**: Generate and scan QR codes for shortened links dynamically using QR Code API integration.
- **Recent Links History**: Persistent link caching using local storage, keeping your recently shortened links visible even after page refreshes.
- **Sleek Cyber-Dark Theme**: Styled with a responsive layout, custom typography (Outfit and Plus Jakarta Sans), neon accents, glassmorphic panels, and smooth transitions.

---

## 🛠️ Fixes & Improvements Done

1. **Dynamic Short URLs**: Replaced hardcoded `localhost:8080` in the backend with dynamic URL resolution. The backend now reads `BASE_URL` from the environment or autodetects the hostname dynamically from HTTP headers.
2. **Go Import Resolution**: Normalized backend module naming in [go.mod](Backend/go.mod) (from capital `Backend` to lowercase `backend`) which fixed Go compiler path import failures.
3. **CORS Middleware Enabled**: Added Gin CORS middleware support in [main.go](Backend/main.go) to allow secure XMLHttpRequests from the React frontend.
4. **Frontend Packages Restored**: Added `axios` to [package.json](frontend/package.json) dependencies to enable smooth API requests, followed by resolving node module structures.
5. **App Boilerplate Replaced**: Replaced the default Vite starter template with the customized interactive dashboard components ([App.tsx](frontend/src/App.tsx), [UrlForm.tsx](frontend/src/components/UrlForm.tsx), and [Stats.tsx](frontend/src/components/Stats.tsx)).

---

## 💻 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS
- **Backend**: Go 1.26, Gin Web Framework, GORM
- **Database**: PostgreSQL (Neon Serverless Postgres Integration)
- **API Client**: Axios

---

## 📦 How to Run Locally

### 1. Prerequisites
- **Go** installed locally
- **Node.js** and npm installed locally

---

### 2. Run Go Backend

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
   BASE_URL=http://localhost:8080
   ```
3. Run the server:
   ```bash
   go run main.go
   ```
   The backend will start listening on port `8080` (e.g. `http://localhost:8080`).

---

### 3. Run React Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:5174/](http://localhost:5174/)** (or the port specified in terminal) to load the dashboard.
