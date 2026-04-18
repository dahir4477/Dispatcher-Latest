# Deployment Guide — Suprihub Logistics & Dispatch Solutions

Best practices for deploying this landing page to **Vercel** with **Supabase** lead capture.

---

## 1. Prerequisites

- [Vercel](https://vercel.com) account (or use CLI)
- [Supabase](https://supabase.com) project
- Git repo (GitHub, GitLab, or Bitbucket) connected to Vercel (recommended)

---

## 2. Supabase Setup

### 2.1 Create project

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project.
2. Wait for the project to be ready and note:
   - **Project URL** (Settings → API)
   - **anon public** key (Settings → API)

### 2.2 Run migration

1. In Supabase Dashboard: **SQL Editor** → New query.
2. Paste and run the contents of `supabase/migrations/001_early_access_leads.sql`.
3. Confirm the `early_access_leads` table exists under **Table Editor**.

### 2.3 (Optional) RLS

The migration enables RLS and policies so that:

- **anon** key can **insert** into `early_access_leads` (for the public form).
- **select/update/delete** are restricted to **service_role** (e.g. your backend or Supabase dashboard).

No extra RLS steps are required if you use the migration as-is.

---

## 3. Environment Variables

### 3.1 Local (`.env.local`)

Copy from the example and fill in real values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- Do **not** commit `.env.local` (it’s in `.gitignore`).
- Use **anon** key for the frontend/API route; do **not** put the service_role key in the Next.js app.

### 3.2 Vercel

1. Vercel Dashboard → Your project → **Settings** → **Environment Variables**.
2. Add:

| Name                         | Value                    | Environment   |
|-----------------------------|--------------------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL`  | `https://….supabase.co`  | All           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key         | All           |

3. (Optional) If you use a custom domain for metadata/OG:

   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`  
   Use this in Production (and Preview if you want same OG on previews).

4. Save. Redeploy so the new env vars are applied.

---

## 4. Deploy to Vercel

### Option A: Git integration (recommended)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Framework: **Next.js** (auto-detected).
4. Add the environment variables (see §3.2).
5. Deploy. Production URL will be `https://your-project.vercel.app`.

Subsequent pushes to the main branch trigger production deploys; other branches get preview URLs.

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

When prompted, link to an existing project or create one. Add env vars in the dashboard (or `vercel env add`).

---

## 5. Post-Deploy Checks

1. **Homepage**  
   - Loads without errors.  
   - Hero, pain points, features, how it works, testimonials, form, FAQ all visible.

2. **Form**  
   - Submit with First name + Email.  
   - Check Supabase **Table Editor** → `early_access_leads`: new row with `first_name`, `email`, `created_at`.  
   - Submit again with same email: friendly “already on the list” message (no duplicate row).

3. **Mobile**  
   - Sticky bottom CTA appears on small viewports.  
   - Form and buttons are usable (large tap targets, readable text).

4. **SEO / OG**  
   - View source or use [opengraph.xyz](https://www.opengraph.xyz/):  
     - `<title>`, `<meta name="description">`,  
     - `og:title`, `og:description`, `og:type`,  
     - Twitter card tags.

---

## 6. Custom Domain (optional)

1. Vercel project → **Settings** → **Domains**.
2. Add your domain and follow DNS instructions (A/CNAME).
3. Set `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com` for correct OG URLs.

---

## 7. Performance

- Images: use Next.js `Image` and optimize assets if you add real screenshots.
- Lazy loading: sections and below-the-fold content are normal DOM; consider lazy-loading heavy components if you add them.
- Aim for Lighthouse Performance 90+ (minimal JS, Tailwind purged, no large images).

---

## 8. Security

- **Supabase:** Only the **anon** key is in the frontend/Next.js env. Never expose the **service_role** key in the browser or in client-side code.
- **API route:** `/api/lead` validates required fields and email format; duplicate emails return 409 with a clear message.
- **RLS:** Keeps table readable only by service_role; public can only insert.

---

## 9. Troubleshooting

| Issue | What to check |
|-------|----------------|
| Form submit fails (500) | Env vars set in Vercel (and redeploy). Supabase URL and anon key correct. |
| “Server configuration error” | `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. |
| Duplicate email error | Expected. Message: “This email is already on the list.” |
| No row in Supabase | RLS policies: anon must have INSERT on `early_access_leads`. Re-run migration if needed. |
| Build fails | Run `npm run build` locally; fix TypeScript/ESLint errors. |

---

## 10. Summary

1. Create Supabase project and run `001_early_access_leads.sql`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel (and in `.env.local` for local dev).
3. Deploy via Git or Vercel CLI.
4. Test form submission and confirm rows in `early_access_leads`.
5. (Optional) Add custom domain and `NEXT_PUBLIC_SITE_URL`.

After that, the site is ready for production use and lead capture.
