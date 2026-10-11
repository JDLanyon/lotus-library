# TODO: Serve Storybook at jdlanyon.dev/lotus-library

> Copy-paste prompt for a future session (once lotus-library is public on `main`
> and 0.2.0 is released). This is the **jdlanyon.dev** repo work, not the library.

## Context

- The library repo `@jdlanyon/lotus-library` ships a static Storybook in
  `storybook-static/`.
- That build supports a subpath base via `STORYBOOK_BASE_PATH`:
  `STORYBOOK_BASE_PATH=/lotus-library npm run build-storybook` emits assets under
  `/lotus-library/assets/...` (relative manager paths resolve correctly).
- `jdlanyon.dev` is deployed by linking Cloudflare to the **jdlanyon.dev
  repository** (a VitePress site). We want the Storybook served at
  `https://jdlanyon.dev/lotus-library/` by riding that existing deploy — no new
  Cloudflare project, no subdomain.

## Prompt

"""
Integrate the lotus-library Storybook into the jdlanyon.dev site so it is served
at https://jdlanyon.dev/lotus-library/ via the existing Cloudflare Pages deploy
of this repo (VitePress). Do NOT create a new Cloudflare project or subdomain.

Steps:
1. Add a build step that clones/checks out `@jdlanyon/lotus-library` (the public
   GitHub repo), installs it, and builds its static Storybook with the subpath
   base: `STORYBOOK_BASE_PATH=/lotus-library npm run build-storybook`.
2. Copy the resulting `storybook-static/` output into the VitePress public dir
   so it is served verbatim at `/lotus-library/`:
   `docs/public/lotus-library/` (adjust to this repo's actual VitePress root).
3. Ensure these are NOT treated as VitePress pages (they are prebuilt static
   assets — no markdown processing, no client router). Confirm `docs/public` is
   the passthrough dir and that the copied files land at the site root under
   `/lotus-library/`.
4. Wire it into the Cloudflare Pages build command (or a prebuild npm script) so
   the copy happens on every deploy, before `vitepress build`.
5. Verify locally: build, then run the preview server and open
   `/lotus-library/` — the Storybook index must load and its assets must resolve
   from `/lotus-library/assets/...` (no 404s in the console).
6. Add `.gitignore` entries for the copied `docs/public/lotus-library/` build
   output so it is generated, not committed.
7. Do not touch the library repo — this is purely the jdlanyon.dev deploy.

Acceptance: https://jdlanyon.dev/lotus-library/ serves the Storybook with no
console 404s, and the rest of the VitePress site (including client-side routing)
is unaffected.
"""

## Notes / gotchas

- VitePress router is history/hash based; Storybook's manager is hash-based, so
  they coexist. Keep Storybook fully static (no SSR).
- If the VitePress build runs a markdown/link checker, exclude
  `docs/public/lotus-library/**`.
- Confirm the Cloudflare build image has network access to clone the public
  library repo (or vendor it as a prebuilt artifact / npm dependency).
- The README of the library already links to https://jdlanyon.dev/lotus-library/
  (currently not public — fine for now).
