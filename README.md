# Autonomous Multi-Agent Research & Fact Verification System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-0.0.30%2B-FF6F61?logo=chainlink&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)

> An autonomous multi-agent AI system that decomposes research topics into atomic claims, retrieves live web evidence, verifies factual accuracy, detects source contradictions, and synthesizes structured research reports.

---

## 📌 Project Overview

Verifying complex claims online means cross-checking multiple sources, spotting contradictions, and organizing findings — all manually. Single-prompt LLMs can't do this reliably without real-time web access and structured reasoning.

The **Autonomous Multi-Agent Research & Fact Verification System** fixes this with a **5-agent LangGraph pipeline** backed by **FastAPI**, powered by live web search (Tavily), vector similarity search (FAISS + SentenceTransformers), and your choice of Gemini, OpenAI, or Claude.

---

## ✨ Features

- **Stateful Multi-Agent Orchestration** — 5 specialized agents coordinated in a LangGraph DAG
- **Provider-Agnostic LLM Engine** — Switch between Gemini, OpenAI, and Claude per request
- **Live Web Search & RAG** — Real-time evidence retrieval via Tavily Search API
- **Local Vector Embeddings** — `sentence-transformers/all-MiniLM-L6-v2` (384-dim dense vectors)
- **Session-Isolated FAISS Vector DB** — Fast in-memory semantic similarity search
- **Contradiction Detection** — Flags numerical mismatches and reporting conflicts across sources
- **MongoDB Atlas Persistence** — Async job tracking and historical analysis via Motor

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| **Framework** | FastAPI `>=0.110.0` | Async REST API with OpenAPI docs |
| **Language** | Python 3.10+ | Backend runtime |
| **Agent Orchestration** | LangGraph `>=0.0.30` | Stateful multi-agent DAG workflow |
| **LLM Integrations** | LangChain (google-genai, openai, anthropic) | Provider-agnostic LLM clients |
| **Web Search** | Tavily Python SDK `>=0.3.0` | Live AI-powered web search |
| **Vector DB** | FAISS CPU `>=1.8.0` | Similarity search vector index |
| **Embeddings** | SentenceTransformers | Local text vectorization |
| **Database** | Motor `>=3.3.2` / PyMongo | Async MongoDB Atlas driver |
| **Validation** | Pydantic v2 | Request/response schema validation |

---

## 📐 System Architecture

```
+---------------------------------------------------------------+
|                     FASTAPI BACKEND                           |
|   CORS Middleware · Pydantic Validation · Exception Handlers  |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                  LANGGRAPH STATEGRAPH WORKFLOW                |
|                                                               |
|   [START]                                                     |
|      |                                                        |
|      v                                                        |
|  1. Claim Extractor  ──>  2. Search Retriever                 |
|     (LLM Factory)            (Tavily + FAISS)                 |
|                                    |                          |
|                                    v                          |
|  4. Contradiction   <──  3. Fact Verifier                     |
|     Detector (LLM)          (LLM Cross-Check)                 |
|         |                                                     |
|         v                                                     |
|  5. Report Generator                                          |
|     (LLM Synthesis)                                           |
|      |                                                        |
|   [END]                                                       |
+---------------------------------------------------------------+
       |              |              |              |
       v              v              v              v
  LLM Factory    Tavily Search   FAISS + Embeddings   MongoDB Atlas
 (Gemini/OpenAI   (Live Search)   (Local RAG)         (Persistence)
  /Claude)
```

---

## 📁 Project Structure

