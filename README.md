# 🧠 Serenity AI — Emotional Wellness Assessment System

> **Theme:** Crisis Management, HealthTech & Emergency Response

**Serenity AI** is an AI-powered emotional wellness assessment system that helps users understand their emotional well-being through structured, intelligent analysis. Unlike generic chatbot apps that offer motivational quotes or open-ended conversation, Serenity AI produces a **structured wellness report** from a single input — combining text analysis and optional facial expression recognition using Google's Gemini multimodal AI.

---

## 🌟 Key Features

- **Multimodal AI Analysis** — Combines written self-report with optional facial expression analysis for comprehensive emotional assessment
- **Structured Wellness Reports** — Receive clear, organized insights instead of chatbot-style responses
- **Crisis Detection & Emergency Response** — Automatically surfaces helpline information when severe distress is detected
- **Stress & Burnout Metrics** — Visual progress bars showing stress level (0-100) and burnout risk
- **Personalized Coping Strategies** — 5 tailored, actionable suggestions based on your specific situation
- **Professional Help Guidance** — Clear recommendations on when to seek professional mental health support
- **Privacy First** — No login, no database, no data storage. Your information is never saved
- **Beautiful, Accessible UI** — Warm glassmorphism design, smooth animations, dark mode, fully responsive
- **Download & Copy Reports** — Export your assessment as a text file or copy to clipboard

---

## 🏗️ Tech Stack

| Layer     | Technology                                           |
|-----------|------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, React Router, Axios |
| Animations| Framer Motion                                        |
| Icons     | Lucide React                                         |
| Backend   | Python, FastAPI, Uvicorn                             |
| AI        | Google Gemini 2.5 Flash (text + vision)              |
| Font      | Inter (Google Fonts)                                 |

---

## 📁 Project Structure

```
mindcare-ai/
├── frontend/                  # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Responsive nav with dark mode toggle
│   │   │   └── Footer.jsx     # Footer with disclaimer & helplines
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Hero, features, how-it-works
│   │   │   ├── AssessmentPage.jsx # Text + image input form
│   │   │   └── ResultsPage.jsx    # Structured wellness report
│   │   ├── App.jsx            # App shell with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Design system & Tailwind theme
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   └── package.json
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── main.py            # FastAPI app entry
│   │   ├── routers/
│   │   │   └── analyze.py     # POST /analyze endpoint
│   │   ├── services/
│   │   │   └── gemini_service.py  # Gemini AI integration
│   │   └── utils/
│   │       └── validation.py  # Input validation
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd mindcare-ai
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_actual_key_here

# Run the backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`

> **Note:** The Vite dev server is pre-configured to proxy `/analyze` requests to `http://localhost:8000`, so everything works out of the box during development.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable         | Description                    | Required |
|------------------|--------------------------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key          | ✅        |

### Frontend (`frontend/.env`)
| Variable           | Description                                      | Required |
|--------------------|--------------------------------------------------|----------|
| `VITE_BACKEND_URL` | Backend URL (empty = same origin / Vite proxy)   | ❌        |

---

## 📡 API Endpoints

| Method | Endpoint   | Description                                     |
|--------|------------|-------------------------------------------------|
| GET    | `/`        | Health check                                    |
| POST   | `/analyze` | Analyze emotional wellness (multipart/form-data)|

### POST /analyze

**Request (multipart/form-data):**
- `text` (string, required) — User's self-reported emotional state
- `image` (file, optional) — Selfie/facial image (JPEG, PNG, WebP, GIF; max 5 MB)

**Response (JSON):**
```json
{
  "emotional_state": "...",
  "stress_level": 65,
  "burnout_risk": 45,
  "possible_indicators": "anxiety, fatigue, emotional exhaustion",
  "suggestions": ["...", "...", "...", "...", "..."],
  "professional_help": "...",
  "summary": "...",
  "crisis_flag": false
}
```

---

## 🎨 Design System

Serenity AI uses a warm, human-centered color palette:

| Token    | Hex       | Usage                              |
|----------|-----------|------------------------------------|
| Cream    | `#F0EDE5` | Page background, default canvas    |
| Sand     | `#D9CBAA` | Cards, hover states, sections      |
| Clay     | `#A67C5D` | Secondary accents, tags, icons     |
| Brand    | `#8B5B29` | Primary CTAs, links, active states |
| Espresso | `#6B4F3A` | Headings, body text, dark accents  |

---

## 🚢 Deployment on Render

### Backend (Web Service)

1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GEMINI_API_KEY=your_key`

### Frontend (Static Site)

1. Create a new **Static Site** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `dist`
6. Add environment variable: `VITE_BACKEND_URL=https://your-backend.onrender.com`

---

## ⚠️ Disclaimer

This application provides emotional wellness insights using AI. It is **not** a medical diagnosis and should **not** replace consultation with a licensed mental health professional. If you are in crisis, please contact emergency services or a crisis helpline immediately.

**Emergency Helplines:**
- 🇺🇸 988 Suicide & Crisis Lifeline: **988**
- 🇮🇳 iCall: **9152987821**
- 🇮🇳 Vandrevala Foundation: **1860-2662-345**

---

## 🔮 Future Improvements

- [ ] Mood tracking over time with local storage
- [ ] Voice input for accessibility
- [ ] Multi-language support
- [ ] Integration with wearable devices for biometric data
- [ ] PDF report generation
- [ ] Guided breathing exercises
- [ ] Community resources directory

---

## 📝 License

MIT License — Built with ❤️ for emotional wellness awareness.
