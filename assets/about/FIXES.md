# About page — fix log

## 1. Mobile nav overflow (real bug, sitewide)
Nav bar (`Resources` / `Sign in` / `Book a demo` + dropdowns) didn't wrap on
narrow screens, forcing the whole site 718px wide against a 390px viewport —
horizontal scroll on every page, not just About.

**Fix:** below 860px, hide the dropdown links and the `Resources`/`Sign in`
ghost links, keep just the logo + primary CTA. Added `overflow-x: hidden` on
`html, body` as a backstop. File: `hero.html`, nav CSS + new mobile media
query near the end of the `<style>` block.

## 2. Neurex-style sizing pass (About page only, no copy/structure changes)
Pulled Neurex's real CSS (`neurex.webflow.shared.f2d237e70.css`) and read the
actual `:root` typography tokens instead of guessing — sizes only, our own
font-family/weights kept as-is:

| Neurex token | Neurex px (desktop / ≥1440) | Applied to our About page as |
|---|---|---|
| `heading-01` (hero h1) | 64px / line-height 72px | Hero `h1`: `clamp(40px, 2.5vw + 28px, 64px)`, line-height 1.125 |
| `heading-02` (section h2) | 56px / line-height 64px | Every section `h2` (story, logos, platform, team, drives, get-started): `clamp(34px, 2.3vw + 23px, 56px)`, line-height 1.14 |
| `heading-05` (card sub-heading) | 28px / line-height 36px | Card `h3` (platform cards, Mission/Vision/North Star): `clamp(20px, 0.85vw + 16px, 28px)`, line-height 1.28 |
| `body-01` (paragraph) | 18px / line-height 28px | Section intro/body paragraphs: `clamp(16px, 0.5vw + 13.5px, 18px)`, line-height 1.55 |
| `body-2` (list/label text) | 16px / line-height 24px | Checklist items, stat labels, contact items, get-started bullets: `16px` |

Clamp formulas are fit to Neurex's own responsive breakpoints (1440 desktop
down to their 478px min), so the scale steps down the same way on resize.

Also from round 1 (kept):
- Buttons: `border-radius: 999px` (pill), `15px 30px` padding, scoped to
  `#page-about` only.
- Section vertical padding bumped to 140px (story/logos/platform/team/drives/get-started),
  72px (stats) — matches Neurex's own spacing tokens (`padding-100` to `gap-120`+ range).
- Card padding 32→48px (platform cards), 32→40px (drives cards).
- "Meet the people behind RuleProof." h2 container widened (380→620px) so it
  wraps 2 lines instead of 3 at the new larger size.

## 3. Chromatic aberration / RGB fringing on bold white text (real bug)
Bold white headings and body text on the navy sections (worst on "Meet the
people behind RuleProof.") rendered with visible red/cyan color fringing on
the letter edges in the user's real Chrome/Windows browser.

**Root cause:** Windows Chrome uses ClearType subpixel font rendering by
default. Bold/heavy-weight white text on saturated dark backgrounds is the
classic trigger for visible RGB channel separation at the glyph edges. This
is invisible in headless Chrome (used for all dev-loop screenshots in this
session) because headless Chrome renders fonts in software mode, which
doesn't reproduce ClearType at all — every "looks fine" screenshot during
dev was blind to this specific bug class. Confirmed and fixed only via the
user's real-browser screenshots.

**Fix:** force text onto its own GPU-composited layer, which makes Chrome
switch from subpixel ClearType AA to grayscale AA:
```css
transform: translateZ(0);
backface-visibility: hidden;
will-change: transform;
filter: drop-shadow(0 0 0 rgba(0,0,0,0)); /* no-op filter, forces rasterization */
isolation: isolate;
```
Plus `-moz-osx-font-smoothing: grayscale` and `text-rendering: optimizeLegibility`
for other engines.

- First attempt scoped this to `#page-about h1,h2,h3` only — fixed the
  headings but missed all `<p>` text (still fringed).
- Second attempt applied it to `body` — fixed everything, but broke the
  sticky nav (`position: sticky` breaks when any ancestor has a `transform`
  other than `none`, since the transformed ancestor becomes sticky's
  containing block instead of the viewport).
- **Final fix:** moved the layer-promotion properties to `.page.active`
  instead of `body`. `.page` elements are siblings of `<nav>` (not
  ancestors), so this fixes rendering for all page content without ever
  touching nav's containing block. `body` keeps only the safe properties
  (`-webkit/-moz-font-smoothing`, `text-rendering`).

**Bonus finding (not yet fixed, flagged to user):** nav's `position: sticky`
was already broken independently of this — `overflow-x: hidden` on `html,
body` (added in fix #1 above) also breaks sticky positioning on any
descendant. Nav currently scrolls away instead of staying pinned. Separate
issue, pre-dates this fix, not yet resolved.

## 4. Inconsistent intro-paragraph widths across sections
Platform/Team/Drives section intro paragraphs (the text under each H2) had
three different `max-width` values — 720px / 560px / 780px — despite using
the identical font-size/role. Team's narrower 560px made its paragraph wrap
to 3 cramped lines while the others wrapped to 2, reading as inconsistent
between sections.

**Fix:** standardized all three to `max-width: 720px`.

## 5. Team cards — redesigned from hover-popover to width-swap
Replaced the old interaction (hover reveals a white info panel that pops out
*beside* the photo card, absolutely positioned, overlapping the neighbor
card and making it hard to hover) with a proper complementary width-swap:
one card is always "open" (photo on the left ~42%, white info panel with
name/title/bio/tags/LinkedIn on the right ~58%, plus an × that jumps to the
other person), the other is "closed" (just the photo, full width, with the
name/title/LinkedIn badge overlaid at the bottom and a "›" affordance in the
corner). Hovering (or clicking) the closed card's photo or its "›" opens it
and retracts the other — open width + closed width always equal the fixed
1160px row width, so nothing overlaps and nothing is absolutely positioned
outside the row. Auto-cycles every 3.2s starting on Ivona, pauses for 4s
after any manual hover/click/focus, same as before.

**Real bug found during verification (not visible without checking exact
geometry, not just "does the page scroll"):** first pass split the row with
percentage `flex-basis` (34% / 66%). Percentage `flex-basis` resolves
against the flex container's full width, not against (width − gaps), so the
two cards' basis summed to 100% of 1160px *plus* the 24px gap on top —
about 24px too wide. This didn't show up as a visible scrollbar bug because
the sitewide `overflow-x: hidden` backstop (fix #1) silently clipped the
overflow instead of showing it, so it would have shipped invisibly.

**Fix:** switched from percentage `flex-basis` to `flex: 34 1 0px` /
`flex-grow: 66` on `.about-team-card`. Flex-grow distributes only the
space left over *after* gaps are subtracted, so the two cards now sum
exactly to the row width regardless of gap size. Confirmed via Puppeteer
geometry check (card edges now land exactly on the row's left/right
bounds) plus a 12-width overflow sweep (390px–1920px), all clean.

## Not touched
Copy, section order, images, brand colors (navy stays `#151433`, not Neurex's
navy/yellow), layout structure, font-family/weights.
