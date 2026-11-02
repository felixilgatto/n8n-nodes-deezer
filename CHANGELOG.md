# Changelog

## Unreleased

### Changed
- Migrated tooling from the legacy n8n-nodes-starter (gulp, tslint, eslintrc) to the official `@n8n/node-cli` (build, dev, lint, release).
- Upgraded to TypeScript 5.9, ESLint 9 (flat config) and Prettier 3.
- Enabled n8n `strict` mode: the package no longer has any runtime dependency (`lodash` and `@n8n/client-oauth2` removed).
- `n8n-workflow` is now a peer dependency.
- Node is now usable as an AI agent tool (`usableAsTool`).
- Errors are now wrapped in `NodeApiError` for clearer messages in n8n.
- Icon moved to `icons/` and also used by the credential.

- New **Authentication** option (node version 1.1): `None` for public data without any Deezer account, or `OAuth2`. Existing workflows (version 1) keep using OAuth2.
- Operations requiring an account fail with a clear error when Authentication is `None`.
- Write operations (create/delete playlist, add/remove tracks) now return `{ "success": true }` instead of a bare boolean.

### Fixed
- Chart operations (Get Artists/Albums/Tracks/Playlists/Podcasts) returned the whole chart instead of the requested list (`/chart/0/<type>`).
- Playlist "Create" called a wrong URL (`user/me/playlists/<id>`); it now calls `POST /user/me/playlists`, and the useless "Resource ID" field is hidden.
- "Return All" no longer crashes on endpoints whose response has no `next` page.
- Request options no longer leak between input items (non-mutating merge).
- The "With Album" search filter is no longer marked as required.
