# HANDOVER.md — 0.2.0 multi-repo coordination

> **For the agent (me) and Jackson.** This file is the single source of truth
> for the 0.2.0 release across three repos. Read it first after any context
> reset. Update the checklist as work lands.

Last updated: (initial)

## Goal

Ship **0.2.0** of `@jdlanyon/lotus-library` and migrate three consumer repos to
it, then merge everything to `main`/production. Registry stays **GitHub Packages
(restricted)** — NOT public npm (far-future). Install stays via **`file:` tarball**
for now.

## Repos (absolute paths)

| Repo | Path | Branch | Role |
|------|------|--------|------|
| Library | `/mnt/dev/git/lotus-library` | `dev` → `main` | Owner. @jdlanyon/lotus-library |
| SausyTime | `/mnt/dev/git/sausytime.com` | `main` (uncommitted!) → `dev` | Next.js + next-themes |
| JDLanyon.dev | `/mnt/dev/git/jdlanyon.dev` | `dev` | VitePress/Vue SSR |
| Arana United | `/mnt/dev/git/arana-united` | `main` | **OUT OF SCOPE** (next wave) |

Note: `/mnt/dev/git/lotus-library-test` is an old scratch consumer (pins 0.1.1) — ignore.

## Install convention (canonical relative path)

From a consumer in `/mnt/dev/git/<site>`:
```
npm i /mnt/dev/git/lotus-library/jdlanyon-lotus-library-<ver>.tgz
```
Relative form: `../lotus-library/jdlanyon-lotus-library-<ver>.tgz` ONLY if the
consumer is a sibling under `/mnt/dev/git/`. Both sites ARE siblings, so
`../lotus-library/...` is correct for them. (The sausy agent wrongly thought
the path was broken; it is not — they're siblings.)

## Versioning

- **No 0.1.8.** Fold ALL outstanding changes into **0.2.0**.
- 0.1.7 already committed on `dev` (this session): vue-simple-icons fix,
  glitch wrappers, LotusIcon dedupe. 0.2.0 = 0.1.7 + CardPanel work + docs +
  storybook + consumer-driven API (thumbnail/span/aspect, CardGrid mosaic).
- 0.2.0 bump happens at the **merge-to-main** stage.

## Decisions locked by Jackson

1. **Card vs Panel**: conceptually the SAME primitive (a large clickable
   surface; click opens modal or page). Goal: **unify/clean** them and document
   clearly. Card = text/image/tags + (future) 3-D hover, square-ish. Panel =
   large "fancy div". Button = small low-word text. Low-priority: the 3-D hover.
   → Provide a clear README section + shared internals. DO NOT break existing
   Panel/PanelGrid API. **For 0.2.0: keep both names/APIs, share
   `resolveThumbnail` + media CSS, document when to use which.** No hard merge.
2. **README** for humans AND LLMs (documented, example-driven).
3. **Storybook previewable at 0.2.0→main** — DEFERRED to next wave (with repo
   going public on 0.2.x). For now: ensure Storybook *builds locally*.
4. Registry = GitHub Packages. No npm.
5. No agents — the library agent edits all three repos directly.
6. **LAYOUT IS THE HOST'S JOB (locked).** Option A chosen: `CardGrid` is a
   thin convenience (map items → Cards + own ONE shared modal). The library
   ships **NO** mosaic/span/layout engine. `span`/`rowSpan` props REMOVED.
   `aspect` kept (media concern, not layout). Grid CSS = one sane default,
   host overrides via className.

## Answers to the consumer agents' blocking questions (authoritative)

These are routed from sausytime.com + jdlanyon.dev. Answer inline here so hosts
can delete shims. (Filled in below as we implement.)

### themeController (sausy Q2)
- Supported shape: `<LotusNextProvider themeController={{ theme, setTheme }}>`.
  It is the ONLY supported bridge; no separate `<LotusThemeProvider>` needed.
- `data-theme`: next-themes owns the attribute; the library READS theme state,
  it does NOT write `data-theme`. Host keeps next-themes as source of truth.
- Status: **supported** (verify end-to-end on 0.2.0).

### Font token precedence (sausy Q3)
- Implementation: `body { font-family: var(--lotus-font-sans) }` with
  `--lotus-font-sans` defaulting to Poppins-first stack; components carry
  `font-family: inherit` (theme.css). So:
  - Token set on :root → wins.
  - Token unset → Poppins default (library does NOT fall back to host body font,
    because body also declares the token default). NEEDS VERIFICATION + fix:
    desired = components inherit host body font when token unset.
- Status: **needs change** → make unset token inherit host font.

### Nav logo invert (sausy Q4 + jdlanyon)
- `logoInvert={false}` (or `.lotus-nav-logo-img--no-invert`) is the documented
  opt-out for LIGHT host logos. Auto-invert applies ONLY to the bundled asset
  semantics; a host `logoSrc` is inverted too — so hosts with light logos MUST
  pass `logoInvert={false}`. Document this. (Consider: only auto-invert when
  logoSrc is NOT supplied.)
- Status: **supported via opt-out**; refine + document.

### CardGrid in a markdown-driven host (jdlanyon Q5)
- NO `global-link`/`globalLink` prop exists or was planned — ignore; it was an
  error in the host's integration notes.
- Intended path for VitePress: generate `ProjectCardData[]` from frontmatter
  (a wiki-link plugin / data file) and feed `<CardGrid :items="...">`. No portal
  pattern. Host owns data generation; library owns presentation.
- Status: **supported** (host generates items).

### Card as link SSR (jdlanyon Q6)
- `Card` with `href` renders a REAL `<a href>` (verified by SSR smoke test),
  not a click-only div. When `href` set, NO onClick preventDefault is attached.
  Default link = native `<a>` → VitePress SPA interception works.
- Status: **supported** (verified).

### Edge-safe markdown modal (sausy Q7)
- Library does NOT ship a markdown renderer. `ProjectModal` fetches pre-built
  HTML and injects it (no MD at runtime) → edge-safe. Host's local
  react-markdown modal is THEIR concern; not planned in library.
- Status: **not supported / not planned**.

### Thumbnail + mosaic (jdlanyon Card/CardGrid ask)
- 0.2.0 adds to Card: `thumbnail`, `thumbnailPath`, `thumbnailDefaultsId`,
  `defaultThumbnail`, `#media` slot, `span`, `rowSpan`, `aspect`.
- CardGrid: `layout: 'grid'|'columns'`, `minColumnWidth`; forwards the above.
- ProjectCardData gains thumbnail/span/aspect/category.
- Status: **to implement in 0.2.0**.

## WORK CHECKLIST (update me)

### Library `dev` → `main` (0.2.0)
- [x] vue-simple-icons import fix
- [x] GlitchText/GlitchImage Vue wrappers
- [x] Card size/fill/href/linkComponent
- [x] CardGrid (thin: items + shared ProjectModal; no layout engine)
- [x] Button SSR recursion fix
- [x] ProjectRenderer `:is` fix + ProjectSections.vue
- [x] LotusIcon double-registration fix
- [x] Font token: default `inherit` via `var(--lotus-font-sans, inherit)` — host font always wins unless host sets the token. VERIFIED.
- [x] Card: thumbnail/thumbnailPath/thumbnailDefaultsId/defaultThumbnail/thumbnailAlt/adapterImage/aspect + `#media` slot (Vue) / `renderMedia` (React)
- [x] CardGrid: forward media props; NO layout props (removed)
- [x] ProjectCardData: thumbnail/aspect/category
- [x] `resolveThumbnail` extracted to core/utils (shared by Card + Panel, both frameworks)
- [x] span/rowSpan removed (layout = host)
- [x] **lucide version drift fixed**: pinned `lucide-react`/`lucide-vue-next` to `>=0.400 <1` (peer) + `^0.475.0` (dev). `1.x` removed brand icons (`Linkedin`), which broke the Storybook build. `0.475` has all glyphs we use (Menu/X/Circle/Moon/SunMoon/Linkedin).
- [x] **Storybook builds** (exit 0) — `lucide-react` + `@icons-pack/react-simple-icons` installed as devDeps so the React preview bundles.
- [x] README rewrite: intro, components table, Component model, Conventions (LLM), Layout-is-host, Cards & grids, Adapters, Fonts (inherit), logo invert
- [ ] Storybook story for Card/CardGrid media
- [ ] Verify all gates (typecheck/test/lint/build) green
- [ ] Commit `dev`
- [ ] Bump 0.2.0, merge to `main`

### SausyTime `dev` → `main`
- [x] New tarball install (0.2.0 when ready)
- [ ] Replace theme_bridge.tsx with themeController in layout
- [ ] Set --lotus-font-sans; verify inheritance
- [ ] Remove local logo invert rule
- [ ] Dead-code audit
- [ ] Build green, commit, merge

### JDLanyon.dev `dev` → `main`
- [ ] Register <Button> bare name (recursion fixed)
- [ ] Delete BlogCard.vue (use <Card href>)
- [ ] Delete ProjectCard.vue (use <CardGrid> or markdown path)
- [ ] Wiki-link plugin emits CardGrid items from frontmatter
- [ ] Build green, commit, merge

## Open risks
- Storybook on GH Pages for a private repo requires Pages on the repo; may need
  a public Pages branch or skip. Investigate; fall back to local build.
- `publishConfig` stays GitHub Packages (correct).
- No `.npmrc`/token yet — only needed when actually publishing, not for `main`.
