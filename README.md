# Autonomous Multi-Agent Research & Fact Verification System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-0.0.30%2B-FF6F61?logo=chainlink&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> An enterprise-grade, multi-agent AI system that decomposes complex research topics into atomic claims, retrieves live web evidence, verifies factual accuracy, isolates source contradictions, and synthesizes publication-ready research reports.

---

## 📌 Project Overview

In an era of rampant online misinformation and hallucination-prone generative AI, manually verifying complex claims requires searching multiple web sources, cross-checking conflicting numbers, evaluating publisher credibility, and organizing findings into structured reports. Standard single-prompt LLM interactions fail because they lack real-time web verification, structured claim breakdown, and multi-source contradiction detection.

The **Autonomous Multi-Agent Research & Fact Verification System** solves this by pairing a high-performance **FastAPI backend** running a stateful **5-agent LangGraph workflow** with a modern **React + Vite frontend dashboard**. It automates claim extraction, live web search via Tavily, local vector embeddings with `SentenceTransformers`, similarity search via `FAISS`, and cross-source verification across Gemini, OpenAI, or Claude.

---

## ✨ Features

- **Stateful Multi-Agent Orchestration**: Built with LangGraph, coordinating 5 specialized agents in a directed acyclic graph (DAG).
- **Provider-Agnostic LLM Engine**: Seamlessly switch between Google Gemini (`gemini-3.1-flash-lite`), OpenAI (`gpt-4o`), and Anthropic Claude (`claude-3-5-sonnet-20241022`).
- **Live AI Web Search & RAG**: Real-time web evidence retrieval using Tavily Search API.
- **Local Dense Vector Embeddings**: Local text vectorization using `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional dense vectors).
- **Session-Isolated FAISS Vector DB**: Fast in-memory vector similarity search for semantic RAG verification.
- **Source Contradiction Detection**: Cross-examines retrieved sources to flag discrepancies, numerical mismatches, and publisher reporting conflicts.
- **MongoDB Atlas Persistence**: Asynchronous document persistence via `Motor` for job tracking, audit logs, and historical analysis.
- **Modern React Dashboard**: Complete interactive UI featuring Swarm Feed, Interactive Knowledge Graph, Claims Timeline, Confidence Center, and Truth Vault.

---

## 🛠️ Tech Stack

| Component | Backend Technology | Frontend Technology |
|---|---|---|
| **Core Framework** | **FastAPI** (`>=0.110.0`) - Async REST API with OpenAPI | **React 19** (`^19.0.1`) - Declarative UI Component Library |
| **Language / Build** | **Python 3.10+** - High-concurrency backend runtime | **TypeScript 5.8** & **Vite 6** (`^6.2.3`) - Fast HMR build tool |
| **Styling & UI** | **Pydantic v2** - Data validation & schema serialization | **Tailwind CSS v4** (`^4.1.14`) & **Lucide React** (`^0.546.0`) |
| **Agent Orchestration**| **LangGraph** (`>=0.0.30`) - Stateful cyclical multi-agent graph | **Framer Motion** (`^12.23.24`) - Smooth micro-animations |
| **LLM Integrations** | **LangChain** (`google-genai`, `openai`, `anthropic`) | **@google/genai** (`^2.4.0`) - Direct Gemini client support |
| **Search & RAG** | **Tavily Python SDK** (`>=0.3.0`) - Live AI search API | **Recharts** (`^3.10.0`) - Interactive data visualization charts |
| **Vector DB** | **FAISS CPU** (`>=1.8.0`) - Similarity search vector index | **Express Server** (`^4.21.2`) - Fullstack node entrypoint (`server.ts`) |
| **Embeddings** | **SentenceTransformers** (`all-MiniLM-L6-v2`) | **TSX** (`^4.21.0`) - TypeScript execution engine |
| **Database** | **Motor** (`>=3.3.2`) / **PyMongo** - Async MongoDB Atlas driver | **Dotenv** (`^17.2.3`) - Frontend environment loader |

---

## 📐 System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 USER BROWSER / CLIENT                             |
|                           (React 19 + TypeScript Dashboard)                       |
+-----------------------------------------------------------------------------------+
                                          |
                                          | HTTP POST /api/v1/analyze
                                          v
+-----------------------------------------------------------------------------------+
|                                 FASTAPI BACKEND                                   |
|  - CORS Middleware (allow_origins=["*"])                                          |
|  - Request Validation (Pydantic / AnalyzeRequest)                                 |
|  - Exception Handlers (RequestValidationError, Exception)                        |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             LANGGRAPH STATEGRAPH WORKFLOW                         |
|                                                                                   |
|  Initial State: { job_id, user_query, model_provider, claims: [], sources: [] }   |
|                                                                                   |
|      +---------------------+      +---------------------+                         |
|      | 1. Claim Extractor  | ---> | 2. Search Retriever |                         |
|      |    (LLM Factory)    |      |    (Tavily / FAISS) |                         |
|      +---------------------+      +---------------------+                         |
|                                              |                                    |
|                                              v                                    |
|      +---------------------+      +---------------------+                         |
|      | 4. Contradiction    | <--- | 3. Fact Verifier    |                         |
|      |    Detector (LLM)   |      |    (LLM Cross-Check)|                         |
|      +---------------------+      +---------------------+                         |
|                 |                                                                 |
|                 v                                                                 |
|      +---------------------+                                                      |
|      | 5. Report Generator |                                                      |
|      |    (LLM Synthesis)  |                                                      |
|      +---------------------+                                                      |
+-----------------------------------------------------------------------------------+
         |                    |                   |                   |
         v                    v                   v                   v
+------------------+ +------------------+ +---------------+ +-------------------+
|   LLM FACTORY    | |  TAVILY SEARCH   | |  EMBEDDINGS & | |   MONGODB ATLAS   |
| Gemini / OpenAI /| |  API             | |  FAISS INDEX  | |   DATABASE        |
| Claude Clients   | | (Live Search)    | | (Local RAG)   | | (Async Storage)   |
+------------------+ +------------------+ +---------------+ +-------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             JSON RESPONSE TO FRONTEND                             |
|    HTTP 200 OK: { job_id, status, query, summary, claims, sources, report }       |
+-----------------------------------------------------------------------------------+
```

