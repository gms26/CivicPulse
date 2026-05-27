# CivicPulse — Community Issue Reporting & Resolution Platform

CivicPulse is a full-stack web application designed to empower citizens to report local civic issues (like broken roads, water leaks, and power outages) directly to local authorities. The platform facilitates real-time tracking, administrative management, and community-wide analytics to ensure swift resolutions.

## 🚀 Live Demo
- **Frontend (Citizen & Admin Portal):** [Placeholder: Render URL]
- **Backend (REST API & WebSockets):** [Placeholder: Render URL]

## 🛠 Tech Stack
| Tier | Technology | Purpose |
|------|------------|---------|
| **Frontend** | React 18, Vite 5, Tailwind CSS v3 | User Interface, Responsive Design |
| **Backend** | Java 21, Spring Boot 3 | REST API, Core Business Logic |
| **Database** | PostgreSQL | Relational Data Persistence |
| **Real-time** | Spring WebSockets (STOMP) | Live notifications and dashboard updates |
| **Storage** | Cloudinary | Secure image hosting for issue evidence |
| **Auth** | Spring Security + JWT | Role-based access control (Citizen/Admin) |
| **Charts** | Recharts | Analytics and Data Visualization |

## ✨ Key Features
- [x] **Secure Authentication**: JWT-based login with strict Role-Based Access Control.
- [x] **Citizen Reporting**: Report issues with category, location, and photo evidence.
- [x] **Admin Management Console**: Update status, prioritize, and assign issues.
- [x] **Real-Time Notifications**: Instant WebSocket alerts when an issue's status changes.
- [x] **Analytics Dashboards**: Interactive charts mapping resolution rates and category trends.
- [x] **Cloudinary Integration**: Seamless handling of Multipart File image uploads.

---

## 💻 Local Setup Instructions

### Prerequisites
- Java 21+
- Node.js 20+
- PostgreSQL server running locally (or remote)
- A free [Cloudinary](https://cloudinary.com/) account

### 1. Backend Setup
1. Open a terminal in the `backend/` directory.
2. The default profile (`application.yml`) expects a local PostgreSQL database named `civicpulse` at `localhost:5432` with username/password `postgres/postgres`. Create this database manually.
3. Start the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. The backend will start on `http://localhost:8080`.

### 2. Frontend Setup
1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173`.

> **Note on JWT Storage**: Currently, JWTs are stored in `localStorage` for simplicity. As a production improvement, this should be migrated to `httpOnly` secure cookies to prevent XSS vulnerability.

---

## 🔐 Environment Variables

### Backend (`application-prod.yml` via Render Env)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL JDBC Connection String |
| `DATABASE_USERNAME` | DB Username |
| `DATABASE_PASSWORD` | DB Password |
| `JWT_SECRET` | 256-bit+ secure signing key |
| `JWT_EXPIRATION` | Token expiry in milliseconds (e.g., 86400000 for 24h) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `FRONTEND_URL` | Allowed CORS origin (e.g., https://your-frontend.onrender.com) |

### Frontend (`.env` file or Render Env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Deployed backend URL (e.g., https://your-backend.onrender.com) |
| `VITE_WS_URL` | Deployed backend URL for sockets (e.g., https://your-backend.onrender.com) |

*(See `frontend/.env.example` for reference).*

---

## 🌐 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register a new Citizen | No |
| `POST` | `/api/auth/login` | Authenticate and receive JWT | No |
| `POST` | `/api/issues` | Create a new issue (Multipart) | Yes (Citizen) |
| `GET`  | `/api/issues/my` | Get current user's issues | Yes (Citizen) |
| `GET`  | `/api/admin/issues` | Get all issues (paginated/filtered) | Yes (Admin) |
| `PUT`  | `/api/admin/issues/{id}/status` | Update issue status | Yes (Admin) |
| `GET`  | `/api/analytics/summary` | Get high-level KPI stats | No |
| `GET`  | `/api/notifications` | Get user notifications | Yes (Any) |

---

## 🚀 Deployment Steps (Render.com)

1. **Push to GitHub**: Commit the entire monorepo (`backend/` and `frontend/`) to a GitHub repository.
2. **Database Setup**: Create a new PostgreSQL instance on Render. Copy the Internal or External Database URL.
3. **Deploy Backend (Web Service)**:
   - Create a New Web Service connected to your repo.
   - Set the **Root Directory** to `backend`.
   - Render will automatically detect the `Dockerfile` via the provided `render.yaml`.
   - Fill in all environment variables (DB, JWT, Cloudinary) in the Render dashboard.
4. **Deploy Frontend (Static Site)**:
   - Create a New Static Site.
   - Set the **Root Directory** to `frontend`.
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add Environment Variables: `VITE_API_URL` and `VITE_WS_URL` pointing to your deployed backend URL.

---

## 📸 Screenshots
*(Coming soon after deployment...)*

## 📄 License
This project is licensed under the MIT License.
