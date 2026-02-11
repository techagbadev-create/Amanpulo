# Amanpulo Reservation System

A luxury hotel reservation system for Amanpulo Private Island Resort, built with the MERN stack. Features a premium booking experience with manual payment verification, admin dashboard, PDF receipt generation, and live chat support.

## Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom sand/gold palette
- **Zustand** - State management
- **React Router v7** - Client-side routing
- **Radix UI** - Accessible UI primitives
- **jsPDF + html2canvas** - PDF receipt generation
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **date-fns** - Date utilities

### Backend

- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Admin authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service with PDF attachments
- **Helmet** - Security headers
- **Morgan** - Request logging

## Features

### Guest Features

- Browse luxury villas and casitas
- Real-time availability checking
- Date selection with calendar picker
- Guest count management
- Booking with manual payment verification flow
- PDF receipt download
- Email confirmation with receipt attachment
- Smartsupp live chat support

### Admin Features

- Secure JWT authentication
- Dashboard with booking statistics
- Room management (CRUD)
- Seasonal discount configuration
- Booking management and verification
- Manual payment code confirmation

## Project Structure

```
Amanpulo/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   └── Room.js
│   ├── routes/           # API routes
│   ├── utils/            # Email service, seeders
│   └── server.js         # Entry point
│
├── frontend/
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # Reusable UI components
│       │   ├── ui/       # Shadcn-style components
│       │   ├── LiveSupport.jsx
│       │   └── Receipt.jsx
│       ├── layouts/      # Page layouts
│       ├── lib/          # Utilities (pdfGenerator, utils)
│       ├── pages/        # Route pages
│       │   ├── admin/    # Admin dashboard pages
│       │   └── auth/     # Login page
│       ├── services/     # API service functions
│       └── store/        # Zustand stores
│
└── README.md
```

## Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Amanpulo
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file from example:

```bash
cp .env.example .env
```

Configure environment variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/amanpulo_reservation
JWT_SECRET=your_secure_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="Amanpulo Reservation <noreply@amanpulo.com>"
FRONTEND_URL=http://localhost:5174
```

Seed the database:

```bash
npm run seed:admin   # Creates admin user
npm run seed:rooms   # Seeds room data
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

**Backend** (runs on port 5000):

```bash
cd backend
npm run dev
```

**Frontend** (runs on port 5174):

```bash
cd frontend
npm run dev
```

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Public Routes

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| GET    | `/api/rooms`                 | Get all available rooms   |
| GET    | `/api/rooms/:id`             | Get room details          |
| POST   | `/api/bookings`              | Create new booking        |
| POST   | `/api/bookings/confirm`      | Confirm booking with code |
| POST   | `/api/bookings/send-receipt` | Send receipt email        |

### Admin Routes (Protected)

| Method | Endpoint                          | Description      |
| ------ | --------------------------------- | ---------------- |
| POST   | `/api/admin/login`                | Admin login      |
| GET    | `/api/admin/dashboard`            | Dashboard stats  |
| GET    | `/api/admin/rooms`                | Get all rooms    |
| POST   | `/api/admin/rooms`                | Create room      |
| PUT    | `/api/admin/rooms/:id`            | Update room      |
| DELETE | `/api/admin/rooms/:id`            | Delete room      |
| PATCH  | `/api/admin/rooms/:id/discount`   | Toggle discount  |
| GET    | `/api/admin/bookings`             | Get all bookings |
| PATCH  | `/api/admin/bookings/:id/confirm` | Confirm booking  |

## Admin Credentials

Default admin account (created via seed):

```
Email: owner@example.com
Password: Passw0rd!
```

## Booking Flow

1. **Guest selects room** → Browse rooms, view details
2. **Guest enters dates** → Calendar picker, availability check
3. **Guest fills details** → Name, email, phone
4. **Booking created** → System generates verification code
5. **Admin sends code** → Via chat or other channel
6. **Guest enters code** → On checkout page
7. **Booking confirmed** → Receipt generated & emailed

## Currency

All prices are in **Philippine Peso (PHP)** with `₱` symbol.

## Live Chat Integration

The system integrates **Smartsupp** live chat for customer support:

- Auto-opens on checkout page
- Floating widget on all pages
- Key: `9f40ed644a4b74b5b3481aa3dfd33590a65b6bea`

## Email Configuration

For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833):

1. Enable 2-Step Verification
2. Generate App Password
3. Use in `EMAIL_PASS` env variable

## License

ISC

---

Built with ❤️ by RabbitDaCoder
