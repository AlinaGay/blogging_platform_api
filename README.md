# Blogging Platform API

A simple RESTful API for a personal blogging platform with full CRUD operations.

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy (async), Alembic, Pydantic
- **Frontend**: TypeScript, React 18, Vite, React Router, Axios
- **Database**: PostgreSQL 15+

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/posts` | Create a new post |
| GET | `/api/v1/posts` | List all posts (with pagination and search) |
| GET | `/api/v1/posts/{id}` | Get a single post |
| PUT | `/api/v1/posts/{id}` | Update a post |
| DELETE | `/api/v1/posts/{id}` | Delete a post |

**Query parameters** for `GET /api/v1/posts`:
- `skip` — offset (default: 0)
- `limit` — page size (default: 20, max: 100)
- `search` — keyword search in title and body

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### Database Setup

```bash
createdb blog_db
```

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Running Tests

```bash
cd backend
source .venv/bin/activate
pytest
```

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app, CORS, error handlers
│   ├── config.py         # Settings from .env
│   ├── database.py       # Async SQLAlchemy engine and session
│   ├── models.py         # Post model
│   ├── schemas.py        # Pydantic request/response schemas
│   └── routes/
│       └── posts.py      # CRUD endpoints
├── alembic/              # Database migrations
├── tests/                # pytest tests
└── requirements.txt

frontend/
├── src/
│   ├── api/
│   │   └── posts.ts      # API client
│   ├── components/
│   │   ├── PostList.tsx
│   │   ├── PostDetail.tsx
│   │   ├── PostForm.tsx
│   │   └── SearchBar.tsx
│   └── pages/
│       ├── HomePage.tsx
│       ├── PostPage.tsx
│       └── EditPostPage.tsx
├── package.json
└── vite.config.ts
```