---

## 📁 Project Structure

```text
multi-agent-fact-verification/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                         # FastAPI app entrypoint, CORS, & global exception handlers
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   ├── claim_extractor.py          # Agent 1: Atomic Claim Extraction
│   │   │   ├── contradiction_detector.py   # Agent 4: Source Contradiction Detection
│   │   │   ├── fact_verifier.py            # Agent 3: Fact Verification
│   │   │   ├── report_generator.py         # Agent 5: Markdown Report Synthesis
│   │   │   ├── search_retriever.py         # Agent 2: Tavily Search & FAISS Indexing
│   │   │   └── prompts/                    # System prompt templates per agent
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py                     # API dependency injection helpers
│   │   │   └── v1/
│   │   │       ├── analyze.py              # POST /api/v1/analyze endpoint controller
│   │   │       ├── health.py               # GET /api/v1/health status endpoint
│   │   │       └── router.py               # API Router aggregation
│   │   ├── core/
│   │   │   ├── config.py                   # Pydantic BaseSettings & env variable config
│   │   │   └── database.py                 # Async Motor MongoDB connection manager
│   │   ├── graph/
│   │   │   ├── builder.py                  # LangGraph StateGraph assembly & compilation
│   │   │   └── state.py                    # AgentState TypedDict & Pydantic domain models
│   │   ├── schemas/
│   │   │   ├── analyze.py                  # AnalyzeRequest & AnalyzeResponse schemas
│   │   │   ├── health.py                   # HealthCheckResponse schema
│   │   │   └── search.py                   # SearchResult schema
│   │   └── services/
│   │       ├── embedding_service.py        # SentenceTransformers local vector service
│   │       ├── faiss_service.py            # FAISS vector DB service
│   │       ├── llm_factory.py              # Dynamic LLM client factory (Gemini, OpenAI, Claude)
│   │       ├── mongo_service.py            # MongoDB Atlas async document persistence
│   │       └── tavily_service.py           # Tavily web search API wrapper
│   ├── .env                                # Backend secrets configuration
│   ├── .env.example                        # Backend environment template
│   └── requirements.txt                    # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/                     # Dashboard, Knowledge Graph, Timeline, Vault components
│   │   ├── App.tsx                         # Main React application entrypoint
│   │   ├── index.css                       # Global Tailwind CSS styles
│   │   └── types.ts                        # TypeScript interface definitions
│   ├── package.json                        # Node dependencies & scripts
│   ├── server.ts                           # Express server for Node deployment
│   ├── vite.config.ts                      # Vite configuration
│   ├── .env.example                        # Frontend environment template
│   └── README.md                           # Frontend overview documentation
├── .env.example                            # Root environment template
├── .gitignore                              # Git exclusion configuration
└── README.md                               # Comprehensive Project Documentation
```

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI + LangGraph)

