# ui.plan.ai · setup

Two tiers: **dev** is free (no accounts, no secrets — the app reads from local fixtures). **Production** requires Supabase, Cloudflare Images, Cloudflare Stream, and Cloudflare Pages.

Skip to [Production](#production) if you already have the project running locally.

## Dev (zero-backend)

```bash
pnpm install      # once
pnpm dev          # app on :4321, docs on :4322
```

Open <http://localhost:4321>. A small `MOCK BACKEND` badge sits in the corner — this is intentional and goes away once `PUBLIC_USE_MOCK_BACKEND=false` is set.

All five demo frames live in [`src/lib/fixtures/index.ts`](src/lib/fixtures/index.ts). Edit them and the home, public stream, and workbench preview routes all reflect the change.

## Production

You'll need accounts on Supabase and Cloudflare, and a deploy target on Cloudflare Pages. Order matters: Supabase first (data + auth), Cloudflare Images + Stream next (media), Pages last (it consumes the env vars from the prior two).

### 1. Supabase

1. Create a new project at <https://supabase.com>. Pick a region close to your team.
2. Capture three values from **Project settings → API**:
   - Project URL → `SUPABASE_URL`
   - `anon public` key → `PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (never expose this client-side)
3. Open **SQL Editor**. Run the schema from [`/docs/specifications/supabase-sql/`](https://ui.plan.ai/docs/specifications/supabase-sql/) in order. Verify the enums, tables, and RLS policies are created.
4. **Auth**: under **Authentication → Providers**, enable the providers your team uses (email + at least one OAuth provider is the typical V1 posture). Magic-link via email is the lightest. Configure **Site URL** and **Redirect URLs** for the deployed domain.
5. **RLS**: confirm row-level security is on for every table the SQL file declares. The policies in the SQL file enforce the tenant/agent/channel scoping documented in [`/docs/v1-plan/auth-and-sessions/`](https://ui.plan.ai/docs/v1-plan/auth-and-sessions/).

### 2. Cloudflare Images

1. Enable Cloudflare Images on your account (requires the paid plan or the Images add-on).
2. **My Profile → API Tokens → Create Token**: scope it to `Account.Cloudflare Images: Edit`. Save as `CLOUDFLARE_IMAGES_API_TOKEN`.
3. Capture your **Account ID** (right sidebar of any Cloudflare dashboard page) → `CLOUDFLARE_ACCOUNT_ID`.
4. Note your delivery prefix — `https://imagedelivery.net/<account-hash>` → `PUBLIC_CLOUDFLARE_IMAGES_URL_PREFIX`.
5. Define the **variants** referenced by your `project-config.v1.json` (see step 4). At minimum: a `thumbnail` and a `public` variant.

### 3. Cloudflare Stream

1. Enable Stream on the same account.
2. New API Token scoped to `Account.Stream: Edit` → `CLOUDFLARE_STREAM_API_TOKEN`.
3. Customer **subdomain** (e.g. `customer-abcdef1234.cloudflarestream.com`) → `PUBLIC_CLOUDFLARE_STREAM_SUBDOMAIN` (just the `customer-...` part).

### 4. Project config

`project-config.v1.json` carries per-project media limits and Cloudflare Images variant names. The schema is at [`/docs/specs/schemas/project-config.v1.schema.json`](https://ui.plan.ai/docs/specs/schemas/project-config.v1.schema.json).

Host it where your server can fetch it (CF R2, a private GitHub gist, or any static URL) and set `PROJECT_CONFIG_URL` to that location. Keep it out of the repo — it's per-deployment config, not source.

### 5. Cloudflare Pages

1. Connect this repo to a new Pages project. Production branch: `main`. Build command: `pnpm build`. Output directory: `dist`.
2. Under **Settings → Environment variables**, add every variable from [`.env.example`](.env.example) **except** `PUBLIC_USE_MOCK_BACKEND` (set that explicitly to `false`). Mark service-role and API tokens as **Encrypted**.
3. Trigger a deploy. Verify the `MOCK BACKEND` badge is gone and `/<your-test-agent>/<yyyymmdd>/` renders real data.

### 6. First API key (from the workbench)

Once Pages is live:

1. Sign in to `/workbench/` with a Supabase Auth account whose `tenant_members.role` is `owner` or `admin`.
2. Create your first agent and channel from the workbench (you'll seed these in Supabase manually until the workbench CRUD ships).
3. Generate an Agent API key scoped to that agent. Copy the raw value once — only the hash is stored.
4. Smoke-test the contract:

   ```bash
   curl https://api.ui.plan.ai/v1/frame-submissions \
     -H "Authorization: Bearer $PLANAI_AGENT_API_KEY" \
     -H "Idempotency-Key: $(uuidgen)" \
     -F 'metadata=@metadata.json;type=application/json' \
     -F 'image=@frame.png;type=image/png'
   ```

## External checklist

| | Task |
|---|---|
| ☐ | Supabase project created |
| ☐ | SQL schema executed; tables + enums + RLS verified |
| ☐ | Supabase Auth providers enabled; Site URL + redirects configured |
| ☐ | Cloudflare Images enabled; API token issued; variants defined |
| ☐ | Cloudflare Stream enabled; API token issued; subdomain noted |
| ☐ | `project-config.v1.json` authored and hosted |
| ☐ | Cloudflare Pages project connected; env vars set; encrypted where required |
| ☐ | First deploy succeeded; `MOCK BACKEND` badge gone |
| ☐ | First tenant/agent/channel seeded in Supabase |
| ☐ | First Agent API key issued; curl smoke-test passed |

## Where things live

| Concern | Source |
|---|---|
| API contract | [`/docs/api-reference/`](https://ui.plan.ai/docs/api-reference/) + [`starlight/public/specs/v1-agent-api.openapi.yaml`](starlight/public/specs/v1-agent-api.openapi.yaml) |
| Data model + SQL | [`/docs/specifications/data-model/`](https://ui.plan.ai/docs/specifications/data-model/) + [`/docs/specifications/supabase-sql/`](https://ui.plan.ai/docs/specifications/supabase-sql/) |
| Routing + tenancy | [`/docs/v1-plan/routing-and-tenancy/`](https://ui.plan.ai/docs/v1-plan/routing-and-tenancy/) |
| Auth model | [`/docs/v1-plan/auth-and-sessions/`](https://ui.plan.ai/docs/v1-plan/auth-and-sessions/) |
| Approval policy | [`/docs/v1-plan/approval-and-api-keys/`](https://ui.plan.ai/docs/v1-plan/approval-and-api-keys/) |
| Media + delivery | [`/docs/v1-plan/media-and-delivery/`](https://ui.plan.ai/docs/v1-plan/media-and-delivery/) |
| Mock fixtures | [`src/lib/fixtures/index.ts`](src/lib/fixtures/index.ts) |
| Backend toggle | [`src/lib/env.ts`](src/lib/env.ts) + `PUBLIC_USE_MOCK_BACKEND` |
| Pluggable client | [`src/lib/client.ts`](src/lib/client.ts) (live path throws until wired) |
