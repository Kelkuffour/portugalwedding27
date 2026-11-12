# Agostinho e Kety wedding invitation

Install dependencies with `npm install`, then run `npm run dev` and open
http://localhost:3000.

## WhatsApp RSVP

The RSVP form opens a prefilled WhatsApp message to +352 661 939 655 with the
guest's name, contact, attendance, total party size, and optional note. Guests must
press Send in WhatsApp to deliver it. Opening WhatsApp is not a delivery confirmation.
This flow works on a static Vercel deployment without a database or SMS service;
it does not save RSVPs on the server or display a response count.

## Comments and hosting

Guestbook comments are stored by the Node server, not in the browser. The
guestbook starts empty and automatically removes the two original demo entries
without deleting real guest messages. Failed submissions keep the form text and
display an error instead of adding an unsaved comment.

Visitors can delete their own new comments using “Delete my comment” and confirming.
Ownership is remembered in an HTTP-only cookie for one year and checked by the
server. Deletion works in the browser used to post the comment; clearing cookies
or switching devices loses that access. Older comments posted before ownership
tracking cannot be claimed by entering the same name. Ownership credentials are
never returned in public comment data.

For production, run `npm run build`, set `NODE_ENV=production`, and run `npm start`.
Use Node 22.18 or newer. The server uses `PORT` (default: 3000).
Set `INVITATION_DATA_DIR` to a directory on a persistent disk on your host; it
defaults to `data/` in the project. Keep this directory across restarts and deployments
and back it up. This file-based storage supports a single server instance.

Static hosting, including GitHub Pages and the temporary read-only client preview,
cannot save comments. Deploy the Node server to enable shared guestbook submissions.
Saved invitation data is excluded from Git.

## Checks

```sh
npm run build
npm run lint
node --test tests/guestbook.test.mjs
```

The integration test uses an isolated temporary data directory. It verifies sample
removal, preservation of real messages and RSVP data, validation, persistence after
a server restart, and failure reporting when storage is unavailable.
It also verifies that only the comment's browser owner can delete it, that ownership
survives restarts, and that failed deletions preserve the comment.
