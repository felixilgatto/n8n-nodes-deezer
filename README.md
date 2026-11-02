# Deezer Node for n8n

This is a custom node for [n8n](https://n8n.io/) that allows you to interact with the Deezer API. With this node, you can perform various actions such as searching for tracks, albums, artists, and playlists, retrieving track details, and more.

## Prerequisites

- **Nothing** for the public catalog: search, albums, artists, tracks, playlists, podcasts, charts and public user profiles work without any account (set *Authentication* to **None**).
- **A Deezer developer app** (App ID + Secret) for operations on your own account: your profile, favorites, listening history, creating/deleting playlists and adding/removing tracks.

> ⚠️ Deezer is currently **not accepting new developer applications** ([official answer, Oct 2025](https://en.deezercommunity.com/features-feedback-44/api-auth-impossible-80857)). Existing apps keep working. If you don't have one, you can still use every public operation.

## Installation
### User
https://docs.n8n.io/integrations/community-nodes/installation/gui-install/

### Developer
This project uses the official [`@n8n/node-cli`](https://www.npmjs.com/package/@n8n/node-cli) tooling. Node.js 24+ is recommended.

```bash
git clone https://github.com/felixcapuano/n8n-nodes-deezer.git
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

### Deezer

The Deezer node has the following operations:

- **Search**: Search for tracks, albums, artists, or playlists.
- **Get Track**: Retrieve details for a specific track.
- **Get Album**: Retrieve details for a specific album.
- **Get Artist**: Retrieve details for a specific artist.
- **Get Playlist**: Retrieve details for a specific playlist.
- **Get User**: Retrieve details for a specific user.
- And more...

For detailed information on each operation and their respective input/output parameters, refer to the [Deezer API documentation](https://developers.deezer.com/api).

## Limitations

Please note that this node currently supports a subset of the Deezer API functionality. If you require additional features, feel free to contribute to the project or submit a feature request.

## Support

If you encounter any issues or have any questions, please open an issue in the [GitHub repository](https://github.com/felixcapuano/n8n-nodes-deezer/issues).

## License

[MIT](LICENSE)
