# Monster Tamers

A small, playable monster-collection game built with Next.js, a REST API, Prisma, and PostgreSQL. Players register, build teams from owned monsters, battle wild monsters, earn rewards, and revisit persistent encounter history.

## Features

- Public monster roster with images and battle statistics
- Username/password registration and login with short-lived JWT bearer tokens
- Player-scoped persistent collections, teams, encounters, and reward history
- Server-side battle resolution with atomic encounter/reward persistence
- Animated battle presentation (the backend determines the result)
- Unit tests and a repeatable API performance smoke check

## Local setup and development

For local development, run the Next.js app on your machine and PostgreSQL in Docker. You will need Node.js 22 or later, npm, Docker, and Docker Compose.

1. Clone the repository and change into its directory.
2. Create your local environment file:

   ```sh
   cp .env.example .env
   ```

3. Set `JWT_SECRET` in `.env` to a unique secret. Generate one with:

   ```sh
   openssl rand -hex 32
   ```

   Paste the generated value after `JWT_SECRET=` in `.env`. The example file provides the local PostgreSQL connection string and app URL; the connection targets port `5432` on `localhost`.
4. Start the PostgreSQL database:

   ```sh
   docker compose up -d db
   ```

5. Install dependencies, generate the Prisma client, apply the schema, and seed the monster roster:

   ```sh
   npm ci
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

6. Start the development server:

   ```sh
   npm run dev
   ```

7. Visit <http://localhost:3000/login> and create a trainer account.

Keep the database container running while developing. Stop the app with Ctrl+C; stop PostgreSQL when it is no longer needed with `docker compose stop db`. Start it again with `docker compose start db`.

## Run the full stack with Docker

This option runs both PostgreSQL and the development app in containers. First create `.env` as described above and set a strong `JWT_SECRET`, then run:

```sh
docker compose up --build
```

Compose waits for PostgreSQL to become healthy, then syncs the Prisma schema, seeds the roster, and starts the app. Open <http://localhost:3000/login>. Use `docker compose up --build -d` to run in the background and `docker compose logs -f app` to follow app logs.

Stop the containers with `docker compose down`. The PostgreSQL data is stored in a named volume and is retained when the containers stop. To delete that local database and all its data, run `docker compose down -v`.

## Run and validate

- `npm run dev` starts the local development server.
- `npm run build` builds the app for production; `npm start` serves that build.
- `npm test` runs the unit tests.
- `npm run test:api` exercises authentication, validation, ownership, teams, encounters, and persistent history against a running app/database.
- `npm run lint` runs ESLint.
- `npm run perf` runs the API performance smoke check against `http://localhost:3000`.

## Documentation

- [Repo overview and gameplay architecture](./docs/REPO_GUIDE.md)
- [REST API](./docs/API.md)
- [Game logic database tables](./docs/GAME_DATA.md)
- [Project architecture, game data, and security](./docs/ARCHITECTURE.md)
- [Security review notes](./docs/SECURITY.md)
- [Performance check](./docs/PERFORMANCE.md)

The project kickoff references a separate course report template; that template was not included in this repository.

## Project structure

- `app/api` contains REST route handlers.
- `lib/services` contains database-backed gameplay logic.
- `lib/game` contains the battle simulation engine.
- `lib/security` contains password hashing and JWT functions.
- `prisma` contains the schema and roster seed script.
