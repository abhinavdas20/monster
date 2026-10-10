# REST API

All endpoints use JSON. `GET /api/monsters` is public; account and gameplay endpoints require `Authorization: Bearer <token>`. Tokens are issued by register/login and expire after one hour.

## Authentication

### `POST /api/auth/register`

Create a player, starter collection, and starter team.

```json
{ "username": "Ash", "password": "use-at-least-8-characters" }
```

Username: 3-32 letters, numbers, spaces, `_`, or `-`. Password: 8-128 characters. Returns `201` with `{ player, token, tokenType, expiresIn }`. Duplicate usernames return `409`.

### `POST /api/auth/login`

Accepts the same credential fields and returns the bearer token. Invalid credentials return the same `401` response regardless of whether the username exists.

## Monster and player data

| Method | Path | Access | Behavior |
|---|---|---|---|
| `GET` | `/api/monsters` | Public | List the seeded roster |
| `GET` | `/api/players/{your-player-id}/collection` | Bearer | List the authenticated player's monsters; other player IDs return `403` |

## Gameplay

| Method | Path | Access | Behavior |
|---|---|---|---|
| `GET` | `/api/teams` | Bearer | List your teams |
| `POST` | `/api/teams` | Bearer | Create a team with `{ "name": "Squad", "monsterIds": ["m1", "m2"] }`; only 1-3 owned monsters are allowed |
| `POST` | `/api/encounters` | Bearer | Resolve `{ "teamId": "...", "wildMonsterId": "m4" }`; returns and persists the outcome/reward |
| `GET` | `/api/encounters` | Bearer | List your encounter history |
| `GET` | `/api/history` | Bearer | History alias |
| `GET` | `/api/encounters/{id}` | Bearer | Read one of your encounters; another player's encounter returns `404` |

Validation failures return `400`, missing/invalid credentials return `401`, and domain ownership or game-rule failures return `400`/`403` as documented above.
