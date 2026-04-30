# Handoff: Hot Desking App (DeskHub)

## Overview

A hot desking application for hybrid workplaces, covering four user groups:
- **Employees** — discover, book, navigate to and check in to desks (mobile-first)
- **Visitors** — lightweight, no-app guest pass with QR check-in
- **Facilities managers** — floor-plan editor + utilisation dashboard (desktop)
- **IT / Workplace admins** — booking policies, RBAC, integrations (desktop)

The full functional brief lives in the project's `hot-desking-design.md` — covers personas, flows, tech architecture, data model, NFRs, and integrations. This handoff is purely the **visual design** layer.

## About the Design Files

The HTML/JSX files in this bundle are **design references**, not production code. They were authored as a clickable, pixel-accurate prototype using inline React + Babel so the design could be reviewed in a browser without a build step.

**Your job is to recreate these designs in the target codebase using its existing patterns** — React + Next.js for web, React Native for mobile (per the design doc). Do **not** copy these files verbatim. Use them as the source of truth for visual decisions: layout, color, type, spacing, component structure, copy, interaction states.

If no codebase exists yet, the design doc recommends:
- **Web (admin)**: React + Next.js (TypeScript), Radix + Tailwind, TanStack Query, Zustand
- **Mobile (employee/visitor)**: React Native (Expo)

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, and component states are all decided. Recreate pixel-accurately within the codebase's established libraries.

## Screens / Views

10 screens across 4 sections.

### Mobile · Employee (iOS, 390×844 logical / inside iOS frame)

