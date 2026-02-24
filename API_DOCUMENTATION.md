# Web Portal API – Documentation

This document confirms the API and its documentation are set up correctly.

## Overview

- **Stack:** Node.js, Express, MongoDB (Mongoose)
- **Base URL:** `http://localhost:4000` (or `PORT` in `.env`)
- **API docs:** OpenAPI 3.0.3 spec + Swagger UI

## Where the documentation lives

| What | Where |
|------|--------|
| **Interactive docs (Swagger UI)** | `GET http://localhost:4000/api-docs` – try endpoints from the browser |
| **OpenAPI spec (JSON)** | `GET http://localhost:4000/api-docs.json` – machine-readable spec |
| **Spec source file** | `openapi.json` in this repo – single source of truth for the spec |

## Endpoints

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server health. Returns `{ "ok": true, "message": "web-portal-backend" }`. |

### Projects

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List all projects (newest first). |
| POST | `/api/projects` | Create a project. Body: JSON (see `ProjectInput` in spec). Do not send `id` or `_id`. |
| GET | `/api/projects/:id` | Get one project by MongoDB `_id`. |
| PATCH | `/api/projects/:id` | Update a project (partial). Body: JSON. `id`/`_id` are stripped. |
| DELETE | `/api/projects/:id` | Delete a project. Returns 204 on success. |

### Proposals

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/proposals` | List all proposals (most recently updated first). |
| POST | `/api/proposals` | Create a proposal. Body: JSON (see `ProposalInput` in spec). |
| GET | `/api/proposals/:id` | Get one proposal by ID. |
| PATCH | `/api/proposals/:id` | Update a proposal (partial). |
| DELETE | `/api/proposals/:id` | Delete a proposal. Returns 204 on success. |

## Request / response

- **Content-Type:** `application/json` for request bodies and responses.
- **IDs:** All `:id` path params are MongoDB ObjectIds (24-char hex strings). Responses expose `id` (string) in addition to `_id`.
- **Errors:** Error responses use `{ "error": "<message>" }` with appropriate HTTP status (400, 404, 500).

## OpenAPI spec (`openapi.json`)

- **openapi:** `3.0.3`
- **info:** title "Web Portal API", version 1.0.0
- **servers:** `http://localhost:4000`
- **paths:** All endpoints above are described (summary, parameters, requestBody where applicable, responses).
- **components.schemas:** `Error`, `Project`, `ProjectInput`, `Proposal`, `ProposalInput`, `ClientInfo`, `ProposalHistoryItem` – aligned with the Mongoose models and frontend types.

The server loads `openapi.json` at startup and serves it at `/api-docs.json` and uses it for Swagger UI at `/api-docs`. So the API and documentation are wired up correctly.

## How to run and check

1. **Start server:** `npm start` (or `npm run dev`).
2. **Open Swagger UI:** [http://localhost:4000/api-docs](http://localhost:4000/api-docs).
3. **Fetch spec:** `curl http://localhost:4000/api-docs.json`.
4. **Health:** `curl http://localhost:4000/health`.

MongoDB must be running for project and proposal endpoints to work; `/health` and `/api-docs` work without MongoDB.
