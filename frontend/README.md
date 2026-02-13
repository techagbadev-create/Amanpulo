# Amanpulo Resort - Frontend

<div align="center">
  <img src="public/logo.png" alt="Amanpulo Resort Logo" width="100" />
  
  **React + Vite frontend for Amanpulo Resort booking system**
</div>

## Tech Stack

- **React 19** - UI library with latest features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Custom luxury sand/gold palette
- **Zustand** - Lightweight state management
- **React Router v7** - Client-side routing
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **jsPDF + html2canvas** - PDF receipt generation
- **Sonner** - Toast notifications
- **date-fns** - Date formatting

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

For production (`.env.production`):

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_WEBSITE_URL=https://amanpuloresort.com
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── public/
│   ├── logo.png          # Resort logo
│   ├── manifest.json     # PWA manifest
│   ├── robots.txt        # SEO robots file
│   └── sitemap.xml       # SEO sitemap
│
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn-style components
│   │   ├── LiveSupport.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Receipt.jsx
│   │
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── lib/
│   │   ├── pdfGenerator.js
│   │   └── utils.js
│   │
│   ├── pages/
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── auth/         # Login page
│   │   ├── HomePage.jsx
│   │   ├── RoomsPage.jsx
│   │   ├── RoomDetailsPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── SuccessPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── ContactPage.jsx
│   │
│   ├── services/         # API service layer
│   ├── store/            # Zustand stores
│   ├── App.jsx
│   └── main.jsx
│
├── index.html            # SEO-optimized HTML
├── tailwind.config.js
├── vite.config.js
└── vercel.json           # Vercel deployment config
```

## SEO Features

- Optimized meta tags & Open Graph
- Twitter Card support
- JSON-LD structured data (Schema.org Resort)
- Sitemap & robots.txt
- PWA manifest
- Geo location tags
- Canonical URLs

## Deployment (Vercel)

1. Import project on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL`
4. Deploy

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full instructions.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Contact

- **Website**: [amanpuloresort.com](https://amanpuloresort.com)
- **Email**: reservation@amanpuloresort.com