#### 1. Home / Today (`Screen_Home`)
- **Purpose**: Glanceable answer to "do I have a desk today, where, am I checked in?"
- **Layout** (top to bottom):
  - Header row: greeting "Wednesday, 30 April" + "Hi, Maya" (Source Serif 26px/700) + 40px circular avatar with initials
  - Hero today card: navy (#0A2A4E) background, 20px radius, 18px padding, with a soft gold radial glow top-right. Eyebrow "TODAY · CHECKED IN" in gold-400, then "Desk 207, Floor 2" (Source Serif 28px/700 white), meta row with pin icon "General · near window · until 17:30". Two CTAs: gold "Navigate" (primary) + ghost "End early"
  - Section header "UPCOMING" + "See all" link
  - Two booking cards (white, 14px radius, 1px border on `--csb-line`): icon box + date + sub + recurring/chevron pill
  - Section header "QUICK ACTIONS"
  - 2×2 grid of quick-action cards (Book a desk, Find my team, Repeat usual, Invite guest)
  - Bottom tab bar (4 tabs: Today, Book, Map, Me)

#### 2. Pick a date (`Screen_Calendar`)
- Back button + title "Book a desk" + sub "Pick a date — Floor 2, Atrium"
- Month controls "April – May 2026" with chevrons
- 7-column day-of-week labels (uppercase, 10px, letter-spacing 0.08em, ink-500)
- Calendar grid: aspect-square cells, 10px radius, today gets a navy border, selected gets navy fill / white text. Below each in-month cell: a 3px availability heatmap bar — green `#1E8754` (Available), amber `#B4761A` (Limited), red `#B4291F` (Full). Weekends get no bar.
- Legend dots for the three states
- "Selected" summary card with date in Source Serif 20/700, time range in JetBrains Mono, and three columns (From / Until / Repeat)
- Sticky-feeling primary CTA "Choose a desk →"

#### 3. Floor map (`Screen_Map`)
- Header: "Floor 2 · Atrium" + sub + filter button + "List" toggle button (navy fill)
- Legend row: Free (white with teal border), Booked (#D9E0EA fill), Teammate (gold), You (navy)
- Floor plan container (16px radius, height 460px) renders `FloorPlanSVG`
- Bottom sheet docked at bottom of the floor wrap: 20px top-radius, grab handle, eyebrow "GENERAL ZONE", title "D-209 · Available" (Source Serif 22/700), meta line, three amenity pills (Dual monitor, Wi-Fi 6, Window seat), primary CTA "Book D-209 for Thu 7 May"

#### 4. Confirmation (`Screen_Confirm`)
- Centered 64px green-bg circle with check icon
- Title "You're all set" (Source Serif 26/700) + supporting copy
- Booking detail card: gold eyebrow "CONFIRMED" + "Desk 209" + sub, with two-column "When / Building" footer separated by a top border
- Three action cards (Add to calendar / Invite teammates to sit nearby / Make this a recurring booking) — each is icon-box + title + sub + chevron
- Primary "Done" CTA

#### 5. Check-in pass (`Screen_CheckIn`)
- **Dark theme** — full screen on `--csb-navy-900`
- Top row: back button + "BOARDING PASS" eyebrow + download button (all chips on rgba white 0.1)
- Hero: gold eyebrow "TODAY · WED 30 APR" + "Desk 207" (Source Serif 38/700 white) + sub line
- 200px QR card (white, 16px radius, soft shadow) — generated 21×21 cell grid with finder patterns at 3 corners
- Caption "Scan at desk to check in"
- "OR" divider with 1px hairlines
- Two stacked CTAs: gold "I'm here · check me in" + ghost "My desk is taken"
- Footer note about auto check-in via Wi-Fi SSID

### Mobile · Team & visitors

#### 6. Find my team (`Screen_Team`)
- Title "Find my team" + sub "This week · 6 of 8 opted in"
- Horizontal scrollable day chips (Mon–Fri). Selected chip: navy fill, white text. Each chip stacks DOW / day number / "N in"
- Section header "Thursday 30 April · 5 in"
- Team rows (white card, 14px radius): avatar + name + role/floor + right-aligned mono desk ID + "next to you" / "collab zone"
- Tip card with subtle navy-50 bg: "Sit near your team — Free desks within 5m of Sam, Rob, Hana — 4 available"

#### 7. Visitor pass (`Screen_Guest`)
- Header: "Visitor pass" (Source Serif 18/700) + gold pill "Guest · no app"
- "Hosted by" label + "Maya Khan · Design"
- Desk card: gold eyebrow "YOUR DESK" + "G-12" (Source Serif 28/700) + walking directions, with a 2-column footer (Arrival / Wi-Fi) in JetBrains Mono
- 168px QR code
- Two CTAs: secondary "Directions" + primary "Notify host"
- Phone-number footer

### Desktop · Admin (1280×820 viewport)

Shared chrome:
- Left sidebar (240px wide) — `--csb-navy-900` background, gold square brand mark "D" + "DeskHub" + tenant sub. Sectioned nav (small uppercase section labels in white-40, links in white-72 with icons, active state has white-08 bg).
- Main column: white topbar (1px border-bottom on csb-line) with title in Source Serif 22/700 + sub + search input (`#FAFBFD` bg, 280px wide, search icon at 10px) + action buttons.
- Content area: `#FAFBFD` bg, 24/28px padding.
- Panels: white, 12px radius, 1px csb-line border. Panel header has title in Museo Sans 15/600 navy.

#### 8. Utilisation dashboard (`Screen_Dashboard`) — David
- Topbar actions: secondary "Export CSV" + primary "Schedule report"
- 4-up KPI grid: each tile is white panel with label (12px ink-500), Source Serif 32/700 number, then trend with arrow in success/danger color
  - Avg occupancy this week — 64% (+8 pts)
  - Peak occupancy · Wed — 92%
  - No-show rate — 4.1% (−1.2 pts) — down is good here
  - Active bookings · today — 184 of 240 desks
- 2-column row (1.4fr / 1fr):
  - "Daily occupancy" SVG bar chart (600×240 viewBox), 7 days. Each day is a navy bar (booked) overlaid with a slightly-narrower gold bar (checked-in). Y-axis 0–100% in 25% gridlines. Day labels below.
  - "Today, by zone" — 5 progress bars per zone, mono `used/cap` aligned right. Bar color is success/warning/danger by occupancy band. Live pill in header.
- Hourly heatmap panel: 7 zones × 11 hours. Cell color steps through `--csb-navy-100`, `--csb-navy-200`, `--csb-gold-200`, `--csb-gold-400`, `--csb-gold-500`.

#### 9. Floor-plan editor (`Screen_FloorEditor`) — David
- Topbar actions: secondary "Preview" + primary "Publish v4 →"
- Two-column main: canvas (left) + 320px right inspector
- Toolbar above canvas: 5 tool buttons (Select active = navy-50 bg + navy-800 border), divider, "60 desks · 5 zones · 12 amenities", spacer, amber "Unsaved changes" pill with dot
- Canvas: `#FAFBFD` bg with embedded `FloorPlanSVG` in a white card (12px radius)
- Inspector: gold eyebrow "SELECTED" + "Desk D-209" (Source Serif 24/700)
  - Properties section: rows of label / value separated by hairlines (Label, Type, Coordinates, Bookable)
  - Amenities: pill cluster on `--csb-navy-100` + a dashed "+ add" pill
  - Status: 3 segmented buttons (Available active = success-bg + success border)
  - Upcoming bookings: list with date / mono time / user

#### 10. Policies & integrations (`Screen_Policy`) — Priya
- Topbar: primary "Save changes"
- Two-column row:
  - "Booking horizon & limits" panel with 5 rows. Each row: label + sub + right-side value chip (white, 1px border, 130px min-width) or a green toggle for booleans. Rows: Booking horizon / Max active bookings / Cancellation window / No-show grace period / Same-day booking (toggle).
  - "Roles & access" table (6 rows: Org Admin, Site Admin, Floor Admin, Team Lead, Auditor, Employee). Columns: Role / Scope (mono) / Members.
- Full-width "Connected integrations" table: Service / Type / Status (pill: green/amber/gray) / Last sync (mono) / "Configure" link.

## Floor Plan SVG (`FloorPlanSVG`)

Reusable component used in both employee map screen and admin floor-plan editor.

- 480×470 viewBox
- Background: white + 20px grid pattern at `rgba(10,42,78,0.04)`
- Zones: rounded rects with tinted fills (Quiet `#EEF2F8`, Collab `#DFF3F1`, General `#F6F8FB`, Phone `#F3E2EE`, Focus `#FFF8E8`) with uppercase labels
- Amenity rooms: Kitchen / WC / Reception / Lift along the bottom
- Desks: 32px squares (mini phone/focus pods are 22px), 5px radius
  - **free** — white fill, teal `#1FA39B` border
  - **booked** — `#D9E0EA` fill, `#B8C3D3` border
  - **yours** — `#0A2A4E` fill, white "YOU" label
  - **team** — `#E8A93B` fill with white center dot
  - **out of service** — diagonal-stripe pattern
  - **accessible** — small teal dot top-right of free desks
  - **selected** — gold dashed outline at 4px offset

Status data lives in `FLOOR_DATA.desks` as `{ id, x, y, status, zone, accessible?, mini? }`.

## Interactions & Behavior

- **Calendar selection**: tap a date → `selected` index updates → summary card swaps. Disabled weekends.
- **Floor map**: tap a desk → state updates → bottom sheet swaps content. Selected desk gets the gold dashed ring.
- **Booking flow**: Calendar → Map → Confirm → (optional) Check-in. On confirm, optimistic UI marks desk as "claiming" instantly per the design doc.
- **Check-in**: 4 paths per the doc — auto via geofence/Wi-Fi SSID, QR scan, "I'm here" tap, badge tap. The pass screen surfaces all four.
- **Live updates**: WebSocket channel `org:{orgId}:floor:{floorId}:date:{yyyy-mm-dd}` pushes desk status deltas. Reconnect with `last_seq`.
- **Animations**: 120–320ms, `cubic-bezier(0.22, 0.61, 0.36, 1)`. Cards fade + 4–8px translate on enter. No bounces.
- **Hover states**: Buttons lighten by ~6%. Cards step shadow `--sh-2` → `--sh-3`. Links underline thickens 1.5 → 2px.
- **Focus**: 3px outer ring `rgba(74, 144, 226, 0.35)` — never removed.

## Design Tokens

All tokens live in **`design-tokens.css`** (copied into the bundle root). Highlights:

### Colors
- **Navy**: `--csb-navy-900 #061B35`, `--csb-navy-800 #0A2A4E` (primary), `--csb-navy-700 #15406F`, `--csb-navy-50 #F5F8FC`
- **Gold (accent)**: `--csb-gold-700 #B07A1E` (text), `--csb-gold-500 #E8A93B` (UI), `--csb-gold-50 #FFF8E8`
- **Teal** (success/data viz): `--csb-teal-500 #1FA39B`
- **Plum** (specials): `--csb-plum-500 #A14A8F`
- **Ink**: 900 `#0B1524` / 700 `#2B3647` / 500 `#51627A` / 300 `#8A97AC`
- **Lines**: `--csb-line #D9E0EA`, `--csb-line-strong #B8C3D3`
- **Semantic**: success `#1E8754`, warning `#B4761A`, danger `#B4291F`

### Typography
- **Display / headlines**: Source Serif 4 (Google Fonts). Used for H1, H2, hero numbers, key product copy.
- **UI / body**: Museo Sans 500 (self-hosted in `fonts/`). 400/500/600 → regular master; 700/800/900 → bold master.
- **Mono / data**: JetBrains Mono. Desk IDs, times, references.
- **Body min**: 16px. Caption min: 13px. Hero rates: 64–80px.
- **Numerals**: `font-variant-numeric: lining-nums tabular-nums` on rates, IDs, stats.

### Spacing
4px base. Tokens `--space-1` (4) through `--space-24` (96). Section padding desktop 64–96px, mobile 40–56px.

### Radii
xs 4 / sm 6 / md 10 / lg 16 / xl 24 / pill 999. Buttons sm. Cards lg. Modals xl.

### Shadows
Four-step navy-tinted system (`--sh-1` … `--sh-4`) — see tokens file.

### Motion
`--ease-out: cubic-bezier(0.22, 0.61, 0.36, 1)`. Durations 120 / 200 / 320 / 480ms.

### Layout
Container 1200px max. Narrow prose 820px. Nav height 72px.

## Assets

Bundle includes:
- `design-tokens.css` — full token sheet (colors, type, spacing, radii, shadows, motion)
- `app-styles.css` — app-specific class styles (mobile chrome, cards, calendar, floor map, admin chrome)
- `fonts/` — Museo Sans 500 woff/woff2/ttf (regular + bold)
- `icons.jsx` — 27 inline-SVG icons (Lucide-style, 1.75 stroke). The design system says to use Lucide via CDN where licensed; these are 1:1 substitutes.
- `floor-plan.jsx` — floor data + SVG renderer
- `mobile-employee.jsx` / `mobile-extras.jsx` / `admin-desktop.jsx` — screen components
- `ios-frame.jsx`, `design-canvas.jsx`, `tweaks-panel.jsx` — preview-only scaffolding (do **not** port)

No bitmap imagery in the design — all visuals are tokens, SVG, or text.

## Files

- **Open `Hot Desking.html` first** — it loads everything in a Design Canvas with all 10 artboards visible side-by-side.
- Each screen is in one of the three screen JSX files (`mobile-employee.jsx`, `mobile-extras.jsx`, `admin-desktop.jsx`) — read those for the full markup, copy, and inline styles.
- `design-tokens.css` is the single source of truth for color/type/spacing values.
- `app-styles.css` shows the class-based selectors used (`.hd-today`, `.hd-card`, `.hd-cal-cell`, `.hd-admin-side`, etc.) — these are not contracts, just references for the styling decisions.

## Out of scope for this handoff

- Backend / data model (covered in `hot-desking-design.md` separately)
- WebSocket protocol details
- Real-time presence / waitlist queues
- SSO / SCIM wiring
- Calendar integration tokens

The design doc covers all of the above; this bundle is purely the visual and interaction layer.
