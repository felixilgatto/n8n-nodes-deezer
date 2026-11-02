# Deezer Node for n8n

This is a custom node for [n8n](https://n8n.io/) that allows you to interact with the Deezer API. With this node, you can perform various actions such as searching for tracks, albums, artists, and playlists, retrieving track details, and more.

## Prerequisites

- **Nothing** for the public catalog: search, albums, artists, tracks, playlists, podcasts, charts and public user profiles work without any account (set *Authentication* to **None**).
- **A Deezer developer app** (App ID + Secret) for operations on your own account: your profile, favorites, listening history, creating/deleting playlists and adding/removing tracks.

> ⚠️ **About OAuth2 operations**
> - Deezer is **not accepting new developer applications** since 2025, because of API abuse ([official answer, Oct 2025](https://en.deezercommunity.com/features-feedback-44/api-auth-impossible-80857)).
> - The maintainer's own existing app can still complete the OAuth flow, but every authenticated call now returns `OAuthException — Application error (code 50)`, and other developers report existing apps that stopped working.
> - As a result, the operations marked 🔒 below could **not be validated against the live API** for this release: they follow the Deezer API documentation and were tested with intercepted requests only.
> - All public operations (Authentication **None**) are validated against the live API and need no Deezer app at all.

## Installation
### User
https://docs.n8n.io/integrations/community-nodes/installation/gui-install/

### Developer
This project uses the official [`@n8n/node-cli`](https://www.npmjs.com/package/@n8n/node-cli) tooling. Node.js 24+ is recommended.

```bash
git clone https://github.com/felixilgatto/n8n-nodes-deezer.git
cd n8n-nodes-deezer
npm install
npm run dev      # starts a local n8n with this node loaded and hot reload
```

Other scripts:

| Script | Description |
|---|---|
| `npm run build` | Compile to `dist/` |
| `npm run lint` / `npm run lint:fix` | Lint with the n8n community node rules |
| `npm run release` | Bump version, tag and publish to npm |

## Usage

1. Add the **Deezer** node to a workflow.
2. Choose the **Authentication**:
   - **None**: public data only, no credentials needed.
   - **OAuth2**: select or create *Deezer OAuth2 API* credentials (see below).
3. Pick a **Resource** and an **Operation**, fill in the fields and execute.

Operations that need an account (*Playlist → Create / Delete / Add Tracks / Remove Track*, *User → Get Recent Tracks*, *User → Return My User*) fail with a clear error when Authentication is **None**.

## Credentials

Only needed with **OAuth2** authentication.

1. On [Deezer for Developers](https://developers.deezer.com/myapps), open your app and set its *Redirect URL* to the OAuth callback URL shown by n8n in the credential dialog.
2. In n8n, create a **Deezer OAuth2 API** credential and paste your **App ID** (Client ID) and **Secret Key** (Client Secret).
3. Pick the scopes you need and click **Connect my account**.

## Node Reference

🔒 = requires **OAuth2** authentication.

| Resource | Operations |
|---|---|
| **Album** | Get, Get Tracks, Get Fans, Search, Add to Favorites 🔒, Remove From Favorites 🔒 |
| **Artist** | Get, Get Albums, Get Top Tracks, Get Related Artists, Get Radio, Get Playlists, Get Fans, Search, Add to Favorites 🔒, Remove From Favorites 🔒 |
| **Chart** | Get All, Get Tracks, Get Albums, Get Artists, Get Playlists, Get Podcasts (optionally for one genre) |
| **Editorial** | Get Many, Get, Get Selection, Get Chart, Get Releases |
| **Episode** | Get |
| **Genre** | Get Many, Get, Get Artists, Get Podcasts, Get Radios |
| **Playlist** | Get, Get Tracks, Get Fans, Get Radio, Search, Create 🔒, Update 🔒, Delete 🔒, Add Tracks 🔒, Remove Tracks 🔒, Reorder Tracks 🔒, Add to Favorites 🔒, Remove From Favorites 🔒 |
| **Podcast** | Get, Get Episodes, Search, Add to Favorites 🔒, Remove From Favorites 🔒 |
| **Radio** | Get Many, Get, Get Tracks, Get Genres, Get Lists, Search, Add to Favorites 🔒, Remove From Favorites 🔒 |
| **Track** | Get, Search, Add to Favorites 🔒, Remove From Favorites 🔒 |
| **User** | Get, Get Playlists, Get Favorite Tracks/Albums/Artists/Podcasts/Radios, Get Flow, Get Followers, Get Followings, Get Charts, Search, Get Recent Tracks 🔒, Get Recommendations 🔒, Get Search History 🔒, Get Permissions 🔒, Follow 🔒, Unfollow 🔒 |

List operations support **Return All** (up to 1000 items) or **Offset/Limit**. Track, album, artist, playlist and podcast searches support ordering and advanced filters (artist, album, track, label, duration, BPM).

See the [Deezer API documentation](https://developers.deezer.com/api) for the returned fields.

## Limitations

- Deezer reports errors with HTTP 200; the node turns them into regular n8n errors (e.g. `Deezer: no data — DataException (code 800)`).
- Some lists are capped or filtered by Deezer itself (e.g. search results stop around a few hundred items, private followers are hidden), so `total` can be larger than what can be fetched.

## Support

If you encounter any issues or have any questions, please open an issue in the [GitHub repository](https://github.com/felixilgatto/n8n-nodes-deezer/issues).

## License

[MIT](LICENSE)
