# Authentication

Lomall uses Discord OAuth2 for authentication and issues JWT tokens for API access.

## Discord OAuth2 Flow

### 1. Initiate Login

Redirect the user to:

```
GET /auth/discord
```

This redirects to Discord's authorization page with `identify`, `email`, and `guilds` scopes.

### 2. Callback

```
GET /auth/discord/callback
```

Discord redirects here after authorization. The API:
- Creates or updates the user record
- Issues a JWT token
- Returns `{ token, user }`

### 3. Authenticated Requests

Include the JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "uuid",
  "discordId": "123456789",
  "username": "user",
  "avatar": "avatar_hash",
  "email": "user@example.com"
}
```

## Token Management

- Tokens expire after **7 days**
- Store the token securely (e.g., localStorage for web, environment for bot)
- Re-authenticate to obtain a new token