```
multi-agent-fact-verification/
├── backend/
│   ├── app/
│   │   ├── main.py                         # FastAPI entrypoint, CORS, exception handlers
│   │   ├── agents/
│   │   │   ├── claim_extractor.py          # Agent 1: Atomic claim extraction
│   │   │   ├── search_retriever.py         # Agent 2: Tavily search & FAISS indexing
│   │   │   ├── fact_verifier.py            # Agent 3: LLM-based fact verification
│   │   │   ├── contradiction_detector.py   # Agent 4: Cross-source contradiction detection
│   │   │   └── report_generator.py         # Agent 5: Markdown report synthesis
│   │   ├── api/v1/
│   │   │   ├── analyze.py                  # POST /api/v1/analyze endpoint
│   │   │   ├── health.py                   # GET /api/v1/health endpoint
│   │   │   └── router.py                   # API router aggregation
│   │   ├── core/
│   │   │   ├── config.py                   # Pydantic BaseSettings & env config
│   │   │   └── database.py                 # Async MongoDB connection manager
│   │   ├── graph/
│   │   │   ├── builder.py                  # LangGraph StateGraph assembly
│   │   │   └── state.py                    # AgentState TypedDict & domain models
│   │   ├── schemas/
│   │   │   └── analyze.py                  # AnalyzeRequest & AnalyzeResponse schemas
│   │   └── services/
│   │       ├── llm_factory.py              # Dynamic LLM client factory
│   │       ├── tavily_service.py           # Tavily search wrapper
│   │       ├── embedding_service.py        # SentenceTransformers vector service
│   │       ├── faiss_service.py            # FAISS vector DB service
│   │       └── mongo_service.py            # MongoDB async persistence
│   ├── .env.example
│   └── requirements.txt
├── frontend/                               # React + Vite dashboard (separate team)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10, 3.11, or 3.12
- API keys for Google Gemini (or OpenAI/Claude) and Tavily Search

### Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your API keys
```

### Run

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **API Base URL**: `http://127.0.0.1:8000`
- **Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `GOOGLE_API_KEY` | Yes* | `""` | Google Gemini API key |
| `OPENAI_API_KEY` | Optional | `""` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Optional | `""` | Anthropic Claude API key |
| `TAVILY_API_KEY` | **Yes** | `""` | Tavily Search API key |
| `MONGODB_URI` | **Yes** | `"mongodb://localhost:27017"` | MongoDB connection URI |
| `DEFAULT_LLM_PROVIDER` | No | `"gemini"` | Default provider (`gemini`, `openai`, `claude`) |
| `GEMINI_MODEL_NAME` | No | `"gemini-3.1-flash-lite"` | Gemini model string |
| `OPENAI_MODEL_NAME` | No | `"gpt-4o"` | OpenAI model string |
| `CLAUDE_MODEL_NAME` | No | `"claude-3-5-sonnet-20241022"` | Claude model string |
| `MONGODB_DB_NAME` | No | `"fact_verification_db"` | MongoDB database name |

*Required only when using Gemini as the provider.

---

## 📡 API Reference

### `POST /api/v1/analyze`

#### Request
```json
{
  "query": "Did renewable energy generate more than 30% of global electricity in 2024?",
  "model_provider": "gemini"
}
```

| Parameter | Type | Required | Description |
|---|---|:---:|---|
| `query` | `string` | **Yes** | Research claim or question (5–1000 chars) |
| `model_provider` | `string` | No | `"gemini"`, `"openai"`, or `"claude"` |

#### Response (`200 OK`)
```json
{
  "job_id": "job_d40409a473",
  "status": "completed",
  "query": "Did renewable energy generate more than 30% of global electricity in 2024?",
  "claims": [
    {
      "id": "claim_01",
      "text": "Renewable energy generated over 30% of global electricity in 2024.",
      "verdict": "SUPPORTED",
      "confidence": 0.95,
      "reasoning": "Ember Global Electricity Review 2025 confirms renewables reached 32% in 2024."
    }
  ],
  "sources": [
    {
      "id": "src_01",
      "url": "https://ember-climate.org/insights/research/global-electricity-review-2025/",
      "title": "Global Electricity Review 2025 | Ember",
      "snippet": "Clean electricity generated 40% of global power in 2024..."
    }
  ],
  "contradictions": [],
  "report_markdown": "# Fact Verification Report...",
  "errors": []
}
```

---

## 🧠 How the Pipeline Works

```
[START] → Claim Extractor → Search Retriever → Fact Verifier → Contradiction Detector → Report Generator → [END]
```

1. **Claim Extractor** — Breaks the user query into atomic, testable claim statements
2. **Search Retriever** — Queries Tavily for live web results, embeds snippets into a FAISS index
3. **Fact Verifier** — Cross-checks each claim against retrieved evidence; assigns `SUPPORTED`, `REFUTED`, or `INCONCLUSIVE` with a confidence score
4. **Contradiction Detector** — Identifies numerical mismatches and reporting conflicts across sources
5. **Report Generator** — Synthesizes all findings into a structured Markdown research report
