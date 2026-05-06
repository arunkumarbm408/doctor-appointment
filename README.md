# Doctor Appointment Booking System

A production-style MERN starter for a doctor appointment booking platform with role-based dashboards for patients, doctors, and admins.

## What is included

### Backend
- JWT authentication with `patient`, `doctor`, and `admin` roles
- Password hashing with `bcryptjs`
- MongoDB models for `User`, `Doctor`, and `Appointment`
- REST APIs under `/api/auth`, `/api/doctors`, `/api/appointments`, and `/api/admin`
- Express middleware for auth, role guards, validation, uploads, rate limiting, CORS, and centralized errors
- Double-booking prevention with a compound unique index and runtime checks
- Sample seed script for quick demo setup

### Frontend
- React + Vite with functional components and modern hooks
- Redux Toolkit for auth, doctors, appointments, and admin state
- React Router DOM for public and protected routes
- Axios service layer with token injection
- Responsive Bootstrap-based UI for:
  - Home page
  - Login / Register
  - Doctor listing
  - Doctor details
  - Appointment booking
  - Patient dashboard
  - Doctor dashboard
  - Admin panel

## Folder structure

```text
Backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    seed/
    utils/
    validators/

Frontend/
  src/
    app/
    components/
    features/
    pages/
    services/
    styles/
    utils/
```

## Step-by-step implementation overview

### 1. Backend foundation
- Created an Express app with `helmet`, `cors`, `morgan`, and `express-rate-limit`.
- Added a central `app.js` so routing and middleware stay separate from server bootstrap logic.
- Added MongoDB connection logic in `Backend/src/config/db.js`.

### 2. Authentication and authorization
- Built the `User` schema with role support and password hashing middleware.
- Added register, login, and current-user endpoints.
- Implemented JWT verification and role-based route guards.
- Startup mode defaults to auto-approving doctors. Set `AUTO_APPROVE_DOCTORS=false` later if you want a manual approval workflow.

### 3. Doctor module
- Added the `Doctor` schema with profile metadata, approval state, qualifications, profile image path, and weekly slots.
- Created public doctor search and details APIs.
- Added doctor profile upsert with image upload support.
- Added doctor appointment management and approve/reject actions.

### 4. Appointment system
- Added the `Appointment` schema with statuses:
  - `Pending`
  - `Approved`
  - `Rejected`
  - `Completed`
  - `Cancelled`
- Prevented duplicate doctor-slot bookings both in code and with a MongoDB unique index.
- Added patient history and cancellation endpoints.

### 5. Admin panel
- Added endpoints for:
  - dashboard stats
  - user listing
  - doctor approval management
  - full appointment listing

### 6. Frontend application
- Added a Vite React app with Redux Toolkit and React Router.
- Created slices for auth, doctors, appointments, and admin features.
- Added protected and role-aware routes.
- Built the main public and dashboard pages using responsive Bootstrap layouts.

### 7. Seed data and setup docs
- Added a seed script that creates one admin, one doctor, one patient, and one sample appointment.
- Added environment templates for backend and frontend.

## Demo credentials after seeding

- Admin: `admin@doctorbook.com` / `Admin@123`
- Doctor: `doctor@doctorbook.com` / `Doctor@123`
- Patient: `patient@doctorbook.com` / `Patient@123`

## Local setup

### Backend
1. Open a terminal in `C:\Users\Lenovo\Desktop\Doctor Book\Backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update values if needed.
   Startup default: `AUTO_APPROVE_DOCTORS=true`
4. Seed sample data if you want demo accounts:
   ```bash
   npm run seed
   ```
5. Start the backend:
   ```bash
   npm run dev
   ```

### Frontend
1. Open a terminal in `C:\Users\Lenovo\Desktop\Doctor Book\Frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Suggested next production upgrades

- Replace the placeholder payment flow with real Stripe or Razorpay order/session creation
- Move uploaded images to cloud storage like Cloudinary or S3
- Add refresh tokens / cookie auth if you want longer-lived sessions
- Add real-time slot sync with Socket.IO
- Add notification workers for email/SMS
- Add tests:
  - backend: Jest + Supertest
  - frontend: React Testing Library

## Deployment

### Backend
- Render or Railway
- Set environment variables from `Backend/.env.example`
- Use MongoDB Atlas for `MONGODB_URI`

### Frontend
- Vercel or Netlify
- Set `VITE_API_BASE_URL` to the deployed backend API URL

## Notes

- Payment is implemented as a simple selectable booking mode for now so the data model is ready without hard-coding a provider.
- Real-time availability, calendar sync, reviews, and notifications are not fully implemented yet, but the current structure is designed so those features can be added cleanly.
