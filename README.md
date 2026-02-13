# Amanpulo Resort - Reservation System

<div align="center">
  <img src="frontend/public/logo.png" alt="Amanpulo Resort Logo" width="120" />
  
  **A luxury hotel reservation system for Amanpulo Private Island Resort**
  
  🌐 [amanpuloresort.com](https://amanpuloresort.com) | ✉️ reservation@amanpuloresort.com
</div>

---

## Overview

A full-stack MERN reservation system featuring a premium booking experience with manual payment verification, admin dashboard, PDF receipt generation, email confirmations, and live chat support.

## Live Demo

- **Website**: [amanpuloresort.com](https://amanpuloresort.com)
- **Frontend**: Hosted on Vercel
- **Backend API**: Hosted on Render

## Tech Stack

### Frontend
- **React 19** + **Vite** - Modern build tooling
- **Tailwind CSS** - Custom sand/gold luxury palette
- **Zustand** - Lightweight state management
- **React Router v7** - Client-side routing
- **Radix UI** - Accessible UI primitives
- **jsPDF + html2canvas** - PDF receipt generation
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Node.js + Express** - REST API server
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Admin authentication
- **Nodemailer** - Email service with PDF attachments
- **bcryptjs** - Password hashing

## Features

### 🏨 Guest Features
- Browse luxury villas and casitas with stunning imagery
- Real-time availability checking
- Interactive date picker with calendar
- Flexible guest count management
- Secure booking with verification code flow
- Downloadable PDF receipts
- Email confirmation with receipt attachment
- Smartsupp live chat support

### 👑 Admin Features
- Secure JWT-based authentication
- Dashboard with booking analytics
- Complete room management (CRUD)
- Seasonal discount configuration
- Booking management & verification
- Manual payment code confirmation

## Project Structure

```
Amanpulo/
├── backend/
│   ├── config/           # Database & constants
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth & validation
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── utils/            # Email service, seeders
│   └── server.js
│
├── frontend/
│   ├── public/           # Static assets, logo, SEO files
│   └── src/
│       ├── components/   # UI components & Receipt
│       ├── layouts/      # Header, Footer, AdminLayout
│       ├── lib/          # PDF generator, utilities
│       ├── pages/        # Route pages
│       ├── services/     # API service layer
│       └── store/        # Zustand stores
│
├── DEPLOYMENT.md         # Hosting guide
└── README.md
```

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/RabbitDaCoder/Amanpulo.git
cd Amanpulo

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Amanpulo Reservation <reservation@amanpuloresort.com>"
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd backend
npm run seed:admin   # Creates admin user
npm run seed:rooms   # Seeds room data
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed hosting instructions.

| Service | Platform | Root Directory |
|---------|----------|----------------|
| Frontend | Vercel | `frontend` |
| Backend | Render | `backend` |

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List available rooms |
| GET | `/api/rooms/:id` | Get room details |
| POST | `/api/bookings` | Create booking |
| POST | `/api/bookings/confirm` | Confirm with code |
| POST | `/api/bookings/send-receipt` | Email receipt |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/rooms` | List all rooms |
| POST | `/api/admin/rooms` | Create room |
| PUT | `/api/admin/rooms/:id` | Update room |
| DELETE | `/api/admin/rooms/:id` | Delete room |
| PATCH | `/api/admin/rooms/:id/discount` | Toggle discount |
| GET | `/api/admin/bookings` | List bookings |
| PATCH | `/api/admin/bookings/:id/confirm` | Confirm booking |

## Default Admin Login

```
Email: owner@example.com
Password: Passw0rd!
```

## Booking Flow

1. **Browse Rooms** → Guest explores available accommodations
2. **Select Dates** → Calendar picker with availability check
3. **Enter Details** → Guest information form
4. **Create Booking** → System generates verification code
5. **Admin Verification** → Code sent via chat/email
6. **Confirm Booking** → Guest enters code
7. **Receive Receipt** → PDF generated & emailed

## SEO & Performance

- Optimized meta tags & Open Graph
- JSON-LD structured data (Schema.org)
- Sitemap & robots.txt
- PWA manifest
- Preconnect for fonts
- Responsive images

## Contact

- **Website**: [amanpuloresort.com](https://amanpuloresort.com)
- **Email**: reservation@amanpuloresort.com
- **Location**: Pamalican Island, Palawan, Philippines

## License

ISC

---

<div align="center">
  Built with ❤️ by RabbitDaCoder
</div>
