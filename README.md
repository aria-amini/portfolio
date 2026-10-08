# Portfolio

Aria Amini's portfolio uses TanStack Start, React, Tailwind CSS, and Vite+. The
project setup follows `~/templates/tanstack`.

## Development

```sh
vp install
vp dev
```

Use `pitchfork start dev` to run the development server as a daemon. The default
server URL is `http://127.0.0.1:3000`.

## Environment

Varlock validates `.env.schema` and generates `env.d.ts`. Keep local values in
`.env.local` or the existing `.env` file. Set `MAILGUN_API_KEY` and
`MAILGUN_DOMAIN` to enable the contact form. Set `VITE_PUBLIC_POSTHOG_KEY` to
enable production analytics.

```sh
vp exec varlock load --agent
```

## Validation

```sh
vp check
vp test run
vp run build
```

Vitest runs unit tests and browser tests. Browser tests use Playwright to launch
full Chromium. Screenshot assertions use Vitest Browser Mode. Reserve Playwright
e2e tests for smoke checks. With the server active, run `vp run e2e` for desktop
and mobile smoke checks.

Install the browser with `vp exec playwright install chromium --no-shell`. For
Ubuntu 26.04 ARM64, set `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-arm64`
for browser installation and test commands. To use an existing Chromium binary,
set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Production

```sh
vp run build
vp run start
```

The production server uses `.output/server/index.mjs`. Railway runs the same
start command with Varlock.