#### Prerequisites
- **Python 3.10, 3.11, or 3.12** installed
- Active API keys for **Google Gemini** (or OpenAI/Claude) and **Tavily Search**

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate virtual environment
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Create local environment file from template
cp .env.example .env
```

Edit `backend/.env` with your active API keys:
```ini
GOOGLE_API_KEY=your_google_gemini_api_key_here
TAVILY_API_KEY=your_tavily_search_api_key_here
DEFAULT_LLM_PROVIDER=gemini
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
```

#### Start the FastAPI Server
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup (React + Vite)

#### Prerequisites
- **Node.js (v18+)** and **npm** or **bun**

```bash
# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```ini
GEMINI_API_KEY="your_gemini_api_key_here"
```

#### Start the Frontend Development Server
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173` (or the port specified in terminal)

---

## 🔑 Environment Variables

### Backend Configuration ([backend/.env.example](file:///c:/Users/Asus/multi-agent-fact-verification/backend/.env.example))

| Variable Name | Required | Default Value | Description |
|---|:---:|---|---|
| `PROJECT_NAME` | No | `"Autonomous Multi-Agent..."` | Display title for OpenAPI documentation. |
| `API_V1_STR` | No | `"/api/v1"` | Route prefix for API V1 endpoints. |
| `DEBUG` | No | `false` | Enables debug logging mode. |
| `DEFAULT_LLM_PROVIDER` | No | `"gemini"` | Default LLM provider (`"gemini"`, `"openai"`, `"claude"`). |
| `GOOGLE_API_KEY` | **Yes*** | `""` | Google Gemini API Key (*Required for Gemini provider). |
| `OPENAI_API_KEY` | Optional | `""` | OpenAI API Key (*Required for OpenAI provider). |
| `ANTHROPIC_API_KEY` | Optional | `""` | Anthropic API Key (*Required for Claude provider). |
| `GEMINI_MODEL_NAME` | No | `"gemini-3.1-flash-lite"` | Gemini model identifier. |
| `OPENAI_MODEL_NAME` | No | `"gpt-4o"` | OpenAI model identifier. |
| `CLAUDE_MODEL_NAME` | No | `"claude-3-5-sonnet-20241022"` | Claude model identifier. |
| `TAVILY_API_KEY` | **Yes** | `""` | Tavily API Key for live web search RAG retrieval. |
| `EMBEDDING_MODEL_NAME` | No | `"sentence-transformers/all-MiniLM-L6-v2"` | SentenceTransformer embedding model identifier. |
| `MONGODB_URI` | **Yes** | `"mongodb://localhost:27017"` | MongoDB connection URI string. |
| `MONGODB_DB_NAME` | No | `"fact_verification_db"` | MongoDB database name. |
| `MONGODB_COLLECTION_NAME` | No | `"research_analyses"` | MongoDB collection name. |

### Frontend Configuration ([frontend/.env.example](file:///c:/Users/Asus/multi-agent-fact-verification/frontend/.env.example))

