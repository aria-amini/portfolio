# portfolio

This is a Vite + Tanstack Start + React + Tailwind project for Aria Amini's
portfolio site.

## Using Vite+, the Unified Toolchain for the Web

This project uses Vite+, a unified toolchain built on top of Vite, Rolldown,
Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management,
package management, and frontend tooling in a single global CLI called `vp`.
Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and
`vp build`. Run `vp help` to print a list of commands and `vp <command> --help`
for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at:
[https://viteplus.dev/guide/]

### Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts
      necessary for validation, run via `vp run <script>`.

## Template

This repo follows `~/templates/tanstack` (Copier). It uses the template tooling,
lint, `src/components/ui` (shadcn `base-vega`, Base UI), and theme code. It does
not use the template database, auth, S3, or Docker parts.

## Local development

Run `mise run bootstrap` for each checkout or workspace. It installs
dependencies, registers the Pitchfork proxy URL, starts the dev daemon, and
verifies the page. The root checkout uses `https://portfolio.dev.ariaamini.com`.
Other checkouts use `https://portfolio-<checkout-name>.dev.ariaamini.com`.

## Style rules

- Build `className` with `cn()` from `cn`. Never use template literals.
- Take every color from theme tokens in `src/styles.css`. Do not use raw colors.
- Use `ButtonLink` or `RouterButtonLink` for links that look like buttons. Base
  UI `Button` with `nativeButton={false}` sets `role="button"` on anchors.
- Run `vp check` and `vp test run` before every commit.
