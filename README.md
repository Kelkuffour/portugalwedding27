# Agostinho e Kety wedding invitation

Use Node 22.18 or newer. Install with `npm install`, then run `npm run dev`
and open http://localhost:3000.

## WhatsApp RSVP

The RSVP form opens a prefilled WhatsApp message to +352 661 939 655 with the
guest's name, contact, attendance, party size, and optional note. Guests press Send
in WhatsApp to deliver it. Opening WhatsApp is not a delivery confirmation.
This works on Vercel without a database or SMS service.

## Comments on Vercel

The repository includes Vercel Functions for `/api/guestbook` and
`/api/guestbook/:id`. The existing form can post, list, and delete comments through
these endpoints. The shared backend uses Neon Postgres when `DATABASE_URL` or
`POSTGRES_URL` is configured. It never writes local files on Vercel.

1. Import this GitHub repository into a Vercel project. `vercel.json` selects Vite,
   runs `npm run build`, and publishes `dist/` with the comment API functions.
2. In Vercel Storage, connect a Neon Postgres database to the project. The integration
   can set `DATABASE_URL` for Development, Preview, and Production. Choose the Free
   plan if that is the plan you want; accept the provider's terms in your account.
3. Redeploy after connecting the database. The first comments request creates the
   `wedding_comments` table automatically. The database role needs permission to
   create tables. Database credentials stay server-side and must never have a
   `VITE_` prefix.
4. Test a comment on the deployed HTTPS site, refresh the page, and delete it using
   the same browser. Other browsers can read it but cannot delete it.

Use a separate database for preview deployments if you do not want test comments
mixed with production messages. Database storage survives function shutdowns and
new site deployments. A missing/unavailable database returns an error and never
shows an unsaved comment as successful.

The old public RSVP-data and invitation-editing API routes are retired. The site
still uses WhatsApp for RSVP. Database secrets and saved local data are excluded
from Git and deployment uploads.

## Local comments and existing data

Without `DATABASE_URL`, `npm run dev` uses the ignored `data/` directory (or
`INVITATION_DATA_DIR`). The two original demo comments are removed automatically;
other messages and saved data are preserved. Setting `DATABASE_URL` locally makes
the local app use that database, so use a development database while testing.

To import existing local comments into a connected database, set `DATABASE_URL`
in a local `.env`, then run `npm run comments:import`. This preserves comment IDs,
posting times, and ownership hashes, skips demo messages and already-imported IDs,
and does not upload RSVP contacts or invitation settings.

Visitors can delete their own comments using “Delete my comment” and confirming.
An HTTP-only ownership cookie lasts one year. Deletion requires the browser used
to post; clearing cookies or changing devices loses that access. Old comments
without ownership records cannot be claimed by entering the same name. Public
responses never include ownership hashes. No sign-in is required to post.

The temporary static client-preview tunnel does not expose the API and remains
read-only for comments. Use the local Node server or the Vercel deployment to test
posting and deletion.

## Checks

```sh
npm run build
npm run lint
npm test
```

Tests cover local persistence, real PostgreSQL queries with an embedded test
engine, concurrent writes, server restarts, failed saves/deletes, validation,
private ownership checks, and missing Vercel database configuration. They use
isolated temporary databases and never connect to your real database.
