# 🎯 EduSphere

![EduSphere Dashboard Mockup](/assets/dashboard-mock.png)

> **EduSphere** is a full-stack campus placement management system that leverages AI to streamline the hiring process for students, placement officers, and company recruiters. It features intelligent performance analytics, AI-powered mock tests, placement tracking, and role-based dashboards.

## 🚀 Features

- **🎓 Student Portal**: Track placement status, build AI-optimized resumes, and practice with AI Mock Interviews.
- **👨‍💼 Admin/Placement Officer Portal**: Analyze cohort performance, manage student profiles, and coordinate recruitment drives.
- **📊 Real-time Analytics Dashboard**: Live metrics for placement rates, top hiring companies, and salary distributions.
- **🤖 AI Agent Tools**: Automated resume scoring and interactive interview practice powered by Groq Llama3.
- **🗺️ Virtual Campus 3D**: Explore real campus facilities in an interactive 3D WebGL environment.
- **📍 Cohort Analytics 2D Area**: Live simulated occupancy and intelligence dashboard.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), CSS3 Glassmorphism, Recharts, Three.js (React Three Fiber)
- **Backend**: Python (Flask), Flask-CORS, python-dotenv
- **Database**: MongoDB (Atlas)
- **AI & Integrations**: Groq Cloud SDK (Llama 3 8B), Pinecone (Vector database for OCR search/RAG)
- **Live Data**: Web sockets (simulated frontend polling & REST pings).

## 📁 Project Structure

```text
EduSphere/ | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, CSS (Glassmorphism UI) |
| **Backend** | Python, Flask, Flask-CORS |
| **Database** | MongoDB (via PyMongo) |
| **AI Engine** | Groq API (LLaMA models) |
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
- **Sakshi Gaikwad**
- **Tanuja Giri**
