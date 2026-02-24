# Web Portal Backend

**Separate project from the frontend.** Node.js + Express + MongoDB API.

Keep this repo **next to** your frontend repo (same parent folder), not inside it:

```
GitHub/
  web-portal/           ← frontend
  web-portal-backend/   ← this backend (new project)
```

## Setup

```bash
cd web-portal-backend
npm install
cp .env.example .env
# Edit .env with your MONGODB_URI
npm run dev
```

Server: `http://localhost:4000`

## API docs (Swagger)

- **Swagger UI:** [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
- **OpenAPI JSON:** [http://localhost:4000/api-docs.json](http://localhost:4000/api-docs.json)

## API

- `GET /health`
- `GET/POST /api/projects` — `GET/PATCH/DELETE /api/projects/:id`
- `GET/POST /api/proposals` — `GET/PATCH/DELETE /api/proposals/:id`
