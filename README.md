# Portfolio

Aria Amini's portfolio uses Astro, React islands, Tailwind CSS, and Vite+. The
project setup derives from `~/toolkit/templates/astro` (Copier). Astro owns the
page, metadata, routes, and Node server. React hydrates the clock, clipboard
action, and dialogs.

## Development

```sh
mise run bootstrap
```

Bootstrap installs tools and packages, registers the workspace URL, starts the
daemon, and verifies the portfolio page. Add `--verbose` for direct command
output.

Use `pitchfork start dev` to run the development server as a daemon. Pitchfork
assigns a port from 3000 and checks that same port for readiness. To select a
port, run `pitchfork start dev --expected-port 3001`. For standalone
`vp run dev`, use `APP_PORT` to select the port.

## Environment

Varlock validates `.env.schema` and generates `env.d.ts`. Keep local values in
`.env.local` or the existing `.env` file. Set `VITE_PUBLIC_POSTHOG_KEY` to
enable production analytics. The server proxies PostHog requests from
`/api/ingest` to PostHog, so ad blockers do not drop them.

```sh
vp exec varlock load --agent
```

## Validation

```sh
vp run check
vp test run
vp run e2e
vp run build
```

Vitest runs proxy unit tests and the dither browser test. Playwright checks
Astro's production server in Chromium and mobile WebKit, including screenshots,
booking redirects, dialog history, keyboard focus, and HTML without JavaScript.
Without `BASE_URL`, it builds and starts the Node server on port 4321. Set
`BASE_URL` to test an existing development server or deployment.

Install browsers with
`vp exec playwright install chromium webkit --with-deps --no-shell`. The
safe-area suite injects portrait and landscape insets, then captures the
scrolled page and the full resume viewport. Headless WebKit does not include the
iPhone's Safari bars. Verify those bars on a physical iPhone after changes to
viewport sizing or fixed elements.

If a Nix shell overrides `XDG_DATA_DIRS`, run Linux tests with
`GSETTINGS_SCHEMA_DIR=/usr/share/glib-2.0/schemas`. WebKit needs those desktop
schemas. To use an existing Chromium binary, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Production

```sh
vp run build
vp run preview
```

`vp run preview` serves the build in workerd, the Cloudflare Workers runtime.
`vp run deploy` builds the site and deploys the Worker with `varlock-wrangler`.
Static files come from `dist/client`. The Worker only serves `/api/ingest`.
Workers Builds deploys `main` with `npx varlock-wrangler deploy` and builds PR
branches with `npx varlock-wrangler preview`. CI runs the e2e suite against a
local workerd build.

## Agent setup

Import the Bootstrap action from `t3.json` in T3's project Actions settings. Its
`async: false` setting holds the agent until bootstrap exits for a new worktree.
Herdr uses the setup command in `.herdr.toml`.

The migration rendered the Toolkit template with `template=astro`,
`astro_output=node`, `react=true`, and `site_url=https://www.ariaamini.dev`.
`.copier-answers.yml` records the template revision. The portfolio retains its
own theme, content, resume build, tests, and PostHog proxy.
