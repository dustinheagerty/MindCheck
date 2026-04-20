# MindCheck – Frontend

React frontend for the MindCheck daily mental wellness check-in app.

## Setup

```bash
npm install
cp .env.example .env
# Set REACT_APP_API_URL to your backend
npm start
```

## Pages

| Route | Page | Backend calls |
|---|---|---|
| `/` | Landing | — |
| `/register` | Register | `POST /auth/register` |
| `/login` | Login | `POST /auth/login` |
| `/dashboard` | Dashboard | `GET /entries/today`, `/trends/streak`, `/prompts/daily`, `/entries?limit=5` |
| `/checkin` | Check-In | `GET /entries/today`, `POST /entries`, `PUT /entries/:id` |
| `/history` | History | `GET /entries`, `PUT /entries/:id`, `DELETE /entries/:id` |
| `/trends` | Trends | `GET /trends/weekly`, `/trends/monthly`, `/trends/streak`, `/entries?limit=30` |
| `/settings` | Settings | `GET /settings`, `PUT /settings` |

## Auth

JWT stored in `localStorage` as `mindcheck_token`.  
Sent as `Authorization: Bearer <token>` on every protected request.

## Team

Dustin Heagerty · William Bezares · Ian Arredondo · Oscar Hernandez · Christian Hernandez
