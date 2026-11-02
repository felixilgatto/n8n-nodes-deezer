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

- **New resources**: Editorial, Episode, Genre, Radio.
- **New operations**: add/remove favorites (album, artist, playlist, podcast, radio, track), follow/unfollow a user, update a playlist (title, description, public, collaborative), reorder playlist tracks, user charts, recommendations, search history, permissions, search radios and users.
- Chart operations accept an optional **Genre ID**.
- Field labels now match the resource (e.g. "Album ID" instead of "Resource ID").
- Node description split into `DeezerDescription.ts`; request builders rewritten as a declarative table.

### Fixed
- Deezer errors (returned with HTTP 200 and an `error` object) were output as successful items; they now raise a proper n8n error.
- "Return All", "Offset" and "Limit" were shown on operations that don't return a list (create, delete, add tracks…).
- Pagination parameters were read from the first input item only; they are now read per item.
- "Return All" now uses pages of 100 items (fewer requests).
- Empty search filters were sent as `artist:""`.
- "Get Recent Tracks" with a User ID called an endpoint only available for the authenticated user; it now always targets the authenticated user.
- Wrong labels and descriptions: "Add an Tracks", "Remove an Track", "Get Playlist", all searches described as "Search tracks", playlist "Get Fans" described as artist fans, "Track ID" described as "Name of the playlist", malformed `Accept` header.
- Chart operations (Get Artists/Albums/Tracks/Playlists/Podcasts) returned the whole chart instead of the requested list (`/chart/0/<type>`).
- Playlist "Create" called a wrong URL (`user/me/playlists/<id>`); it now calls `POST /user/me/playlists`, and the useless "Resource ID" field is hidden.
- "Return All" no longer crashes on endpoints whose response has no `next` page.
- Request options no longer leak between input items (non-mutating merge).
- The "With Album" search filter is no longer marked as required.