| Variable Name | Required | Example Value | Description |
|---|:---:|---|---|
| `GEMINI_API_KEY` | **Yes** | `"AIzaSy..."` | Gemini API Key for client-side AI utilities. |
| `APP_URL` | Optional | `"http://localhost:5173"` | Web application URL. |

---

## 📡 API Reference

### `POST /api/v1/analyze`

Executes the multi-agent fact verification workflow on a research topic or claim.

#### Request Headers
```http
Content-Type: application/json
```

#### Request Payload
```json
{
  "query": "Did renewable energy generate more than 30% of global electricity in 2024?",
  "model_provider": "gemini"
}
```

| Parameter | Type | Required | Description |
|---|---|:---:|---|
| `query` | `string` | **Yes** | Research prompt or claim string (5 to 1000 characters). |
| `model_provider` | `string` | Optional | Provider override (`"gemini"`, `"openai"`, or `"claude"`). |

#### Response (`HTTP 200 OK`)
```json
{
  "job_id": "job_d40409a473",
  "status": "completed",
  "query": "Did renewable energy generate more than 30% of global electricity in 2024?",
  "created_at": "2026-07-25T12:28:40.123456+00:00",
  "completed_at": "2026-07-25T12:28:54.654321+00:00",
  "summary": {
    "total_claims": 2,
    "supported_claims": 2,
    "refuted_claims": 0,
    "inconclusive_claims": 0,
    "total_sources": 6,
    "contradictions_detected": 1
  },
  "claims": [
    {
      "id": "claim_01",
      "text": "Renewable energy generated over 30% of global electricity in 2024.",
      "category": "statistical",
      "verdict": "SUPPORTED",
      "confidence": 0.95,
      "reasoning": "Data from Ember Global Electricity Review 2025 confirms renewable energy reached 32% of global electricity generation in 2024.",
      "supporting_sources": ["src_01", "src_03"],
      "contradicting_sources": []
    }
  ],
  "sources": [
    {
      "id": "src_01",
      "url": "https://ember-climate.org/insights/research/global-electricity-review-2025/",
      "title": "Global Electricity Review 2025 | Ember",
      "snippet": "Clean electricity generated 40% of global power in 2024, with solar and wind driving renewables to a record 32% share.",
      "domain": "ember-climate.org",
      "score": 0.92
    }
  ],
  "contradictions": [
    {
      "claim_id": "claim_01",
      "source_a_id": "src_01",
      "source_b_id": "src_04",
      "conflict_description": "Source 01 reports 32% for calendar year 2024, whereas Source 04 references 2023 figures of 30.3%."
    }
  ],
  "report_markdown": "# Fact Verification & Research Analysis Report...",
  "errors": []
}
```

---

## 🧠 How the Multi-Agent Pipeline Works

```
[START] ──> Claim Extractor ──> Search Retriever ──> Fact Verifier ──> Contradiction Detector ──> Report Generator ──> [END]
```

1. **Claim Extractor Agent (`app/agents/claim_extractor.py`)**:
   Decomposes complex user queries into atomic, testable claim statements with structured metadata (`claim_01`, `claim_02`).
2. **Search & Retrieval Agent (`app/agents/search_retriever.py`)**:
   Queries the Tavily Search API for top web results, computes 384-dimensional dense vector embeddings with `SentenceTransformers`, and loads snippets into a session-isolated `FAISS` vector index.
3. **Fact Verifier Agent (`app/agents/fact_verifier.py`)**:
   Cross-checks each claim against retrieved source snippets using structured LLM inference to assign an explicit stance (**SUPPORTED**, **REFUTED**, or **INCONCLUSIVE**), confidence score ($0.0 \rightarrow 1.0$), and reasoning.
4. **Contradiction Detector Agent (`app/agents/contradiction_detector.py`)**:
   Evaluates multi-source evidence to spot factual discrepancies, numerical reporting conflicts, and disagreements across web domains.
5. **Report Generator Agent (`app/agents/report_generator.py`)**:
   Synthesizes all verified claims, source citations, confidence metrics, and detected contradictions into a publication-ready Markdown research paper.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the Repository.
2. Create a Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
