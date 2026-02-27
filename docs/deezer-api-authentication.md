# Deezer API and Authentication Guide

## Overview

The Deezer API provides access to Deezer's music catalog, user data, and various music-related resources. This document outlines the API structure, authentication flow, and implementation details.

**Official Documentation:** https://developers.deezer.com/api

## Base URL

All API requests are made to:
```
https://api.deezer.com
```

## Authentication

### OAuth 2.0 Flow

Deezer uses the OAuth 2.0 authorization code grant flow for authentication.

#### 1. OAuth Endpoints

**Authorization URL:**
```
https://connect.deezer.com/oauth/auth.php
```

**Access Token URL:**
```
https://connect.deezer.com/oauth/access_token.php
```

#### 2. Required Parameters

**For Authorization Request:**
- `app_id` - Your application ID
- `redirect_uri` - The URI to redirect after authorization
- `perms` - Comma-separated list of permissions (scopes)
- `output` - Set to `json` for JSON response format

**For Access Token Request:**
- `app_id` - Your application ID
- `secret` - Your application secret
- `code` - The authorization code received from the authorization step
- `output` - Set to `json` for JSON response format (**IMPORTANT**: Without this parameter, Deezer returns URL-encoded text/html which causes authentication errors)

#### 3. Available Permissions (Scopes)

| Permission | Description |
|------------|-------------|
| `basic_access` | Access to basic user information |
| `email` | Access to the user's email address |
| `offline_access` | Access to user data at any time (refresh token) |
| `manage_library` | Add/remove tracks, albums, artists to/from user's library |
| `manage_community` | Manage user's friends and posts |
| `delete_library` | Delete user's library items |
| `listening_history` | Access to user's listening history |

**Permissions URL:** https://developers.deezer.com/api/permissions

#### 4. Access Token Usage

Once obtained, the access token should be included in API requests in one of two ways:

**Method 1: Query Parameter (Recommended by implementation)**
```
GET /user/me?access_token=YOUR_ACCESS_TOKEN
```

**Method 2: Request Body**
```
POST /playlist/{id}/tracks
Content-Type: application/x-www-form-urlencoded

access_token=YOUR_ACCESS_TOKEN&songs=TRACK_ID
```

## API Resources

### Albums

**Endpoints:**
- `GET /album/{id}` - Get album details
- `GET /album/{id}/tracks` - Get album tracks
- `GET /album/{id}/fans` - Get album fans
- `GET /search/album?q={query}&order={order}` - Search for albums

### Artists

**Endpoints:**
- `GET /artist/{id}` - Get artist details
- `GET /artist/{id}/top` - Get artist's top tracks
- `GET /artist/{id}/albums` - Get artist's albums
- `GET /artist/{id}/fans` - Get artist fans
- `GET /artist/{id}/related` - Get related artists
- `GET /artist/{id}/radio` - Get artist radio tracks
- `GET /artist/{id}/playlists` - Get artist playlists
- `GET /search/artist?q={query}&order={order}` - Search for artists

### Tracks

**Endpoints:**
- `GET /track/{id}` - Get track details
- `GET /search/track?q={query}&order={order}` - Search for tracks

### Playlists

**Endpoints:**
- `GET /playlist/{id}` - Get playlist details
- `POST /user/me/playlists/{id}?title={name}` - Create a playlist
- `DELETE /playlist/{id}` - Delete a playlist
- `GET /playlist/{id}/fans` - Get playlist fans
- `GET /playlist/{id}/tracks` - Get playlist tracks
- `POST /playlist/{id}/tracks?songs={track_id}` - Add track to playlist
- `DELETE /playlist/{id}/tracks?songs={track_id}` - Remove track from playlist
- `GET /playlist/{id}/radio` - Get playlist radio tracks
- `GET /search/playlist?q={query}&order={order}` - Search for playlists

### Users

