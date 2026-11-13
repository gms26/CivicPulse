<div align="center">

# 🏛️ CivicPulse

### Community Issue Reporting & Resolution Platform

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

*Empowering citizens to report local civic issues — and empowering authorities to resolve them.*

[Live Frontend](https://civicpulse-frontend-3mb8.onrender.com) · [Live Backend API](https://civicpulse-d6a0.onrender.com) · [Report Bug](https://github.com/gms26/CivicPulse/issues)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Endpoints](#-api-endpoints)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment-rendercom)
- [License](#-license)

---

## 📖 About

**CivicPulse** is a production-grade, full-stack web application that bridges the gap between citizens and local authorities. Citizens can report civic issues (broken roads, water leaks, power outages, sanitation problems, etc.) with photos and location data. Administrators can manage, prioritize, assign, and resolve issues — with real-time notifications and email alerts keeping everyone in the loop.

The platform includes public analytics dashboards, paginated data views, issue audit timelines, and a responsive design that works seamlessly on desktop and mobile.

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** (Citizen & Admin Portal) | [https://civicpulse-frontend-3mb8.onrender.com](https://civicpulse-frontend-3mb8.onrender.com) |
| **Backend** (REST API & WebSockets) | [https://civicpulse-d6a0.onrender.com](https://civicpulse-d6a0.onrender.com) |

> **Note:** Free-tier Render services may spin down after inactivity. The first request might take 30–60 seconds to wake the server.

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Citizen | Register a new account | — |
| Admin | Set via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (see below) | — |

There are no default credentials. The admin account is created at startup
from those two environment variables; when they are unset, no admin exists.

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Core language (Docker image builds with JDK 21) |
| **Spring Boot** | 3.3.5 | REST API framework, dependency injection, auto-config |
| **Spring Security** | 6.x | Authentication & authorization (JWT + role-based) |
| **Spring Data JPA** | 3.x | ORM / database access layer |
| **Spring WebSocket** | STOMP | Real-time push notifications |
| **Spring Mail** | JavaMailSender | Email notifications (Gmail SMTP) |
| **PostgreSQL** | 15+ | Relational database (hosted on Supabase) |
| **Cloudinary** | SDK 1.34 | Image upload & CDN hosting |
| **JJWT** | 0.12.6 | JWT token creation & validation |
| **Lombok** | 1.18.36 | Used sparingly (constructors, logging); most DTOs/entities use hand-written builders |
| **Maven** | Wrapper | Build & dependency management |
| **Docker** | Dockerfile | Containerized production deployment |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI library (functional components + hooks) |
| **Vite** | 8 | Build tool & dev server |
| **Tailwind CSS** | v3 | Utility-first CSS framework |
| **React Router** | v7 | Client-side routing & navigation |
| **Axios** | — | HTTP client with interceptors |
| **Recharts** | — | Data visualization (charts & graphs) |
| **React Hot Toast** | — | Toast notification system |
| **Lucide React** | — | Modern icon library |
| **STOMP.js + SockJS** | — | WebSocket client for real-time updates |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Render** | Cloud hosting (backend Web Service + frontend Static Site) |
| **Supabase** | Managed PostgreSQL database |
| **Cloudinary** | Image storage & CDN |
| **Gmail SMTP** | Transactional email delivery |

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control: **Citizen** and **Admin** roles
- Secure password hashing with BCrypt
- Auto-redirect based on role after login
- Token stored in `localStorage`; an expired or invalid token redirects to login (there are no refresh tokens)

### 📝 Issue Reporting (Citizen)
- Report civic issues with title, description, and category
- Upload photo evidence via Cloudinary integration
- Specify location address with coordinates
- View personal dashboard with all reported issues
- Track issue status changes in real-time

### 🛡️ Admin Management Console
- View all reported issues with filters (status, category, priority, keyword search)
- Update issue status: `OPEN` → `IN_PROGRESS` → `RESOLVED`
- Set issue priority: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- Assign issues to specific admin users
- Add comments on status changes (visible in audit trail)

### 🔔 Real-Time Notifications
- WebSocket-powered instant push notifications (STOMP protocol)
- Citizens notified immediately when their issue status changes
- Notification bell with unread count badge
- Mark individual or all notifications as read

### 📧 Email Notifications
- Branded HTML email sent on every status change
- Professional template with CivicPulse blue header
- Shows old status → new status with color-coded badges
- Includes admin comment and "View on CivicPulse" CTA button
- Graceful fallback — email failure never breaks the status update
- Configurable via `MAIL_USERNAME` and `MAIL_APP_PASSWORD` env vars

### 📊 Public Analytics Dashboard
- Open to everyone — no login required
- Interactive charts built with Recharts:
  - Issues by category (bar chart)
  - Issues by status (pie chart)
  - Resolution trends over time
- High-level KPI cards (total issues, resolved count, resolution rate)

### 📄 Paginated Dashboards
- 10 issues per page across all dashboards
- Page number buttons with smart ellipsis (max 5 visible)
- Previous / Next navigation with disabled states
- "Showing X–Y of Z issues" summary text
- Reusable `Pagination` component shared across Citizen & Admin views

### 🕐 Issue Timeline / Audit Trail
- Full chronological history of every issue
- Vertical timeline with color-coded status dots:
  - 🔵 Blue — Issue Created
  - 🔴 Red — OPEN
  - 🟡 Amber — IN PROGRESS
  - 🟢 Green — RESOLVED
- Shows who made each change, when, and their comment
- Accessible via `[Details] [Timeline]` tabs in the issue detail modal
- Timeline lazy-loaded on tab click for performance
- Auth-required endpoint (not publicly accessible)

---

## 📁 Project Structure

```
CivicPulse/
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/civicpulse/
│   │   ├── config/                   # Security, CORS, WebSocket, Cloudinary, JWT filter, admin seeding
│   │   ├── controller/               # REST controllers (Auth, Issue, Admin, Analytics, Notification)
│   │   ├── dto/
│   │   │   ├── request/              # IssueCreateRequest, IssueUpdateRequest, LoginRequest, RegisterRequest
│   │   │   └── response/             # IssueResponse, IssueUpdateResponse, AuthResponse, AnalyticsResponse, NotificationResponse
│   │   ├── entity/                   # JPA entities (User, Issue, IssueUpdate, Notification)
│   │   │   └── enums/                # IssueStatus, IssueCategory, Priority, Role
│   │   ├── exception/                # Global exception handler + custom exceptions
│   │   ├── repository/               # Spring Data JPA repositories
│   │   └── service/                  # Business logic (Issue, Admin, Auth, Email, Notification, Analytics, Cloudinary, JWT)
│   ├── src/main/resources/
│   │   ├── application.yml           # Config (DB, JPA, Mail, JWT, Cloudinary)
│   │   └── application-prod.yml      # Production config (Render env vars)
│   ├── Dockerfile                    # Production container
│   └── pom.xml                       # Maven dependencies
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── api/                      # Axios API layer (auth, issue, admin, analytics)
│   │   ├── components/
│   │   │   ├── common/               # Button, Card, Loader, Modal, StatusBadge, Pagination
│   │   │   ├── dashboard/            # Dashboard-specific widgets
│   │   │   ├── issues/               # IssueCard, IssueDetailModal, IssueFilters, IssueTimeline
│   │   │   └── layout/              # Navbar, Footer, NotificationBell
│   │   ├── context/                  # AuthContext (React Context API)
│   │   ├── hooks/                    # useAuth, useWebSocket
│   │   ├── pages/
│   │   │   ├── admin/                # AdminDashboard, AdminAnalytics
│   │   │   ├── public/               # PublicDashboard
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── ReportIssuePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx                   # Routes & layout
│   │   └── main.jsx                  # Entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🏗 Architecture

<div align="center">
  <img src="./architecture.svg" alt="Animated Architecture Diagram" width="800" />
</div>

### 🔄 Architectural Data & Notification Flow
**1. Citizen Reports Issue (Responsive Website):** Citizens can use the platform on their mobile phones or desktops to upload images and submit reports.
**2. REST API Request:** The frontend sends a POST request with the form data to the Spring Boot Backend.
**3. Data Storage:** The Backend immediately stores the image evidence on Cloudinary and saves all textual and location data to the PostgreSQL database.
**4. Admin Updates Status:** Local Authorities (Admins) log in to the Admin Management Console, monitor incoming issues using priority/category filters, and update an issue's status (e.g., to "In Progress").
**5. Real-Time Notifications (Target: The Reporting Citizen):** When an Admin updates a ticket, the system automatically notifies the **exact Citizen who originally reported it**:
  - **WebSockets (STOMP):** The Backend pushes an instant, real-time alert to the Citizen's frontend, incrementing their notification bell in the navbar without a page reload.
  - **Email (SMTP):** Simultaneously, the backend triggers a branded HTML email via Gmail SMTP detailing the status change straight to the Citizen's inbox.
**6. Continuous Monitoring:**
  - **For Citizens:** They can track the exact audit timeline (who changed what and when) via their personal dashboard.
  - **For Public & Admins:** Resolution trends, status metrics, and category breakdowns can be monitored live via the interactive Analytics Dashboard.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new citizen | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |

### Issues (Citizen)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/issues` | Create issue (multipart with image) | Citizen |
| `GET` | `/api/issues` | List all issues (paginated, filtered) | No |
| `GET` | `/api/issues/my` | Get current user's issues | Citizen |
| `GET` | `/api/issues/{id}` | Get issue details | No |
| `GET` | `/api/issues/{id}/timeline` | Get issue audit timeline | Authenticated |
| `DELETE` | `/api/issues/{id}` | Delete own issue | Citizen |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/issues` | List all issues (paginated; filters: category, status, priority, keyword) | Admin |
| `PUT` | `/api/admin/issues/{id}/status` | Update issue status | Admin |
| `PUT` | `/api/admin/issues/{id}/priority` | Set issue priority | Admin |
| `PUT` | `/api/admin/issues/{id}/assign` | Assign issue to admin | Admin |

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/analytics/summary` | Dashboard KPI stats | No |
| `GET` | `/api/analytics/by-category` | Issues grouped by category | No |
| `GET` | `/api/analytics/by-status` | Issues grouped by status | No |
| `GET` | `/api/analytics/trends` | Issues per day, last 30 days | No |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/notifications` | Get user notifications (paginated) | Authenticated |
| `PUT` | `/api/notifications/{id}/read` | Mark notification as read | Authenticated |
| `PUT` | `/api/notifications/read-all` | Mark all as read | Authenticated |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `ws://host/ws` | STOMP WebSocket connection |
| `/user/queue/notifications` | User-specific notification channel |

---

## 💻 Local Setup

### Prerequisites
- Java 17+ (the Docker build uses JDK 21; `pom.xml` targets Java 17)
- Node.js 20+
- PostgreSQL (local or remote)
- A free [Cloudinary](https://cloudinary.com/) account (required: the backend refuses to start without Cloudinary credentials)

### 1. Clone the Repository
```bash
git clone https://github.com/gms26/CivicPulse.git
cd CivicPulse
```

### 2. Backend Setup
```bash
cd backend

# Create a PostgreSQL database named 'civicpulse'
# Default expects localhost:5432, user: postgres, pass: postgres

# Required env vars (no defaults — the app will not start without them):
#   JWT_SECRET             signing key, generate with: openssl rand -base64 32
#   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# Optional, to create the first admin account at startup:
#   ADMIN_EMAIL, ADMIN_PASSWORD   (min 8 characters)

# Run the application
./mvnw spring-boot:run        # Linux/Mac
.\mvnw.cmd spring-boot:run    # Windows
```
Backend starts on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend starts on `http://localhost:5173`

> **Note:** In dev mode, Vite proxies `/api` requests to `localhost:8080` automatically.

---

## 🔐 Environment Variables

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | PostgreSQL connection (default profile) | `jdbc:postgresql://localhost:5432/civicpulse` |
| `DATABASE_URL` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` | PostgreSQL connection (`prod` profile, used by the Dockerfile) | `jdbc:postgresql://host:5432/civicpulse` |
| `JWT_SECRET` | **Required.** 256-bit+ signing key (Base64). No default. | `openssl rand -base64 32` |
| `JWT_EXPIRATION` | Token expiry in ms | `86400000` (24h) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account, created at startup when both are set (password min 8 chars). No default credentials exist. | `admin@example.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (**required to boot**) | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` |
| `FRONTEND_URL` | CORS allowed origin | `https://your-frontend.onrender.com` |
| `MAIL_USERNAME` | Gmail address for sending emails | `your-email@gmail.com` |
| `MAIL_APP_PASSWORD` | Gmail App Password (16 chars) | `xxxx-xxxx-xxxx-xxxx` |

> ⚠️ **MAIL_APP_PASSWORD** must be a Gmail App Password, NOT your regular Gmail password.
> Generate one at: Google Account → Security → 2-Step Verification → App Passwords.
> If not configured, the app works normally — email notifications are silently skipped.

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Deployed backend URL | `https://civicpulse-d6a0.onrender.com` |
| `VITE_WS_URL` | Backend URL for WebSocket | `https://civicpulse-d6a0.onrender.com` |

---

## 🚀 Deployment (Render.com)

### 1. Database
- Create a PostgreSQL instance on **Supabase** (or Render)
- Copy the connection URL

### 2. Backend (Web Service)
- Connect to this GitHub repo
- Root Directory: `backend`
- Docker auto-detected via `Dockerfile`
- Set all backend environment variables in Render dashboard

### 3. Frontend (Static Site)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Publish Directory: `dist`
- Set `VITE_API_URL` and `VITE_WS_URL` environment variables

### 4. Email Setup (Optional)
- Add `MAIL_USERNAME` and `MAIL_APP_PASSWORD` to backend environment
- Emails are automatically sent when admin updates issue status

### 5. First Admin Account
- Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the backend environment before the first deploy (or before the next restart). The account is created once at startup; changing the variables later does not change the existing account's password.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built with ❤️ by [gms26](https://github.com/gms26)**

</div>
