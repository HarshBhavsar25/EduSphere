# 🎓 EduSphere: Comprehensive Technical & System Documentation

> **EduSphere** is an AI-driven, full-stack Campus Placement Management & Intelligence System designed for higher education institutions (specifically modeled around **P.E.S. Modern College of Engineering**). It bridges the gap between students, Training & Placement Officers (TPOs), and corporate recruiters through predictive analytics, generative AI tools, blockchain credential verification, and interactive campus visualization.

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Database & Data Modeling](#4-database--data-modeling)
5. [Role-Based Access Control (RBAC) & Authentication](#5-role-based-access-control-rbac--authentication)
6. [Core Functional Modules](#6-core-functional-modules)
   - [Student Experience & AI Tools](#61-student-experience--ai-tools)
   - [Admin / Placement Officer Intelligence Portal](#62-admin--placement-officer-intelligence-portal)
   - [Algorand Blockchain Credential Verification](#63-algorand-blockchain-credential-verification)
   - [3D Virtual Campus & 2D Cohort Analytics](#64-3d-virtual-campus--2d-cohort-analytics)
7. [Comprehensive API Reference](#7-comprehensive-api-reference)
8. [DevOps, Deployment & Containerization](#8-devops-deployment--containerization)
9. [Local Development Setup](#9-local-development-setup)
10. [Resiliency, Fallback Architecture & Security](#10-resiliency-fallback-architecture--security)

---

## 1. Executive Summary

Campus placement operations at scale face significant operational and pedagogical challenges:
* **Fragmented Workflows**: Placement officers manually coordinate spreadsheets, student records, and company criteria.
* **Lack of Predictive Insights**: Administrators cannot easily identify at-risk students, branch-wise placement deficits, or salary trends before graduation cycles conclude.
* **Absence of Personalized Student Guidance**: Students lack automated, continuous preparation tools such as ATS-grade resume analyzers, realistic mock interviews, and skill-gap diagnostic roadmaps.
* **Credential Tampering**: Verifying academic records and placement offers with external recruiters is slow and susceptible to resume inflation.

**EduSphere** addresses these challenges in a unified, modern web platform:
1. **Intelligent Analytics**: High-performance MongoDB aggregation pipelines power real-time dashboards detailing placement rates, salary distributions, skill demand trends, and gender equity.
2. **Generative AI Agent Suite**: Powered by Groq Cloud (Llama 3.3 70B Versatile & GPT-OSS-120B), offering resume OCR & analysis, dynamic 20-question mock tests, voice-based multi-turn AI interviews with speech synthesis and emotion detection, salary prediction, and career roadmaps.
3. **Algorand Blockchain Anchoring**: Every student record modification is immutably anchored to the Algorand TestNet with zero-ALGO note transactions, providing permanent cryptographic proof of student achievements.
4. **Digital Twin Campus Experience**: An interactive 3D WebGL model of the college campus alongside a 2D simulated IoT crowd density & sensor alert dashboard for real-time facility monitoring.

---

## 2. System Architecture

```mermaid
graph TB
    subgraph Client Layer ["Client Layer (React 19 + Vite)"]
        UI_Student["Student Dashboard & AI Suite"]
        UI_Admin["Admin Placement Intelligence"]
        UI_Interview["ARIA AI Voice Interviewer"]
        UI_3D["Three.js 3D Virtual Campus"]
        UI_Cohort["2D Cohort Sensor Monitor"]
    end

    subgraph Gateway ["Web & Application Gateway"]
        CORS["Flask-CORS & Request Handler"]
        JWT_Auth["JWT Authentication & RBAC Guard"]
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

### Architectural Highlights
* **Single-Unit Monolith with Decoupled Build**: In production, the React frontend is compiled into static assets (`dist/`) and served directly by the Flask application via Gunicorn, eliminating cross-origin overhead while maintaining modern frontend DX during local development.
* **Stateless Token-Based Sessions**: PyJWT handles session authorization with 7-day tokens containing `user_id`, `role`, and optional `student_id`.
* **Graceful Degradation Architecture**: Every AI service features a deterministic fallback pipeline that activates automatically if the Groq API key is missing or throttled.

---

## 3. Technology Stack

### Frontend Ecosystem
* **Core Framework**: React 19.2.0 with Vite 5.4 bundling.
* **Routing**: React Router DOM v7 with nested layouts and protected route wrappers (`RequireAuth.jsx`).
* **Visualizations & Charts**: Chart.js 4.5 and `react-chartjs-2` for responsive bar, doughnut, scatter, and line charts.
* **Design System**: Vanilla CSS3 Glassmorphism (`index.css`) utilizing CSS custom properties, HSL color ramps, backdrop filters, and responsive grid layouts.
* **Speech & Audio**: Browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for voice input; `window.speechSynthesis` for multi-lingual spoken feedback.
* **3D WebGL Digital Twin**: Three.js WebGL canvas embedded via `campus3d.html` and `campus3d_script.js`.
* **Icons & Feedback**: `lucide-react`, FontAwesome 6, and `react-hot-toast`.
* **Content Rendering**: `marked` Markdown parser coupled with `dompurify` for sanitizing AI responses.

### Backend Ecosystem
* **Core Runtime**: Python 3.10+ with Flask 3.0.0.
* **WSGI Production Server**: Gunicorn 21.2.0 (multi-worker configuration).
* **Database Driver**: PyMongo 4.6.1 with DNS python for MongoDB Atlas connection strings.
* **Security & Auth**: Werkzeug password hashing (PBKDF2/SHA256) & PyJWT (HS256).
* **Document Processing & OCR**: `PyPDF2` (PDF text extraction), `pytesseract` (optical character recognition), and `Pillow` (image pre-processing).
* **AI & LLM Integration**: Groq Cloud Python SDK (`groq==0.5.0`), leveraging high-throughput LPU inference.
* **Blockchain SDK**: `py-algorand-sdk==2.8.0` for Algorand TestNet transaction formation, signing, and broadcasting.

---

## 4. Database & Data Modeling

EduSphere uses MongoDB for schema flexibility, nested documents, and high-performance aggregation pipelines.

### Collection Specifications

#### 1. `users`
Manages authentication credentials and role assignments.
```json
{
  "_id": "ObjectId",
  "username": "String (Admin username or Student Name)",
  "email": "String (Lowercased, required for students)",
  "password": "String (Hashed via werkzeug.security)",
  "role": "String ('admin' | 'student')",
  "student_id": "ObjectId (Reference to students collection, optional)",
  "created_at": "ISODate"
}
```

#### 2. `students`
Stores comprehensive academic and career profiles.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique identifier for student matching)",
  "branch": "String ('Computer Science', 'IT', 'Mechanical', etc.)",
  "cgpa": "Double",
  "skills": ["Array of Strings"],
  "projects": "Integer (Count of major completed projects)",
  "internships": "Integer (Count of internships completed)",
  "placed": "Boolean",
  "resume_text": "String (Raw or extracted text)",
  "gender": "String ('Male' | 'Female' | 'Other')",
  "blockchain_tx_id": "String (Algorand TestNet transaction hash, if anchored)",
  "created_at": "ISODate"
}
```

#### 3. `companies`
Stores corporate recruiters and job opening criteria.
```json
{
  "_id": "ObjectId",
  "name": "String (Company name)",
  "industry": "String ('Technology', 'Finance', 'Consulting', etc.)",
  "min_package": "Double (LPA)",
  "max_package": "Double (LPA)",
  "requirements": ["Array of Strings (e.g. 'Python', 'React', 'DSA')"],
  "website": "String (URL)",
  "created_at": "ISODate"
}
```

#### 4. `placements`
Records confirmed student hiring events.
```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId (Ref: students._id)",
  "company_id": "ObjectId (Ref: companies._id)",
  "role": "String (e.g. 'Software Development Engineer')",
  "package": "Double (Offered CTC in LPA)",
  "placement_date": "ISODate",
  "status": "String ('confirmed' | 'pending' | 'rejected')"
}
```

#### 5. `test_history`
Stores mock test performance and student evaluation answers.
```json
{
  "_id": "ObjectId",
  "student_id": "ObjectId (Ref: students._id)",
  "test_title": "String",
  "difficulty": "String ('Beginner' | 'Medium' | 'Advanced')",
  "subject": "String",
  "score": "Integer",
  "total_questions": "Integer",
  "completed_at": "ISODate",
  "answers": "Object (Mapping question indices to chosen options)",
  "questions": ["Array of question objects with options & explanations"]
}
```

---

## 5. Role-Based Access Control (RBAC) & Authentication

EduSphere enforces a strict two-tier access model:

| Role | Access Scope |
| :--- | :--- |
| **Admin / TPO** | Full access: Executive Analytics, Student Manager, Company Manager, Placement Allocator, CSV Data Exports, System Reset, Sensor & Cohort Analytics, Groq Configuration. |
| **Student** | Student Dashboard, Personalized Job Matches, AI Resume Analyzer, ARIA AI Mock Interview, AI Mock Test & Evaluation, 3D Virtual Campus, Profile Password Management. |

### Frictionless Student Onboarding Workflow
1. The Admin/TPO creates student records (or imports them) containing their official college email.
2. When the student visits `/login` for the first time, they enter their email and create a password.
3. The backend validates that the email matches an existing `students` record.
4. An account is automatically provisioned in `users`, linked to `student_id`, and a JWT is issued immediately without manual administrator approvals.

---

## 6. Core Functional Modules

### 6.1 Student Experience & AI Tools

#### A. ARIA: Voice-First AI Technical Interviewer
* **Multi-Turn Voice Conversation**: Operates in an interactive speech loop. ARIA asks one targeted question at a time, evaluates the student's answer with constructive feedback, awards a hidden score (0–100), and dynamically transitions to the next question.
* **Emotion & Tone Detection**: Heuristic sentiment analysis categorizes candidate responses into real-time visual indicators: *Confident* (💪), *Nervous* (😰), *Enthusiastic* (🚀), *Unsure* (😟), or *Neutral* (😐).
* **Multi-Lingual Audio Support**: Supports 11 language accents including English (US & India), Hindi, Marathi, Tamil, Telugu, Kannada, Gujarati, French, German, and Spanish using Web Speech APIs.
* **Comprehensive Performance Dossier**: Upon concluding the interview, ARIA generates a comprehensive closing report detailing technical depth, confidence, communication quality, and an overall calibrated readiness score.

#### B. AI Resume Analyzer & ATS Matcher
* **Multimodal Extraction**: Parses resumes from PDF documents (using `PyPDF2`) or image uploads (`.png`, `.jpg`, `.jpeg` via `pytesseract` OCR).
* **ATS Compatibility Scoring**: Assesses match percentage for target roles (e.g. *Software Engineer*, *Data Scientist*, *DevOps*).
* **Structured Evaluation**: Highlights detected technical skills, estimates years of experience, identifies resume weaknesses, and outputs actionable formatting tips.

#### C. AI Mock Test & Assessment Engine
* Generates on-demand 20-question multiple-choice technical and aptitude assessments using Groq LLM inference.
* Supports customized difficulty tiers (*Beginner*, *Intermediate*, *Advanced*) and subject categories (*DSA*, *General Aptitude*, *Core CS*, *Web Dev*).
* Features test timers, review flags, detailed post-exam answer rationales, and persistent score tracking in `test_history`.

#### D. Predictive Salary Calculator & Career Roadmap
* **Salary Predictor**: Uses empirical weighting calibrated to Indian tech hiring markets (factoring CGPA, skill frequency, completed full-stack projects, and internship count) to predict min, max, and median CTC ranges.
* **6-Month Milestones**: Generates step-by-step month-by-month roadmaps covering DSA foundations, system design, portfolio projects, certifications, and mock interview sprints.

---

### 6.2 Admin / Placement Officer Intelligence Portal

#### Real-Time Aggregation Analytics
The analytics engine leverages MongoDB multi-stage aggregation pipelines:
* **Package Statistics**: Real-time average, highest, and lowest salary packages across all confirmed placements.
* **Salary Distribution Histogram**: MongoDB `$bucket` aggregation segregating salaries into market brackets: `0–3 LPA`, `3–5 LPA`, `5–8 LPA`, `8–12 LPA`, `12–20 LPA`, and `20+ LPA`.
* **Branch-wise Performance**: `$lookup` join computing total students, placed count, placement percentage, and average CTC per academic department.
* **CGPA vs. CTC Correlation**: Correlates student CGPA against offered packages for scatter plot trend analysis.
* **Skill Demand Matrix**: Unwinds placed student skill tags to report the top 15 most sought-after competencies by hiring partners.
* **Monthly Placement Velocity**: Tracks monthly hiring volume to visualize seasonal recruitment waves.
* **Gender Diversity Ratio**: Audits gender distribution across student cohorts for equity compliance.

---

### 6.3 Algorand Blockchain Credential Verification

To protect against academic credential fabrication, EduSphere integrates with the **Algorand TestNet**:
* **Mechanism**: When a student is created or updated, the system formats a sanitized JSON payload of their academic credentials (branch, CGPA, verified skills, and placement status).
* **Zero-ALGO Self Transaction**: The backend signs a transaction from the institution's account to itself, embedding the payload in the `note` field (max 1024 bytes).
* **Cryptographic Proof**: Once confirmed by the Algorand blockchain consensus (typically within 3–4 seconds), the resulting `tx_id` is persisted to `students.blockchain_tx_id`.
* **Public Verifiability**: Any third-party recruiter can verify the authenticity, timestamp, and contents of the student's profile by querying any public Algorand TestNet explorer (e.g., AlgoExplorer or Algonode).

---

### 6.4 3D Virtual Campus & 2D Cohort Analytics

#### 3D Virtual Twin (Three.js WebGL)
* **Campus Model**: Fully rendered 3D architectural digital twin of **P.E.S. Modern College of Engineering** (Ground + 4 Floors, 6 Departments, 100+ Classrooms & Labs).
* **Interactive Navigation**: Orbit controls (pan, zoom, rotate), floor-by-floor isolation sliders (`G`, `1`, `2`, `3`, `4`, `ALL`), 3D exploded view, cross-section cutter, and dynamic daylight/night lighting modes.
* **Room Inspection**: Click-to-inspect classroom and laboratory dimensions, capacity, and current allocations.

#### 2D Cohort Analytics & Sensor Monitor
* **Simulated IoT Sensor Network**: Real-time mock telemetry monitoring occupancy across classrooms, library, canteen, seminar halls, and corridors.
* **Autonomous Anomaly Detection**: Generates color-coded alerts for crowd density warnings, fire-safety limit breaches, and bottleneck locations.
* **Grok CampusAI Assistant**: Context-aware AI chatbot with voice recognition that answers questions about current campus occupancy, crowd hotspots, and active alerts using live sensor data.

---

## 7. Comprehensive API Reference

### Authentication & Access (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login (username & password) | No |
| `POST` | `/api/auth/student/login` | Student login (auto-registers on first visit) | No |
| `POST` | `/api/auth/student/register` | Student registration | No |
| `GET` | `/api/auth/verify` | Validate JWT token & return user identity | Bearer Token |
| `POST` | `/api/auth/change-password` | Update current user password | Bearer Token |

### Student Management (`/api/students`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | List students (query: `branch`, `placed`, `search`, `page`, `per_page`) | Bearer Token |
| `GET` | `/api/students/<id>` | Fetch single student profile | Bearer Token |
| `POST` | `/api/students` | Create student & anchor to Algorand blockchain | Admin |
| `PUT` | `/api/students/<id>` | Update student & refresh blockchain anchor | Admin |
| `DELETE` | `/api/students/<id>` | Delete student profile and associated placement records | Admin |
| `GET` | `/api/students/branches` | List all unique engineering branches | Bearer Token |

### Company & Jobs (`/api/companies`, `/api/jobs`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | List hiring partners (filter by `industry`, `search`) | Bearer Token |
| `POST` | `/api/companies` | Create new company profile | Admin |
| `PUT` | `/api/companies/<id>` | Update company criteria and salary bands | Admin |
| `DELETE` | `/api/companies/<id>` | Delete company profile | Admin |
| `GET` | `/api/jobs/recommendations/<student_id>` | Return top matching job roles with score and rationale | Bearer Token |

### Placement Tracking (`/api/placements`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/placements` | Get placement records (joined with student & company) | Bearer Token |
| `POST` | `/api/placements` | Create confirmed or pending placement record | Admin |
| `PUT` | `/api/placements/<id>` | Update placement offer details | Admin |
| `DELETE` | `/api/placements/<id>` | Revoke placement record | Admin |

### Executive Analytics (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/stats` | KPI counters: total students, placed %, avg/max/min CTC | Bearer Token |
| `GET` | `/api/analytics/placement-overview` | Placed vs unplaced student breakdown | Bearer Token |
| `GET` | `/api/analytics/salary-distribution` | Histogram bucket ranges (0-3 LPA up to 20+ LPA) | Bearer Token |
| `GET` | `/api/analytics/branch-stats` | Department-wise placement and package metrics | Bearer Token |
| `GET` | `/api/analytics/top-companies` | Top 10 hiring partners by student intake volume | Bearer Token |
| `GET` | `/api/analytics/cgpa-vs-package` | Scatter data correlating CGPA to offered CTC | Bearer Token |
| `GET` | `/api/analytics/top-skills` | Frequency ranking of in-demand student skills | Bearer Token |
| `GET` | `/api/analytics/monthly-trends` | 12-month recruitment seasonality and volume | Bearer Token |
| `GET` | `/api/analytics/gender-distribution` | Gender breakdown across cohorts | Bearer Token |

### AI Services (`/api/ai`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/analyze-resume` | Multipart file upload (PDF/Image) for ATS scoring | Bearer Token |
| `POST` | `/api/ai/skill-gap` | Skill gap analysis against target role | Bearer Token |
| `POST` | `/api/ai/predict-salary` | Predictive salary calculator | Bearer Token |
| `POST` | `/api/ai/roadmap` | 6-month preparation roadmap generator | Bearer Token |
| `POST` | `/api/ai/interview` | ARIA voice interview turn (or `__START__` / `__FINISH__`) | Bearer Token |
| `POST` | `/api/ai/generate-test` | Generate 20-question dynamic MCQ mock test | Bearer Token |
| `POST` | `/api/ai/save-test-result` | Persist student exam score and answers | Bearer Token |
| `GET` | `/api/ai/test-history/<student_id>` | Retrieve historical mock test records | Bearer Token |
| `POST` | `/api/ai/chat` | Contextual placement prep chatbot | Bearer Token |
| `POST` | `/api/ai/ask` | Grok CampusAI sensor-aware campus query engine | Bearer Token |

### Administration & Export (`/api/admin`, `/api/config`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/export/students` | Download full student database as `students_export.csv` | Admin |
| `GET` | `/api/admin/export/placements` | Download placement records as `placements_export.csv` | Admin |
| `POST` | `/api/admin/reset-database` | Danger: Wipe students, companies, and placement tables | Admin |
| `GET` | `/api/config` | Read masked Groq API key and active model name | Admin |
| `POST` | `/api/config` | Update Groq API credentials with runtime reload | Admin |
| `GET` | `/api/ping` | Lightweight keep-alive endpoint | Public |
| `GET` | `/health` | Service and MongoDB health probe | Public |

---

## 8. DevOps, Deployment & Containerization

### Multi-Stage Dockerfile
EduSphere utilizes a high-efficiency multi-stage build:
1. **Stage 1 (Frontend Builder)**: Uses `node:18-alpine` to install dependencies and compile the React application via `npm run build`.
2. **Stage 2 (Runtime Container)**: Uses `python:3.10-slim`, installs system binaries (`tesseract-ocr` and `libtesseract-dev`), copies backend dependencies, and copies the compiled frontend assets from Stage 1 into `frontend-react/dist`.
3. **Execution**: Serves the application via Gunicorn WSGI on port `5001`.

```dockerfile
# Multi-stage Dockerfile summary
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm ci
COPY frontend-react/ ./
RUN npm run build

FROM python:3.10-slim AS backend
WORKDIR /app
RUN apt-get update && apt-get install -y tesseract-ocr libtesseract-dev && rm -rf /var/lib/apt/lists/*
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend-react/dist ./frontend-react/dist
EXPOSE 5001
WORKDIR /app/backend
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5001", "--workers", "1", "--timeout", "120"]
```

### Kubernetes Orchestration (`k8s/`)
* `deployment.yaml`: Configures deployment replicas, resource requests/limits, health liveness/readiness probes (`/health`).
* `service.yaml`: ClusterIP service exposing target port `5001`.
* `ingress.yaml`: Ingress controller routing external domain traffic.
* `secrets.yaml`: Base64-encoded environment variables for `MONGO_URI`, `SECRET_KEY`, and `GROQ_API_KEY`.

### Render Cloud Platform (`render.yaml`)
Configured for automated continuous integration:
* Automatic deployments on branch pushes.
* Gunicorn execution with 120s request timeout for LLM inference.
* Background keep-alive loop: React client sends `/api/ping` requests every 10 minutes to prevent container idling.

---

## 9. Local Development Setup

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm
* MongoDB Atlas cluster URI (or local MongoDB running on `mongodb://localhost:27017`)
* Tesseract OCR installed locally (optional, for image resume parsing)

### Step 1: Clone Repository
```bash
git clone https://github.com/HarshBhavsar25/EduSphere.git
cd EduSphere
```

### Step 2: Configure Environment Variables
Create `backend/.env`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hirematrix?retryWrites=true&w=majority
SECRET_KEY=your-secure-jwt-secret-key-2024
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
ALGORAND_MNEMONIC=twenty five word algorand testnet mnemonic phrase here
```

### Step 3: Run the Backend
```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# (Optional) Seed realistic demo records:
python seed_data.py

python app.py
```
*Backend runs on `http://localhost:5001`.*

### Step 4: Run the Frontend
```bash
cd ../frontend-react
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### Default Credentials
* **Admin Portal**: Username: `admin` | Password: `admin123`
* **Student Portal**: Use any student email from the seed data (e.g. `aarav.sharma@example.com`), entering any password with 6+ characters on first login.

---

## 10. Resiliency, Fallback Architecture & Security

1. **Deterministic AI Fallbacks**:
   If the Groq Cloud API is unconfigured, rate-limited, or unreachable:
   * **Resume Analyzer**: Switches to keyword-based tokenization against 25+ tech industry skills.
   * **Skill Gap Analysis**: Employs static role-competency dictionaries.
   * **Salary Predictor**: Calculates regression formulas based on CGPA and project counts.
   * **Mock Test Engine**: Serves built-in static question banks across computer science fundamentals.
   * **AI Interview**: Provides static conversational cues while alerting the user.

2. **Secure Key & Data Handling**:
   * MongoDB connection URIs are scrubbed of unprintable characters and non-ASCII artifacts on startup.
   * Secret keys and Groq API keys are masked (`gsk_12...ab34`) when requested by the frontend configuration view.
   * Student passwords are protected using salt-hashed PBKDF2 cryptography.

3. **Input Sanitization**:
   * All AI chat and interview markdown outputs are purified through `DOMPurify` to eliminate cross-site scripting (XSS) injection vectors.

---

*Licensed under the MIT Open Source License.*