**Endpoints:**
- `GET /user/{id}` or `GET /user/me` - Get user details
- `GET /user/{id}/playlists` - Get user playlists
- `GET /user/{id}/tracks` - Get user's favorite tracks
- `GET /user/{id}/albums` - Get user's favorite albums
- `GET /user/{id}/artists` - Get user's favorite artists
- `GET /user/{id}/podcasts` - Get user's favorite podcasts
- `GET /user/{id}/radios` - Get user's favorite radios
- `GET /user/{id}/flow` - Get user's Flow (personalized radio)
- `GET /user/{id}/followings` - Get users the user follows
- `GET /user/{id}/followers` - Get user's followers
- `GET /user/{id}/history` - Get user's listening history (recent tracks)

### Podcasts

**Endpoints:**
- `GET /podcast/{id}` - Get podcast details
- `GET /podcast/{id}/episodes` - Get podcast episodes
- `GET /search/podcast?q={query}&order={order}` - Search for podcasts

### Charts

**Endpoints:**
- `GET /chart` - Get chart (all categories)
- `GET /chart/artists` - Get top artists chart
- `GET /chart/albums` - Get top albums chart
- `GET /chart/tracks` - Get top tracks chart
- `GET /chart/playlists` - Get top playlists chart
- `GET /chart/podcasts` - Get top podcasts chart

## Search

### Search Query Format

Searches support keyword and filter combinations:

**Basic Search:**
```
GET /search/{resource}?q=keyword
```

**Advanced Search with Filters:**
```
GET /search/track?q=artist:"Daft Punk" album:"Random Access Memories"
```

**Available Filter Fields:**
- `artist` - Filter by artist name
- `album` - Filter by album name
- `track` - Filter by track name
- `label` - Filter by label
- `dur_min` - Minimum track duration (in seconds)
- `dur_max` - Maximum track duration (in seconds)
- `bpm_min` - Minimum BPM
- `bpm_max` - Maximum BPM

**Order Parameter:**
- `RANKING` - Sort by relevance (default)
- `TRACK_ASC` - Sort by track title (ascending)
- `TRACK_DESC` - Sort by track title (descending)
- `ARTIST_ASC` - Sort by artist name (ascending)
- `ARTIST_DESC` - Sort by artist name (descending)
- `ALBUM_ASC` - Sort by album title (ascending)
- `ALBUM_DESC` - Sort by album title (descending)
- `RATING_ASC` - Sort by rating (ascending)
- `RATING_DESC` - Sort by rating (descending)
- `DURATION_ASC` - Sort by duration (ascending)
- `DURATION_DESC` - Sort by duration (descending)

## Response Format

### Standard Response Structure

All API responses return JSON with the following structure:

**Collection Response:**
```json
{
  "data": [
    { /* resource object */ },
    { /* resource object */ }
  ],
  "total": 100,
  "next": "https://api.deezer.com/search/track?q=query&index=25"
}
```

**Single Resource Response:**
```json
{
  "id": 123,
  "title": "Resource Title",
  /* other resource properties */
}
```

### Pagination

API responses include pagination for collections:

- **`data`** - Array of resource objects
- **`total`** - Total number of results available
- **`next`** - URL to the next page of results (if available)
- **`prev`** - URL to the previous page of results (if available)

**Pagination Parameters:**
- `index` - Starting position (default: 0)
- `limit` - Number of results per page (default: 25, max: typically 100)

**Example:**
```
GET /search/track?q=daft+punk&index=25&limit=25
```

### Automatic Pagination Handling

The implementation includes automatic pagination that:
1. Fetches all pages by following the `next` URL
2. Combines all results into a single response
3. Stops if total results exceed 1,000 items (to prevent excessive requests)
4. Removes the `next` property when all data is fetched

## Error Handling

### HTTP Methods

- **GET** - Retrieve resources
- **POST** - Create resources or add items
- **DELETE** - Delete resources or remove items

### Common Error Responses

