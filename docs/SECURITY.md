# Security review notes

## Implemented controls

- Passwords are stored as salted scrypt hashes; the original password is never returned or persisted.
- API access tokens are signed with HS256, include issuer/audience/subject/expiry claims, expire after one hour, and require a configured secret of at least 32 characters.
- Private routes require a bearer token and derive the player identity from its verified subject. Request-supplied player IDs do not grant access.
- Collection, team, and encounter reads/writes are scoped to the authenticated player. The encounter and reward changes are written transactionally.
- Zod validation rejects malformed JSON and invalid credentials/gameplay payloads.
- Team creation checks ownership, limits teams to three monsters, and prevents duplicate entries.
- The browser keeps the bearer token in tab-scoped `sessionStorage`, not a persistent local-storage entry.
- Responses include basic anti-sniffing, anti-framing, referrer, and permissions headers.
- Login and registration have process-local request limits (10 logins per IP per 15 minutes; 20 registrations per IP per hour).

## Remaining risks and deployment requirements

- This is a teaching prototype, not a production security certification. `sessionStorage` is accessible to same-origin JavaScript; deploy a restrictive Content Security Policy and prevent XSS before using real accounts.
- Authentication limits are in-memory and reset on restart; a multi-instance deployment must replace them with shared storage and configure its trusted proxy to overwrite `X-Forwarded-For`.
- Password reset, email verification, token revocation, and account deletion are not implemented.
- A Content Security Policy is not configured yet; add and test a restrictive policy before deployment.
- Bearer tokens must only be sent over HTTPS in a deployed environment. Configure `JWT_SECRET` from a secret manager and rotate it deliberately; never commit `.env`.
- The development Docker Compose database uses a simple local password and must not be exposed to untrusted networks.
- The JWT expires in one hour. Logging out removes the browser's copy but cannot revoke a token already copied by an attacker.
- `npm audit` reports 28 advisories (8 high, 20 moderate) in the full dependency tree. The high findings currently resolve to `braces` through the Next ESLint toolchain and `deepmerge-ts` through Prisma configuration; npm reports no compatible non-breaking fix for those paths. `npm audit fix` was run without `--force`; the remaining suggested fixes downgrade core tooling, so they were not applied blindly.
- Security review is limited to the code and requirements available in this repository. Re-run dependency auditing and a threat review before deployment.
