# 🚚 ZAPSHIFT

**ZAPSHIFT** is a full‑stack, role‑based parcel pickup & delivery management system built to model real‑world logistics workflows. It handles everything from parcel booking and payment to rider assignment, tracking, and delivery confirmation- all in a single MERN‑based platform.

> Designed with scalability, security, and operational clarity in mind.

---

### Live site: zap-shift-courier-service.web.app

## 🔍 What This Project Demonstrates

- Real‑world **multi‑role system design**
- Secure **role‑based access control** (User / Rider / Admin)
- End‑to‑end **delivery lifecycle management**
- Clean separation of frontend, backend, and business logic
- Production‑style dashboard architecture

---

## 👥 Role‑Based Features

### 👤 User (Customer)

- Create parcels with pickup & delivery details
- Dynamic cost calculation
- Secure online payment
- Auto‑generated tracking number
- Real‑time parcel tracking
- Search parcels by phone or tracking ID
- Payment history & delivery timeline

---

### 🚴 Rider (Delivery Agent)

- View assigned pickup & delivery tasks
- Confirm pickup using tracking verification
- Handle within‑city & inter‑district deliveries
- Confirm successful delivery
- Automatic earnings calculation
- Task‑focused dashboard with live status updates

---

### 🛠️ Admin (Operations)

- Approve / reject rider applications
- Assign pickup & delivery riders
- Manage parcel routing across service centers
- Monitor full parcel lifecycle (8‑step flow)
- Track earnings, deliveries, and service center performance
- Role management (User ↔ Admin ↔ Rider)

---

## 🔄 Parcel Lifecycle (High‑Level)

1. Created → **Unpaid**
2. Paid → **Ready for Pickup**
3. Picked up → **In Transit**
4. Service center handling (if inter‑district)
5. Shipped → **Ready for Delivery**
6. Delivered → **Completed**

Each status update automatically generates a tracking record.

---

## 📊 Dashboard Highlights

- Role‑based navigation & protected routes
- Real‑time stats and analytics (charts & counters)
- Status‑driven UI updates
- Responsive, mobile‑friendly layout

---

## 🧱 Tech Stack

### Frontend

- React
- Tailwind CSS
- DaisyUI
- React Router
- TanStack Query
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Role‑based authorization

### Integrations & Tools

- Stripe (Payments)
- Firebase Authentication
- RESTful API architecture

---

## 🔐 Security

- JWT‑protected APIs
- Role‑specific route guards
- Server‑side validation
- Secure payment verification

---

## ⭐ Why ZAPSHIFT

ZAPSHIFT focuses on **practical system design**, clean UI/UX, and realistic logistics workflows, making it a strong example of a production‑style MERN application.

---

**Built to reflect how real delivery platforms operate, not just a CRUD app.**

