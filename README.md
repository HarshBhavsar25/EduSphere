# 🎯 HireMatrix

> An AI-powered Campus Placement & Student Management Platform built with Flask + React

![Tech Stack](https://img.shields.io/badge/Stack-Flask%20%7C%20React%20%7C%20MongoDB-blue?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Groq%20LLM-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🚀 Overview

**HireMatrix** is a full-stack campus placement management system that leverages AI to streamline the hiring process for students, placement officers, and company recruiters. It features intelligent performance analytics, AI-powered mock tests, placement tracking, and role-based dashboards.

---

## ✨ Features

- 🤖 **AI Analysis** — Groq LLM-powered student performance insights and recommendations
- 📊 **Analytics Dashboard** — Visual breakdowns of placement stats, company trends, and student progress
- 🏢 **Company Management** — Add, update, and track recruiting companies and job listings
- 🎓 **Student Management** — Full student profile management with academic and placement records
- 📝 **Mock Tests** — AI-generated mock interview questions for placement preparation
- 🔐 **Role-Based Auth** — Separate portals for Admin, Students, and Placement Officers
- 📈 **Placement Tracking** — End-to-end tracking of offers, interviews, and selections
- ⚙️ **Admin Panel** — Full control over users, companies, and system configuration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, CSS (Glassmorphism UI) |
| **Backend** | Python, Flask, Flask-CORS |
| **Database** | MongoDB (via PyMongo) |
| **AI Engine** | Groq API (LLaMA models) |
| **Auth** | JWT (PyJWT) + bcrypt |
| **Deployment** | Render (via `render.yaml`) |

---

## 📁 Project Structure

```
HireMatrix/
├── backend/
│   ├── app.py              # Flask app entry point
│   ├── ai_engine.py        # Groq AI integration
│   ├── db.py               # MongoDB connection
│   ├── models.py           # Data models
│   ├── config.py           # App configuration
│   ├── routes/
│   │   ├── auth.py         # Authentication routes
│   │   ├── students.py     # Student management
│   │   ├── companies.py    # Company management
│   │   ├── jobs.py         # Job listings
│   │   ├── placements.py   # Placement tracking
│   │   ├── analytics.py    # Analytics endpoints
│   │   ├── ai_services.py  # AI endpoints
│   │   └── admin.py        # Admin routes
│   └── requirements.txt
│
└── frontend-react/
    └── src/
        ├── components/
        │   ├── AIAnalysis/     # AI insights UI
        │   ├── Dashboard/      # Role-based dashboards
        │   ├── Management/     # Company & student mgmt
        │   ├── MockTest/       # AI mock test interface
        │   ├── Admin/          # Admin panel
        │   └── Settings/       # User settings
        ├── context/            # React context (Auth)
        ├── services/           # API service layer
        └── pages/              # Page components
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key → [console.groq.com](https://console.groq.com)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

Run the backend:
```bash
python app.py
```

### Frontend Setup

```bash
cd frontend-react
npm install
npm run dev
```

---

## 🌐 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | User login |
| `POST /api/auth/register` | Register new user |
| `GET /api/students` | List all students |
| `GET /api/companies` | List all companies |
| `GET /api/jobs` | List job postings |
| `GET /api/placements` | Placement records |
| `GET /api/analytics/*` | Analytics data |
| `POST /api/ai/analyze` | AI student analysis |
| `POST /api/ai/mock-test` | Generate mock test |

---

## 🚀 Deployment

This project is configured for **Render** deployment via `render.yaml`.

```bash
# Backend runs with gunicorn
gunicorn app:app
```

---

## 📄 License

MIT License — feel free to use and modify.

---

## 👥 Contributors

- **Sanket Yeul** 
- **Harsh Bhavsar**
