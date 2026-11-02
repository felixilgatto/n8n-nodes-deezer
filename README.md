# Deezer Node for n8n

This is a custom node for [n8n](https://n8n.io/) that allows you to interact with the Deezer API. With this node, you can perform various actions such as searching for tracks, albums, artists, and playlists, retrieving track details, and more.

## Prerequisites

Before using this node, make sure you have the following:

- An active Deezer account
- Access to the Deezer API (you can obtain this by creating an application on the [Deezer for Developers](https://developers.deezer.com/) website)

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

1. Open n8n in your browser.
2. Create a new workflow or open an existing one.
3. Drag and drop the "Deezer" node from the nodes panel onto the canvas.
4. Double-click on the node to configure it.
5. Click on the credentials field and select "Add new Deezer API credentials".
6. Enter your Deezer API credentials (client ID and client secret) and click "Create".
7. Select the desired operation from the "Operation" dropdown list.
8. Configure the remaining fields based on the selected operation.
9. Click "Execute Node" to run the workflow.

## Credentials

To use the Deezer API node, you need to create Deezer API credentials. Here's how:

1. Open n8n in your browser.
2. Click on the "Credentials" tab in the top menu.
3. Click on the "Create New Credentials" button.
4. Select "Deezer API" from the dropdown list.
5. Enter a name for the credentials (e.g., "Deezer API").
6. Enter your Deezer API client ID and client secret.
7. Click "Create" to save the credentials.

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

If you encounter any issues or have any questions, please open an issue in the [GitHub repository](https://github.com/n8n-io/n8n).

## License

[MIT](LICENSE)
