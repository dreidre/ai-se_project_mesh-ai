# API Endpoints

All `/chats`, `/documents`, and `/query` routes require an `Authorization: Bearer <token>` header. The 401 pattern shown under `POST /chats` applies to every protected endpoint.

## Auth

| Endpoint | Scenario | Status | Response |
|---|---|---|---|
| `POST /auth/register` | Success | 201 | `data: { userId, email, name }` |
| `POST /auth/register` | Missing field | 400 | `email, password, and name are required` |
| `POST /auth/register` | Email in use | 409 | `Email already in use` |
| `POST /auth/login` | Success | 200 | `data: { token, user: { userId, email, name } }` |
| `POST /auth/login` | Missing field | 400 | `email and password are required` |
| `POST /auth/login` | Wrong credentials | 401 | `Invalid credentials` |

## Chats

| Endpoint | Scenario | Status | Response |
|---|---|---|---|
| `POST /chats` | No token | 401 | `Authorization token required` |
| `POST /chats` | Bad token | 401 | `Invalid or expired token` |
| `POST /chats` | Missing title | 400 | `title is required` |
| `POST /chats` | Success | 201 | `data: { _id, title, userId, createdAt }` |
| `GET /chats` | No token | 401 | `Authorization token required` |
| `GET /chats` | Bad token | 401 | `Invalid or expired token` |
| `GET /chats` | Success | 200 | `data: [{ _id, title, userId, createdAt }]` |
| `GET /chats/:id` | No token | 401 | `Authorization token required` |
| `GET /chats/:id` | Bad token | 401 | `Invalid or expired token` |
| `GET /chats/:id` | Not found | 404 | `Chat not found` |
| `GET /chats/:id` | Success | 200 | `data: { chat: { _id, title, userId, createdAt }, messages: [{ _id, chatId, role, content, createdAt }] }` |

## Messages

Both the user message and assistant message are persisted server-side. `GET /chats/:id` will return both on reload. The response from `POST /chats/:id/messages` returns them as an array so the frontend can append both in one step.

| Endpoint | Scenario | Status | Response |
|---|---|---|---|
| `POST /chats/:id/messages` | No token | 401 | `Authorization token required` |
| `POST /chats/:id/messages` | Bad token | 401 | `Invalid or expired token` |
| `POST /chats/:id/messages` | Missing question | 400 | `question is required` |
| `POST /chats/:id/messages` | Chat not found | 404 | `Chat not found` |
| `POST /chats/:id/messages` | Success | 201 | `data: [{ _id, chatId, role: 'user', content, createdAt }, { _id, chatId, role: 'assistant', content, createdAt }]` |

## Documents

| Endpoint | Scenario | Status | Response |
|---|---|---|---|
| `POST /documents` | No token | 401 | `Authorization token required` |
| `POST /documents` | Bad token | 401 | `Invalid or expired token` |
| `POST /documents` | No file | 400 | `File is required` |
| `POST /documents` | Success | 201 | `data: { _id, title, fileName, userId, createdAt }` |
| `GET /documents` | No token | 401 | `Authorization token required` |
| `GET /documents` | Bad token | 401 | `Invalid or expired token` |
| `GET /documents` | Success | 200 | `data: [{ _id, title, fileName, userId, createdAt }]` |

## Query

> **Note:** `POST /query` is a stateless RAG endpoint — it does not persist messages or require a chat. It is used in S6 as the culmination of the RAG pipeline. The frontend (S7/S8) uses `POST /chats/:id/messages` instead, which runs the same pipeline and also saves the exchange to a chat.

| Endpoint | Scenario | Status | Response |
|---|---|---|---|
| `POST /query` | No token | 401 | `Authorization token required` |
| `POST /query` | Bad token | 401 | `Invalid or expired token` |
| `POST /query` | Missing question | 400 | `question is required` |
| `POST /query` | Success | 200 | `data: { question, chunks: [{ id, documentId, text, score }], answer }` |
