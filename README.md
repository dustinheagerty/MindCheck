# MindCheck

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

# MindCheck – Frontend

A simple, beautiful daily mental wellness check-in app built with React.

## Pages

| Route | Description |
|---|---|
| `/` | Landing / marketing page |
| `/register` | Create account |
| `/login` | Sign in |
| `/dashboard` | Home – today's mood, streak, prompt, recent entries |
| `/checkin` | Log or edit today's mood & journal note |
| `/history` | Browse, filter, edit, and delete past entries |
| `/trends` | Mood trend charts (line + bar) and streak stats |

## Tech Stack

- **React 18** + React Router v6
- **Recharts** for mood trend visualizations
- **CSS Variables** for theming (no CSS framework)
- **Google Fonts** – Playfair Display + DM Sans

## Connecting to the Backend

All API calls are in `src/services/api.js`. Every endpoint is documented with JSDoc comments showing the expected request body and response shape.

1. Copy `.env.example` → `.env`
2. Set `REACT_APP_API_URL` to your backend base URL (e.g. `http://localhost:5000/api`)
3. Implement the endpoints listed below in your backend

### Expected API Endpoints

#### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | `{ username, email, password }` → `{ token, user }` |
| POST | `/auth/login` | `{ email, password }` → `{ token, user }` |
| POST | `/auth/logout` | Invalidate session |
| GET | `/auth/me` | Returns current `{ user }` |

#### Entries
| Method | Path | Description |
|--------|------|-------------|
| GET | `/entries` | Returns all entries (query: `limit`, `start_date`, `end_date`) |
| GET | `/entries/today` | Returns today's entry or `null` |
| GET | `/entries/:id` | Single entry |
| POST | `/entries` | `{ mood: 1-5, note?, tags? }` |
| PUT | `/entries/:id` | Update mood/note/tags |
| DELETE | `/entries/:id` | Delete entry |

#### Trends
| Method | Path | Description |
|--------|------|-------------|
| GET | `/trends/weekly` | `{ week_start, week_end, avg_mood, mood_distribution }` |
| GET | `/trends/monthly` | `{ month, avg_mood, mood_distribution }` |
| GET | `/trends/streak` | `{ current_streak, longest_streak }` |

#### Prompts
| Method | Path | Description |
|--------|------|-------------|
| GET | `/prompts/daily` | `{ prompt, category }` |
| GET | `/prompts/random` | `{ prompt, category }` |

#### Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/settings` | User settings object |
| PUT | `/settings` | Update settings |

### Auth Token

The frontend stores the JWT in `localStorage` under the key `mindcheck_token` and sends it as:

```
Authorization: Bearer <token>
```

## Running Locally

```bash
npm install
cp .env.example .env
# Edit .env with your backend URL
npm start
```

Runs on [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
```

Output goes to the `build/` folder and can be served by any static host (Netlify, Vercel, GitHub Pages, etc.).

## Team

Dustin Heagerty · William Bezares · Ian Arredondo · Oscar Hernandez · Christian Hernandez

---

## Setup

**Backend**
```bash
cd server
npm install
mkdir db
cp .env.example .env
node server.js
```
Runs on `http://localhost:5000`

**Frontend**
```bash
npm install
npm start
```
Runs on `http://localhost:3000`