While specific error codes weren't available in the documentation, common HTTP status codes apply:

- `200 OK` - Successful request
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limiting

The Deezer API implements rate limiting, though specific limits are not publicly documented. Best practices:

1. Implement exponential backoff for retries
2. Cache responses when possible
3. Use pagination wisely (don't fetch all pages unnecessarily)
4. Monitor for 429 status codes

## Implementation Notes

### Authentication Storage

The OAuth2 implementation stores:
- `clientId` - Application ID
- `clientSecret` - Application secret
- `oauthTokenData` - Contains the access token and related data
- `scope` - Array of granted permissions

### Request Building

All requests should:
1. Use the base URL `https://api.deezer.com`
2. Include the access token (for authenticated endpoints)
3. Set `output=json` for JSON responses (especially for OAuth endpoints)
4. Use appropriate HTTP method (GET, POST, DELETE)

### Special Considerations

1. **User "me" Shortcut:** Use `user/me` instead of `user/{id}` to reference the authenticated user
2. **Scope Separator:** Scopes are separated by spaces in the OAuth flow
3. **Token Authentication:** Tokens can be passed in query string or request body
4. **SSL/TLS:** Always use HTTPS for API requests

## Developer Resources

- **Main API Documentation:** https://developers.deezer.com/api
- **Permissions Documentation:** https://developers.deezer.com/api/permissions
- **OAuth Documentation:** https://developers.deezer.com/api/oauth
- **API Explorer:** https://developers.deezer.com/api/explorer
- **Terms of Use:** https://developers.deezer.com/termsofuse
- **Support:** https://developers.deezer.com/support

## Getting Started

1. **Create an Application**
   - Visit https://developers.deezer.com/
   - Create a new application to get your `app_id` and `secret`

2. **Configure OAuth**
   - Set up your redirect URI in the application settings
   - Choose the permissions your application needs

3. **Implement Authentication Flow**
   - Redirect users to the authorization URL
   - Handle the callback with the authorization code
   - Exchange the code for an access token
   - Store the access token securely

4. **Make API Requests**
   - Use the access token in your requests
   - Handle pagination for large result sets
   - Implement error handling and retries

## Example: Building a Search Query

```javascript
// Basic keyword search
const query = "Daft Punk";

// Search with filters
const keyword = "Get Lucky";
const filters = {
  artist: "Daft Punk",
  album: "Random Access Memories"
};

// Resulting query: Get Lucky artist:"Daft Punk" album:"Random Access Memories"
let searchQuery = keyword;
for (let [key, value] of Object.entries(filters)) {
  searchQuery += ` ${key}:"${value}"`;
}

// Make the request
// GET /search/track?q=Get+Lucky+artist:"Daft+Punk"+album:"Random+Access+Memories"&order=RANKING
```

## Notes

- This documentation is based on the implementation in the n8n-nodes-deezer project and available Deezer API documentation
- Always refer to the official Deezer API documentation for the most up-to-date information
- API endpoints and features may change; check the official documentation regularly
- Rate limits and quotas may apply based on your application tier

## Troubleshooting

### Authentication Error: "Unsupported content type: text/html"

**Problem:**
When authenticating with Deezer OAuth2, you receive an error:
```
Error: Unsupported content type: text/html; charset=utf-8
"access_token=...&expires=0"
```

**Cause:**
By default, Deezer's access token endpoint returns the response in URL-encoded format with `text/html` content type instead of JSON. OAuth2 clients typically expect JSON responses.

**Solution:**
The access token request must include the query parameter `output=json`. This is configured in the credentials file via the `accessTokenUrlQueryParameters` property:

```typescript
{
  displayName: 'Access Token URI Query Parameters',
  name: 'accessTokenUrlQueryParameters',
  type: 'hidden',
  default: 'output=json',
}
```

This ensures that both the authorization AND access token requests receive JSON responses from Deezer.

**Fixed in:** Version 0.4.3+
