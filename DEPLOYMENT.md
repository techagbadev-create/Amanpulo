# Amanpulo Deployment Guide

This project uses a monorepo structure with separate `frontend` and `backend` folders.

---

## Backend Deployment (Render)

### Step 1: Create a New Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New** → **Web Service**
3. Connect your GitHub repository: `RabbitDaCoder/Amanpulo`

### Step 2: Configure the Service

| Setting            | Value          |
| ------------------ | -------------- |
| **Name**           | `amanpulo-api` |
| **Root Directory** | `backend`      |
| **Runtime**        | `Node`         |
| **Build Command**  | `npm install`  |
| **Start Command**  | `npm start`    |

> **Important:** Set the **Root Directory** to `backend`. This ensures Render only runs commands from the backend folder and only redeploys when backend code changes.

### Step 3: Add Environment Variables

In the Render dashboard, go to **Environment** and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://techagbadev_db_user:SnCcsn9MsaVP63Fs@amanpulo-reservation.affmjlx.mongodb.net/amanpulo_reservation?retryWrites=true&w=majority&appName=amanpulo-reservation
JWT_SECRET=my_super_secret_jwt_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=techagbadev@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM="Amanpulo Reservation <reservation@amanpuloresort.com>"
FRONTEND_URL=https://amanpuloresort.com
```

### Step 4: Deploy

Click **Create Web Service**. Render will:

1. Clone your repo
2. Navigate to the `backend` folder
3. Run `npm install`
4. Run `npm start`

Your API will be available at: `https://amanpulo-api.onrender.com`

---

## Frontend Deployment (Vercel)

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository: `RabbitDaCoder/Amanpulo`

### Step 2: Configure the Project

| Setting              | Value           |
| -------------------- | --------------- |
| **Root Directory**   | `frontend`      |
| **Framework Preset** | `Vite`          |
| **Build Command**    | `npm run build` |
| **Output Directory** | `dist`          |

### Step 3: Add Environment Variables

```
VITE_API_URL=https://amanpulo-api.onrender.com/api
```

### Step 4: Deploy

Click **Deploy**. Your frontend will be available at your Vercel URL.

### Step 5: Add Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add `amanpuloresort.com`
3. Configure DNS records as instructed by Vercel

---

## Post-Deployment Checklist

- [ ] Verify backend is running: `https://amanpulo-api.onrender.com/api/rooms`
- [ ] Update `FRONTEND_URL` in Render with your actual Vercel/custom domain
- [ ] Test booking flow end-to-end
- [ ] Verify confirmation emails are sending
- [ ] Test admin login at `/admin/login`

---

## Updating the Application

### Backend Updates

Push changes to the `backend` folder → Render auto-deploys

### Frontend Updates

Push changes to the `frontend` folder → Vercel auto-deploys

---

## Important Notes

1. **Render Free Tier**: Services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

2. **Gmail App Password**: Use a Gmail App Password, not your regular password. Generate one at [Google Account Security](https://myaccount.google.com/apppasswords).

3. **MongoDB Atlas**: Ensure your MongoDB cluster allows connections from anywhere (0.0.0.0/0) for Render to connect.

---

## Contact Information

- **Website**: amanpuloresort.com
- **Email**: reservation@amanpuloresort.com
