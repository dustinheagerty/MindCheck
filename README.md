# MindCheck

A daily mental wellness check-in app — log your mood, track trends, and build streaks.

## Team

Dustin Heagerty · William Bezares · Ian Arredondo · Oscar Hernandez · Christian Hernandez

---

## Requirements

The system shall:
- Allow users to log daily mood
- Allow users to add notes/journal entries
- Display mood history
- Show mood trend visualization
- Provide encouragement prompts
- Allow users to edit previous entries
- Save user data locally or in database
- Allow users to view weekly summary

## Scope

### In Scope
- Daily mood logging
- Notes/journal entries
- Mood history
- Weekly summaries
- Mood trend visualization
- Encouragement prompts
- Edit previous entries

### Out of Scope
- Social features
- Therapist connections
- AI diagnosis

### System Refusals
- Will not provide medical advice
- Will not replace professional help

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

## Setup

### Backend
```bash
cd server
cp .env.example .env
npm install
node server.js
```
Runs on `http://localhost:5000`

### Frontend
```bash
# from project root
cp .env.example .env
npm install
npm start
```
Runs on `http://localhost:3000`

> The `.env.example` files contain default values that work for local development out of the box.

---

## Tech Stack

### Frontend
- **React 18** + React Router v6
- **Recharts** for mood trend charts
- **CSS Variables** for theming (no CSS framework)
- **Google Fonts** – Playfair Display + DM Sans

### Backend
- **Express.js** REST API
- **SQLite** via `node-sqlite3-wasm` (no native compilation required)
- **JWT** authentication (7-day tokens)
- **bcryptjs** for password hashing

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Today's mood, streak, daily prompt, recent entries |
| `/checkin` | Log or update today's mood & journal note |
| `/history` | Browse, filter, edit, and delete past entries |
| `/trends` | Mood trend charts and streak stats |
| `/settings` | Account info and preferences |

---

## API Endpoints

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Auth
| Method | Path | Body / Response |
|--------|------|----------------|
| POST | `/auth/register` | `{ username, email, password }` → `{ token, user }` |
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` |
| POST | `/auth/logout` | → `{ message }` |
| GET | `/auth/me` | → `{ user }` |

### Entries (protected)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/entries` | All entries (query: `limit`, `start_date`, `end_date`) |
| GET | `/entries/today` | Today's entry or `null` |
| GET | `/entries/:id` | Single entry |
| POST | `/entries` | `{ mood: 1–5, note?, tags? }` |
| PUT | `/entries/:id` | Update mood / note / tags |
| DELETE | `/entries/:id` | Delete entry |

### Trends (protected)
| Method | Path | Response |
|--------|------|----------|
| GET | `/trends/weekly` | `{ week_start, week_end, avg_mood, mood_distribution, entries }` |
| GET | `/trends/monthly` | `{ month, avg_mood, mood_distribution, entries }` |
| GET | `/trends/streak` | `{ current_streak, longest_streak }` |

### Prompts
| Method | Path | Response |
|--------|------|----------|
| GET | `/prompts/daily` | `{ prompt, category }` |
| GET | `/prompts/random` | `{ prompt, category }` |

### Settings (protected)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/settings` | User settings |
| PUT | `/settings` | Update settings |
