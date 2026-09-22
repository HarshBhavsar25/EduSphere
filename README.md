# 🎯 EduSphere

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Flask: 3.0](https://img.shields.io/badge/Flask-3.0-lightgrey.svg)](https://flask.palletsprojects.com/)
[![React: 19.2](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev/)
[![Vite: 5.4](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![MongoDB: Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Groq: Cloud](https://img.shields.io/badge/Groq-Llama%203.3%20%7C%20GPT--OSS-orange.svg)](https://groq.com/)
[![Blockchain: Algorand](https://img.shields.io/badge/Blockchain-Algorand%20TestNet-121212.svg)](https://algorand.technologies/)
[![3D: Three.js](https://img.shields.io/badge/3D-Three.js%20WebGL-black.svg)](https://threejs.org/)
[![Docker: Ready](https://img.shields.io/badge/Docker-Multi--Stage-2496ED.svg)](https://www.docker.com/)

**Next-Generation AI Campus Placement Intelligence, Blockchain Credentialing & Virtual Campus Twin**  
*Tailored for Higher Education Institutions &bull; Modeled on P.E.S. Modern College of Engineering*

[Explore Documentation (MD)](./PROJECT_DOCUMENTATION.md) &bull; [Download Documentation (PDF)](./EduSphere_Project_Documentation.pdf)

</div>

---

## 📖 Overview

**EduSphere** is an AI-powered, full-stack campus recruitment and placement management platform. It unites students, Training & Placement Officers (TPOs), and corporate recruiters through predictive placement analytics, generative AI preparation tools, Algorand blockchain credential anchoring, and an interactive 3D virtual campus.

```mermaid
graph TB
    subgraph Client Layer ["Client Layer (React 19 + Vite)"]
        UI_Student["Student Dashboard & AI Prep Suite"]
        UI_Admin["TPO Placement Analytics Portal"]
        UI_Interview["ARIA Voice AI Interviewer"]
        UI_3D["Three.js 3D Virtual Campus"]
        UI_Cohort["2D Cohort Sensor Monitor"]
    end

    subgraph Gateway ["Web & Application Gateway"]
        CORS["Flask-CORS & Request Handler"]
        JWT_Auth["JWT RBAC Guard (HS256)"]
        KeepAlive["Keep-Alive Ping Handler (/api/ping)"]
    end

    subgraph Service Layer ["Backend Services (Python Flask 3.0)"]
        AuthSvc["Auth Service (routes/auth.py)"]
        StudentSvc["Student Service (routes/students.py)"]
        CompanySvc["Company & Job Service (routes/companies.py, jobs.py)"]
        PlacementSvc["Placement Service (routes/placements.py)"]
        AnalyticsSvc["Aggregation Engine (routes/analytics.py)"]
        AIEngine["AI Engine & Groq Client (ai_engine.py, routes/ai_services.py)"]
        AlgoSvc["Algorand Blockchain Client (algorand_utils.py)"]
    end

    subgraph External Services ["External Platforms & Storage"]
        MongoDB[(MongoDB Atlas / Document DB)]
        GroqLLM["Groq Cloud API (Llama 3.3 / GPT-OSS-120B)"]
        AlgorandNet["Algorand TestNet (Node Cloud)"]
        OCREngine["Tesseract OCR & PyPDF2 Engine"]
    end

    Client Layer --> Gateway
    Gateway --> Service Layer
    Service Layer --> MongoDB
    AIEngine --> GroqLLM
    AIEngine --> OCREngine
    AlgoSvc --> AlgorandNet
```

---

## ✨ Key Features

### 🎓 Student Experience & AI Suite
* **🎙️ ARIA — Voice-First AI Technical Interviewer**:
  * Multi-turn voice conversation loop using the Web Speech API (`SpeechRecognition` & `SpeechSynthesis`).
  * Supports **11 language accents**: English (US & India), Hindi, Marathi, Tamil, Telugu, Kannada, Gujarati, French, German, and Spanish.
  * Real-time emotion & confidence detection (*Confident*, *Nervous*, *Enthusiastic*, *Unsure*, *Neutral*).
  * Animated reactive avatar with talking rings, blinking eyes, and voice level bars.
  * Turn-by-turn answer scoring (0–100) and a comprehensive final performance dossier.
* **📄 AI Resume ATS Analyzer & OCR**:
  * Multimodal upload supporting digital PDFs (`PyPDF2`) and scanned resume images (`Tesseract OCR`).
  * ATS match scoring, detected technical skills, strengths, weaknesses, and improvement recommendations.
* **🧪 Adaptive 20-Question Mock Test Engine**:
  * Dynamic MCQ placement test generator powered by Groq LLM inference across subjects (*DSA*, *General Aptitude*, *Core CS*, *Web Dev*) and difficulties (*Beginner*, *Intermediate*, *Advanced*).
  * Timed assessment interface, review flags, detailed post-test explanations, and historical score tracking.
* **💰 Predictive Salary Calculator**:
  * Calibrated regression model predicting realistic min, avg, and max CTC for fresh graduates in India based on CGPA, skills, projects, and internships.
* **🗺️ 6-Month Career Roadmap**:
  * Personalized, milestone-based preparation plan spanning DSA fundamentals, system design, capstone projects, and recruitment drives.
* **💼 Intelligent Job Recommendation Engine**:
  * Heuristic skill matrix matching student profiles with active corporate openings.

---

### 👨‍💼 Admin & Placement Officer (TPO) Intelligence Portal
* **📊 Executive Real-Time Placement Analytics**:
  * High-performance MongoDB aggregation pipelines:
    * **Package Statistics**: Real-time average, highest, and lowest compensation packages.
    * **Salary Distribution Histogram**: MongoDB `$bucket` aggregation into market brackets (`0-3`, `3-5`, `5-8`, `8-12`, `12-20`, `20+ LPA`).
    * **Branch-wise Performance**: Multi-stage `$lookup` computing placement rates and average CTC per department.
    * **CGPA vs. CTC Correlation**: Scatter data analyzing academic score impact on hiring offers.
    * **Skill Demand Matrix**: Frequency ranking of top 15 demanded skills across hiring partners.
    * **Recruitment Seasonality**: Monthly placement velocity trends.
    * **Gender Diversity Ratio**: Cohort distribution audit.
* **👥 Student & Corporate Partner Management**:
  * Complete CRUD, regex search, branch filters, pagination, and confirmed offer allocation.
* **📥 One-Click CSV Data Exports**:
  * Direct downloads for `students_export.csv` and `placements_export.csv`.
* **⚙️ Runtime LLM Configuration**:
  * Real-time Groq API key and model switching with runtime environment hot-reloading.

---

### ⛓️ Algorand Blockchain Credential Verification
* **Immutable Academic Records**: Student profiles and verified placement milestones are serialized and anchored to the **Algorand TestNet** via zero-ALGO note transactions.
* **Cryptographic Tamper-Proofing**: Confirmed within 3.5 seconds on-chain, storing an immutable `blockchain_tx_id` for independent third-party recruiter verification on any public Algorand explorer.

---

### 🏢 3D Virtual Campus & 2D Cohort Analytics
* **🌐 3D Architectural Digital Twin**:
  * Interactive WebGL model of **P.E.S. Modern College of Engineering** rendered with Three.js.
  * G+4 floor isolation (`G`, `1`, `2`, `3`, `4`, `ALL`), 3D exploded view, cross-section slicer, night mode, and click-to-inspect room analytics.
* **📡 2D Cohort Sensor Monitoring & Grok CampusAI**:
  * Live simulated IoT sensor network tracking room occupancy across campus.
  * Automated bottleneck detection and fire-safety overcapacity alerts.
  * Context-aware **Grok CampusAI** voice-enabled chatbot answering live queries about campus distribution.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19.2, Vite 5.4, React Router DOM v7, Lucide React, FontAwesome |
| **Styling & Visualization** | Vanilla CSS3 Glassmorphism tokens, Chart.js 4.5, `react-chartjs-2` |
| **Audio & 3D WebGL** | Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), Three.js WebGL |
| **Backend API** | Python 3.10+, Flask 3.0, Gunicorn 21.2, Flask-CORS |
| **Database** | MongoDB Atlas / Local MongoDB, PyMongo 4.6 |
| **AI Inference** | Groq Cloud SDK (`groq==0.5.0`), Llama 3.3 70B Versatile, GPT-OSS-120B |
| **Document Processing** | PyPDF2, Tesseract OCR (`pytesseract`), Pillow |
| **Blockchain** | Algorand TestNet (`py-algorand-sdk==2.8.0`) |
| **Authentication** | PyJWT (HS256), Werkzeug PBKDF2 Password Hashing |
| **DevOps & Cloud** | Docker Multi-Stage, Kubernetes (`k8s/`), Render Cloud |

---

## 🌐 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login | Public |
| `POST` | `/api/auth/student/login` | Student login (auto-provisions on first visit) | Public |
| `POST` | `/api/auth/student/register` | Student registration | Public |
| `GET` | `/api/auth/verify` | Validate JWT token & fetch user profile | Bearer Token |
| `POST` | `/api/auth/change-password` | Update account password | Bearer Token |

### 👨‍🎓 Student Management (`/api/students`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | List students (query: `branch`, `placed`, `search`, `page`) | Bearer Token |
| `GET` | `/api/students/<id>` | Get single student details | Bearer Token |
| `POST` | `/api/students` | Create student profile & anchor to Algorand TestNet | Admin |
| `PUT` | `/api/students/<id>` | Update student profile & refresh blockchain anchor | Admin |
| `DELETE` | `/api/students/<id>` | Delete student profile and related placement records | Admin |
| `GET` | `/api/students/branches` | List all unique engineering branches | Bearer Token |

### 🏢 Companies & Jobs (`/api/companies`, `/api/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | List companies (filter: `industry`, `search`) | Bearer Token |
| `POST` | `/api/companies` | Create new company profile | Admin |
| `PUT` | `/api/companies/<id>` | Update company hiring details & salary range | Admin |
| `DELETE` | `/api/companies/<id>` | Remove company profile | Admin |
| `GET` | `/api/jobs/recommendations/<student_id>` | Return top matched roles with fit score & reasons | Bearer Token |

### 📋 Placements (`/api/placements`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/placements` | List confirmed/pending placement records | Bearer Token |
| `POST` | `/api/placements` | Record new placement offer | Admin |
| `PUT` | `/api/placements/<id>` | Update placement record | Admin |
| `DELETE` | `/api/placements/<id>` | Delete placement record | Admin |

### 📈 Executive Analytics (`/api/analytics`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/stats` | Placement KPI counters (total, placed %, packages) | Bearer Token |
| `GET` | `/api/analytics/placement-overview` | Placed vs unplaced ratio | Bearer Token |
| `GET` | `/api/analytics/salary-distribution` | Salary histogram buckets (0-3 to 20+ LPA) | Bearer Token |
| `GET` | `/api/analytics/branch-stats` | Departmental placement metrics | Bearer Token |
| `GET` | `/api/analytics/top-companies` | Top 10 corporate recruiters by hiring volume | Bearer Token |
| `GET` | `/api/analytics/cgpa-vs-package` | Scatter data: CGPA vs offered CTC | Bearer Token |
| `GET` | `/api/analytics/top-skills` | Frequency ranking of top in-demand skills | Bearer Token |
| `GET` | `/api/analytics/monthly-trends` | Monthly placement seasonality | Bearer Token |
| `GET` | `/api/analytics/gender-distribution` | Gender diversity distribution | Bearer Token |

### 🤖 AI Services (`/api/ai`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/analyze-resume` | Multipart upload (PDF/Image) for ATS scoring & OCR | Bearer Token |
| `POST` | `/api/ai/skill-gap` | Calculate missing skills for target role | Bearer Token |
| `POST` | `/api/ai/predict-salary` | Predictive salary calculator | Bearer Token |
| `POST` | `/api/ai/roadmap` | Generate 6-month personalized career roadmap | Bearer Token |
| `POST` | `/api/ai/interview` | ARIA voice interview loop (or `__START__` / `__FINISH__`) | Bearer Token |
| `POST` | `/api/ai/generate-test` | Generate 20-question dynamic MCQ mock test | Bearer Token |
| `POST` | `/api/ai/save-test-result` | Save exam answers and score to `test_history` | Bearer Token |
| `GET` | `/api/ai/test-history/<student_id>` | Fetch student exam history | Bearer Token |
| `POST` | `/api/ai/chat` | Conversational placement assistant | Bearer Token |
| `POST` | `/api/ai/ask` | Grok CampusAI sensor-aware campus occupancy query | Bearer Token |

### 🛠️ Admin & System (`/api/admin`, `/api/config`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/export/students` | Download `students_export.csv` | Admin |
| `GET` | `/api/admin/export/placements` | Download `placements_export.csv` | Admin |
| `POST` | `/api/admin/reset-database` | Reset collections (`confirm: true` required) | Admin |
| `GET` | `/api/config` | View masked Groq key and active model | Admin |
| `POST` | `/api/config` | Update Groq API key and model at runtime | Admin |
| `GET` | `/api/ping` | Keep-alive heartbeat (prevents container idling) | Public |
| `GET` | `/health` | Application & MongoDB health check | Public |

---

## 🚀 Getting Started

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & `npm`
* **MongoDB Atlas** account (or local MongoDB running on `mongodb://localhost:27017`)
* **Groq Cloud API Key** &rarr; [console.groq.com](https://console.groq.com)
* *(Optional)* Tesseract OCR installed locally for image-based resume parsing

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirematrix?retryWrites=true&w=majority
SECRET_KEY=your-secure-jwt-secret-key
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
ALGORAND_MNEMONIC=your_twenty_five_word_algorand_mnemonic_here
```

Seed initial demo data (optional):
```bash
python seed_data.py
```

Run the backend:
```bash
python app.py
```
*The backend starts at `http://localhost:5001`.*

---

### 2. Frontend Setup

```bash
cd ../frontend-react

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*The frontend starts at `http://localhost:5173`.*

---

### 3. Default Credentials

* **Admin Portal**:
  * Username: `admin`
  * Password: `admin123`
* **Student Portal**:
  * Email: Use any student email from the seed data (e.g. `aarav.sharma@example.com`)
  * Password: Any password with 6+ characters (auto-registers on first login)

---

## 🐳 Docker Deployment

EduSphere includes a production-ready multi-stage `Dockerfile`:

```bash
# Build the unified container
docker build -t edusphere:latest .

# Run the container
docker run -d -p 5001:5001 \
  -e MONGO_URI="your_mongodb_connection_string" \
  -e SECRET_KEY="your_jwt_secret" \
  -e GROQ_API_KEY="your_groq_api_key" \
  --name edusphere-app edusphere:latest
```
Access the application at `http://localhost:5001`.

---

## ☸️ Kubernetes Deployment

Pre-configured Kubernetes manifests are located in `k8s/`:
```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 📁 Project Structure

```
EduSphere/
├── Dockerfile                      # Multi-stage production container
├── render.yaml                     # Render Cloud deployment specification
├── PROJECT_DOCUMENTATION.md        # Comprehensive technical & system document
├── EduSphere_Project_Documentation.pdf # Formatted PDF documentation
├── generate_pdf.py                 # PDF generation utility
├── k8s/                            # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── secrets.yaml
├── backend/                        # Python Flask Backend
│   ├── app.py                      # App entry point & Blueprints
│   ├── config.py                   # Configuration loader & URI sanitizer
│   ├── db.py                       # MongoDB connection client
│   ├── models.py                   # Document schemas & serializers
│   ├── ai_engine.py                # Groq Cloud SDK & fallback heuristics
│   ├── algorand_utils.py           # Algorand TestNet blockchain anchoring
│   ├── seed_data.py                # Database seeder with realistic records
│   ├── requirements.txt            # Python dependencies
│   └── routes/                     # Modular API Blueprints
│       ├── auth.py                 # JWT authentication & auto-registration
│       ├── students.py             # Student CRUD & Algorand integration
│       ├── companies.py            # Recruiter management
│       ├── placements.py           # Confirmed placement records
│       ├── analytics.py            # MongoDB aggregation pipelines
│       ├── ai_services.py          # ARIA, resume OCR, tests, roadmap
│       ├── jobs.py                 # Recommendation matching engine
│       ├── admin.py                # CSV exports & database reset
│       └── config.py               # Runtime Groq key & model management
└── frontend-react/                 # React 19 Frontend (Vite)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── public/
    │   ├── campus3d.html           # Embedded Three.js WebGL canvas
    │   └── campus3d_script.js      # 3D model controls & floor isolation
    └── src/
        ├── index.css               # Glassmorphism design system & variables
        ├── App.jsx                 # Routes & Toast providers
        ├── components/
        │   ├── Dashboard/          # Admin & Student dashboards
        │   ├── AIInterview/        # ARIA Voice AI Interviewer
        │   ├── AIAnalysis/         # Resume ATS scorer, roadmap, salary
        │   ├── MockTest/           # Dynamic MCQ placement test engine
        │   ├── VirtualCampus/      # 3D Digital Twin wrapper
        │   ├── CohortAnalytics/    # 2D Sensor occupancy & Grok CampusAI
        │   ├── Management/         # Student & Company data tables
        │   ├── Admin/              # Database maintenance & exports
        │   └── Settings/           # Runtime LLM configuration
        ├── context/
        │   ├── AuthContext.jsx     # JWT session & RBAC
        │   └── CampusContext.jsx   # Live simulated IoT sensor stream
        └── services/
            └── api.js              # Centralized Axios/fetch client & ping
```

---

## 👥 Contributors

* **Harsh Bhavsar**
* **Sanket Yeul**
* **Tanuja Giri**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
