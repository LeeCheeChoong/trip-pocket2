# Trip Pocket (Supabase version)

Trip planner with email/password login. Each account sees only its own trips, itinerary,
expenses, photos and packing lists. New accounts start with two example trips.

## Files

| File | What it is |
|---|---|
| `index.html` | The page shell and icons |
| `styles.css` | All styling, light and dark mode |
| `app.js` | The app: login, trips, itinerary, money, photos, packing |
| `config.js` | Supabase project URL and publishable key (safe to ship in a browser) |
| `example.js` | The example trips each new account gets |
| `supabase/migrations/` | Database tables, security rules and photo storage, in the order they were applied |
| `supabase/functions/scan-receipt/` | Edge Function that reads receipt photos with Claude |

## Run it locally

From this folder:

```
python -m http.server 5173
```

Then open http://localhost:5173.

## Supabase settings this app needs

- **Authentication → Sign In / Providers → Email:** "Confirm email" off.
- **Project Settings → Data API:** `public` in Exposed schemas.
- **Edge Functions → Secrets:** `ANTHROPIC_API_KEY` for receipt reading.
- **Authentication → URL Configuration:** add the live site address once it's deployed.

## Deploy

Upload this folder as-is to any static host (Netlify, Vercel, GitHub Pages).
There is no build step. The `supabase/` folder is not needed on the host.
