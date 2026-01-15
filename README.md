# AetherAlpha - AI Market Intelligence Platform

AetherAlpha is an advanced financial dashboard combining real-time market data with AI-driven news analytics.

![Screenshot](https://via.placeholder.com/800x400?text=AetherAlpha+Dashboard)

## 🚀 Features

- **Real-time Market Data**: High-frequency price updates via WebSockets.
- **AI Sentiment Analysis**: Automated scoring of financial news (Bullish/Bearish).
- **Interactive Charts**: Professional-grade visuals using Recharts.
- **AI Assistant**: Integrated Chat interface for market queries.
- **Premium UI**: Glassmorphism aesthetic with Dark Mode.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, TypeScript, Recharts, Framer Motion.
- **Backend**: Python FastAPI, WebSockets, Hexagonal Architecture.
- **AI**: OpenAI API (simulated/mock mode available).

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Start the Backend

```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

Server will start at `http://localhost:8000`.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard will open at `http://localhost:3000`.

## 🧪 Architecture

The project follows a **Clean Architecture** (Hexagonal) pattern:
- **Domain Layer**: Pure business logic and interfaces.
- **Infrastructure Layer**: Adapters for External APIs (News, OpenAI).
- **Presentation Layer**: FastAPI Endpoints and WebSockets.

## 🤖 Mock Mode
By default, the system runs in `USE_MOCK_DATA=True` mode, so no API keys are required to see the dashboard in action. To use real data, create a `.env` file in `backend/` with `OPENAI_API_KEY`.
