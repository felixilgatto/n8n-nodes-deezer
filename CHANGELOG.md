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

### Fixed
- "Return All" no longer crashes on endpoints whose response has no `next` page.
- Request options no longer leak between input items (non-mutating merge).
- The "With Album" search filter is no longer marked as required.
