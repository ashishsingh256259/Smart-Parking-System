# Parking write authorization

The following mutation endpoints now require `Authorization: Bearer <PARKING_ADMIN_API_KEY>`: `POST /api/seed-slots`, `PUT /api/occupy-slot/:id`, `PUT /api/free-slot/:id`.

Set `PARKING_ADMIN_API_KEY` to a random secret of at least 32 characters on the server only. Generate with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`. Never embed this key in the React app or commit it.

If unset, writes return HTTP 503 (fail closed). Missing authorization returns 401; incorrect credentials return 403. Public read routes and path visualization remain unchanged.

**Integration warning:** Existing client-side requests to mutation endpoints without credentials will fail. A real deployment should introduce authenticated user sessions and a backend role/ownership model instead of sending the administrative key to browsers. This change is an interim server-side guard, not a complete user authentication solution.

Run `node --test server/tests/requireAdmin.test.js` and verify end-to-end parking operations in staging before merging.
