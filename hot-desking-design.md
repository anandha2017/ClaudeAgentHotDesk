# Hot Desking App — Design Document

**Version:** 0.1 (Research & Design Phase)
**Date:** 2026-04-30
**Status:** Draft — no implementation yet

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [UX Design](#ux-design)
3. [Technical Architecture](#technical-architecture)
4. [Data Model & Backend](#data-model--backend)

---

## Executive Summary

This document describes the research, design, and architecture for a hot desking application enabling employees at hybrid workplaces to discover, book, and check in to desks across one or more office buildings.

The product has three distinct user groups with different goals:
- **Employees** — fast, low-friction booking from mobile before commuting
- **Facilities managers** — live occupancy data and space management tooling
- **IT/Workplace admins** — policy configuration, integrations, and compliance

The system is architected as a modular monolith (split-ready by domain) on Azure, with PostgreSQL as the system of record, Redis for real-time presence and caching, and WebSockets for live desk availability updates. The booking conflict guarantee is enforced at the database layer via a Postgres exclusion constraint — not application-side.

---

## UX Design

### 1. User Personas

#### Persona 1: Maya — The Hybrid Employee
**Role:** Mid-level knowledge worker (analyst, designer, engineer)
**Frequency:** 2–4 times per week

**Goals**
- Secure a desk on chosen office days with minimal effort
- Sit near specific teammates or in a preferred zone
- Know before leaving home whether a desk is confirmed
- Repeat regular bookings without re-entering details

**Pain points**
- Arriving to find a "booked" desk taken or non-existent
- Friction-heavy booking flows requiring multiple taps for a recurring need
- Not knowing where teammates are sitting
- Last-minute changes forcing rebooking on mobile in transit

**Key needs:** One-tap rebook of a "usual" desk; team visibility; reliable mobile experience including offline view of today's booking.

---

#### Persona 2: David — The Facilities / Office Manager
**Role:** Manages one or more office floors; responsible for occupancy, layout, and workplace experience
**Frequency:** Daily

**Goals**
- Maintain accurate, up-to-date floor plans and desk metadata
- Monitor live and historical utilisation
- Resolve booking conflicts, no-shows, and equipment faults
- Configure booking rules, neighbourhood zones, and blackout dates

**Pain points**
- Floor plans drifting from reality after office changes
- Ghost bookings skewing utilisation data
- Manual reporting in spreadsheets
- A clunky admin portal that is desktop-only

**Key needs:** Visual floor-plan editor with bulk operations; real-time and historic utilisation dashboards; ability to override or release bookings on behalf of users.

---

#### Persona 3: Priya — The Workplace / IT Admin
**Role:** Owns the platform across the organisation; sets policy and integrations
**Frequency:** Weekly to monthly

**Goals**
- Configure org-wide policies (booking horizon, max bookings per user, cancellation windows)
- Manage roles, permissions, and access by site and department
- Ensure data privacy and auditability
- Integrate with identity, calendar, and badge-access systems

**Pain points**
- No ability to delegate site-level admin without granting global access
- Lack of audit trails for facilities manager changes
- Inconsistent policies between sites causing user confusion

**Key needs:** RBAC with site and department scoping; global policy templates with site-level overrides; audit log, SSO, and SCIM integration.

---

#### Persona 4: Tom — The Visitor / Occasional User
**Role:** External contractor, interviewee, or employee from another office
**Frequency:** 1–10 times per year

**Goals**
- Find his assigned desk on arrival without needing help
- Connect to Wi-Fi and equipment with minimal setup
- Understand basic etiquette (clean-desk policy, quiet zones)

**Pain points**
- Apps that require corporate SSO he does not have
- No clear wayfinding from reception to desk
- Unsure who to contact if something goes wrong

**Key needs:** Lightweight guest invite (link or QR; no app install required); clear arrival instructions and indoor wayfinding; visible host contact information.

---

### 2. Core User Flows

#### Flow A — Booking a Desk (Advance)
1. Home surfaces a "Next office day" prompt with a "Book a desk" CTA.
2. Calendar with a policy-aware availability heatmap (red = full, amber = limited, green = available). User picks dates.
3. Toggle between **List** view (smart suggestions: "Your usual desk," "Near your team," "Quiet zone") and **Map** view (interactive floor plan).
4. Tap a desk — bottom sheet shows photo, equipment, accessibility status, and booked neighbours.
5. Single confirm action; summary card shows date, desk ID, floor, and time window. Option to add to calendar.
6. Post-confirmation: options to "Add to calendar," "Invite teammates to sit nearby," and "Set as recurring."
7. Push and email confirmation; reminder the evening before and morning of the booking.

#### Flow B — Booking a Desk (Same-Day)
1. Home shows "Need a desk now?" banner if no booking exists for today and the user is within the office geofence or within office hours.
2. One-tap "Book nearest available" — recommends the best match using last-used desk, team proximity, and saved preferences.
3. Confirm in two taps.
4. Auto check-in option when geofence detects user on-site.

#### Flow C — Finding / Navigating to a Desk
1. Today card on Home shows floor, zone, desk ID, and a "Navigate" button.
2. Indoor map: pinch-to-zoom floor plan with highlighted route to desk. Step-free route on request.
3. Fallback (no positioning): static directions and a photograph of the desk area.

#### Flow D — Cancelling or Modifying a Booking
1. Entry: Home "Today/Upcoming" cards, "My bookings" list, calendar invite, or a reminder notification.
2. Booking detail shows three actions: **Change desk**, **Change date/time**, **Cancel**.
3. Modify path returns to desk-selection flow with current booking pre-filled; a diff summary shows what will change before confirmation.
4. Cancel path: confirmation modal with an optional reason dropdown. Cancellation is always allowed, even inside the policy window (consequence explained, not silently applied).
5. Desk released immediately; teammates with nearby bookings notified.

#### Flow E — Checking In / Checking Out

**Check-in** (window opens 30 min before start; closes at the no-show threshold):
1. Auto check-in via geofence or recognised Wi-Fi SSID (zero interaction)
2. QR code at the desk — scan to check in
3. "I'm here" tap in the app
4. Badge tap where access control is integrated

**Check-out:**
- Implicit: booking auto-ends at scheduled end time.
- Explicit: "End early" tap releases the desk immediately.
- Admin-forced: facilities can release an unoccupied desk with a reason and full audit trail.

#### Flow F — Admin: Floor Plans, Availability, Reporting

**Floor plan management:** Upload SVG or CAD file, or use the built-in drag-and-drop editor. Tag desks with attributes. Bulk operations by zone. Versioning with effective-from date; preview before publishing.

**Availability management:** Mark desks out of service with date range and auto-rebook for affected users. Create blackout periods. Reserve neighbourhoods for specific teams.

**Reporting:** Pre-built dashboards for utilisation, peak occupancy, no-show rate, and booking-horizon distribution. Filter by site, floor, zone, team, and date range. Export to CSV or schedule email delivery.

---

### 3. Key UX Principles

1. **Mobile-first, but cross-surface.** Most bookings happen on the move; the mobile experience is the canonical reference.
2. **Minimal friction for the 80% case.** A returning user should book their usual desk for their next office day in two taps or fewer.
3. **Truthful, real-time availability.** A stale or incorrect availability state is the fastest way to permanently lose user trust.
4. **Glanceable today.** Home answers three questions at a glance: Do I have a desk today? Where is it? Have I checked in?
5. **Progressive disclosure.** Simple by default. Power features are one tap deeper, never absent.
6. **Spatial clarity.** Map and list views are first-class, equally usable.
7. **Inclusive by design.** WCAG 2.2 AA minimum. Accessibility filters are core features, not afterthoughts.
8. **Respect the office community.** Surface social signals (where teammates are sitting) without surveillance. Team visibility is opt-in.
9. **Forgiving by default.** Easy to cancel, easy to modify, gentle nudges rather than penalties.
10. **Calm notifications.** Maximum of three system notifications per booking lifecycle. All others are opt-in.
11. **Admin parity.** Admin tools are held to the same usability standards as the employee-facing product.
12. **Privacy by default.** Personal location, booking history, and preferences visible to the individual user; available to admins in aggregate only.

---

### 4. Feature Priority (MoSCoW)

#### Must Have
- SSO sign-in and basic user profile (desk preferences, accessibility needs)
- Same-day and advance desk booking (single date)
- Interactive floor-plan map with live availability
- Booking confirmation, modification, and cancellation
- Check-in (QR scan and manual tap) with auto check-out at end time
- Today/Upcoming bookings prominently on Home
- Push and email notifications (confirmation and reminder)
- Admin: floor-plan setup, desk attribute tagging, mark out-of-service
- Admin: utilisation dashboard with CSV export
- WCAG 2.2 AA compliance
- Calendar integration (at minimum, ICS file sync)

#### Should Have
- Recurring booking rules ("every Tuesday and Thursday")
- "Find my team" view showing where opted-in teammates are booked
- Smart desk suggestions based on booking history and team proximity
- Geofence-based auto check-in
- Indoor wayfinding (route to booked desk)
- Multi-date booking in a single flow
- "Report an issue" from the desk detail screen
- Visitor/guest invitation with lightweight, app-free check-in
- Site- and team-scoped admin roles
- No-show analytics and configurable auto-release rules

#### Could Have
- Locker, parking, and meeting-room booking in the same surface
- Social signals: "3 of your team are in on Wednesday"
- Wellbeing nudges (seating variety, daylight exposure tracking)
- Wearable check-in (Apple Watch)
- Voice/Siri/Alexa booking shortcuts
- Sustainability metrics (commute carbon saved, building density)
- Post-visit sentiment feedback
- Catering or coffee pre-order integration

#### Won't Have (this release)
- Full meeting-room scheduling with catering and AV management
- Real-time individual location tracking of colleagues
- In-app messaging or chat (defer to Teams or Slack)
- Native AR/VR floor-plan walkthrough
- Autonomous desk assignment with zero user input

---

### 5. Edge Cases and Failure States

| Scenario | Experience |
|---|---|
| Desk becomes unavailable when user opens the booking flow | "Fully booked" state shown with: next available slot, alternative nearby zones, a waitlist option, and a "notify me if a desk frees up" toggle. |
| Booking conflict — two users tap the same desk simultaneously | First confirmation wins. The second user receives an immediate message: "That desk was just taken — here are 3 similar options." A short pre-confirmation hold (3–5 seconds) reduces frequency. |
| User does not check in by the no-show threshold | Gentle nudge: "Still coming in? Tap to keep your desk." If no response by hard cutoff, desk is auto-released and user receives a non-judgemental notification. |
| User arrives to find their desk physically occupied | One-tap "My desk is taken" offers the nearest available alternative and files an incident report to facilities. |
| Floor plan changed after a booking was made | Affected users are notified immediately. System auto-suggests an equivalent desk and asks for confirmation before re-booking. |
| Desk equipment broken | "Report issue" from the desk detail view. User offered a two-tap desk swap; broken desk immediately marked unavailable. |
| App has no network connection | Cached "Today" card always available offline: desk number, floor, zone, QR code, and a static floor-plan image. Offline actions queued and synced on reconnection. |
| User has overlapping bookings on the same date | The booking flow detects the conflict and warns before confirmation: "You already have a desk at Site A on this date. Replace it or keep both?" |
| User attempts to cancel inside the policy no-cancellation window | Clear messaging on consequences. Cancellation is always permitted — users are never trapped. |
| Visitor arrives before host or without a smartphone | Reception kiosk fallback: look up visitor name, display desk and floor, print a temporary access pass, push arrival notification to host. |
| Building closure or emergency | Admin broadcasts a cancellation across all affected bookings in a single action. Users receive push notification, email, and calendar update. Home shows a persistent banner. |
| Map positioning data is missing or low-confidence | Gracefully degrade to a static floor image with the desk highlighted and written step directions. A broken or empty map is never shown silently. |
| Time zone or daylight saving edge cases | All times display in the building's local time. Cross-site bookings include an explicit timezone label. |

---

## Technical Architecture

### 1. System Overview

The system follows a **modular, service-oriented architecture** behind a single API gateway, with a dedicated real-time channel for live state propagation. It is multi-tenant at the organisation level and partitioned by site/building internally.

```
+---------------------------------------------------------------+
|  Clients                                                      |
|  - Web App (SPA)        - iOS / Android (mobile)              |
|  - Kiosk / Floor Display - Slack / Teams app                  |
+----------------------+----------------------------------------+
                       |  HTTPS / WSS
+----------------------v----------------------------------------+
|  Edge: CDN + WAF + API Gateway (auth, rate limit, routing)    |
+----------------------+----------------------------------------+
                       |
   +-------------------+-----------------------------------+
   |                   |                                   |
+--v-----+   +---------v--------+   +------v-----+   +----v-----+
| Auth & |   | Core Services    |   | Real-Time   |   | Async    |
| Identity|  | - Booking        |   | Gateway     |   | Workers  |
| (OIDC/  |  | - Inventory/Maps |   | (WebSocket  |   | (queues, |
| SCIM)   |  | - User/Org       |   | + presence) |   | sched.)  |
+--------+   | - Notifications  |   +------+------+   +----+-----+
             | - Reporting      |          |               |
             +--------+---------+          |               |
                      |                    |               |
              +-------v-------+    +-------v-------+   +---v------+
              | PostgreSQL    |    | Redis         |   | Event Bus|
              | (system of    |    | (presence,    |   | (Kafka / |
              | record)       |    | cache, locks) |   | Service  |
              +---------------+    +---------------+   | Bus)     |
                                                       +----+-----+
                                                            |
                                  +-------------------------v-----+
                                  | Integration Layer             |
                                  | Outlook/Graph · Google        |
                                  | Slack/Teams · Badge · HRIS    |
                                  +-------------------------------+
```

**Core services** (logical bounded contexts; start as a modular monolith, split by domain when team scales):
- *Booking* — reservations, conflict resolution, recurrence, check-in/no-show
- *Inventory & Floor Maps* — sites, buildings, floors, zones, desks, rooms, amenities, SVG data
- *User & Org* — profiles, teams, neighbourhoods, preferences, favourites
- *Notifications* — email/push/chat dispatch, templating, user preferences
- *Reporting/Analytics* — utilisation, occupancy, no-show metrics

---

### 2. Technology Stack

#### Frontend — Web
- **Framework**: React + Next.js (TypeScript). SSR for login/public surfaces; client-side for the booking app.
- **State/data**: TanStack Query for server state, Zustand for local UI state.
- **Real-time**: Native WebSocket client with pub/sub abstraction; long-poll fallback.
- **Floor maps**: SVG with a custom React renderer (zoom/pan via `react-zoom-pan-pinch`).
- **UI**: Radix + Tailwind for accessibility (WCAG 2.2 AA) and theming.

#### Frontend — Mobile
- **Framework**: React Native (Expo managed where possible, bare for native modules).
- **Why RN over native**: Hot desking is form-and-list heavy with one specialised view (floor map). RN gives ~80% code reuse with the web map renderer via a shared workspace package. Native modules added only for NFC/QR check-in, biometric unlock, push, and calendar widget.
- **Offline**: Booked-desk QR pass cached locally; recent floor plans cached for read-only viewing.

#### Backend / API Layer
- **Primary**: Node.js + NestJS (TypeScript). Shared types with frontend; strong DI/module system fits the modular-monolith-then-split path.
- **Real-time gateway**: Node service with `ws` + Redis pub/sub up to ~20k concurrent connections; migrate to Go service beyond that.
- **Async workers**: Same Node runtime, separate deployment — BullMQ on Redis for short delays; Azure Service Bus for durable workflows.

#### Real-Time Layer
- **Transport**: WebSockets (WSS) with sticky sessions at the load balancer; SSE fallback for restrictive corporate networks.
- **Backplane**: Redis pub/sub for in-region fan-out; Redis Streams for a short replay window on reconnect.
- **Escape hatch**: Self-hosted on Redis initially; plug-and-play migration to Ably or Azure Web PubSub if operational burden grows.
- **Channel granularity**: Per-floor, per-date — so a Helsinki change does not broadcast to London clients.

#### Auth & Identity
- **Primary IdP**: Customer's own IdP via OIDC (Entra ID / Okta / Google Workspace). SAML supported for legacy tenants.
- **App tokens**: Short-lived JWT access tokens (10 min) + rotating refresh tokens carrying `org_id`, `roles`, and `site_scope` claims.
- **User provisioning**: SCIM 2.0 for lifecycle (joiner/mover/leaver).
- **Calendar identity**: Separate OAuth consent per user for Microsoft Graph and Google Calendar; tokens encrypted at rest with per-tenant KMS key.

#### Infrastructure & Hosting
- **Cloud**: Azure (UK-South primary; EU-West secondary) — aligned with Microsoft 365/Entra ID and UK data residency.
- **Compute**: AKS (Kubernetes); Azure Container Apps acceptable for early stages.
- **Data**: Azure Database for PostgreSQL (Flexible Server, HA, zone-redundant) + Azure Cache for Redis (Premium) + Azure Service Bus + Blob Storage for floor plans.
- **Edge**: Azure Front Door (CDN + WAF + global LB).
- **Observability**: OpenTelemetry across services; Grafana dashboards; Azure Monitor/Log Analytics.
- **CI/CD**: GitHub Actions → ACR → AKS via ArgoCD (GitOps). Trunk-based development; preview environments per PR.

---

### 3. Key Integrations

| Integration | System(s) | Direction | Purpose |
|---|---|---|---|
| **Calendar — Microsoft** | Microsoft Graph | Bi-directional | Reflect bookings on user calendar; ingest WFH/PTO to suggest desk-free days |
| **Calendar — Google** | Google Calendar API | Bi-directional | Same as above for Workspace tenants |
| **Building Access** | HID, Lenel, Genetec, Kisi, Openpath | Inbound + Outbound | Auto check-in on badge tap; release if no badge by cut-off |
| **HRIS / Directory** | Workday, SuccessFactors, Entra ID | Inbound | Org chart, manager hierarchy, cost centre, employment status |
| **Chat — Microsoft Teams** | Bot Framework, Graph | Bi-directional | Booking via bot, daily Adaptive Cards, announcements |
| **Chat — Slack** | Slack API | Bi-directional | Slash commands (`/book`, `/whois-in`), Block Kit modals |
| **Visitor Management** | Envoy, Proxyclick | Outbound | Pre-register guests when a host books a guest desk |
| **Occupancy Sensors (Phase 2)** | VergeSense, Disruptive Tech | Inbound | Ground-truth occupancy; auto-release ghost bookings |

**Cross-cutting patterns:**
- Adapter per integration, hidden behind a stable internal contract (`CalendarPort`, `AccessControlPort`, `DirectoryPort`).
- Outbox pattern for any DB write that must produce an external side effect.
- Webhook ingress is HMAC-signed, rate-limited, replay-protected, and queued before processing.
- Circuit breakers and per-tenant quotas on outbound calls. Integration failures degrade gracefully.

---

### 4. Scalability and Performance

#### Workload Profile
- Strong daily and weekly periodicity. Peak: **08:00–10:00 on Mondays** for the same-day booking rush.
- Read/write ratio ~20:1 — floor map views dominate traffic.
- Real-time fan-out: one booking event reaches every viewer of that floor (10–100s of clients).

#### Monday Morning Booking Rush
- **Pre-warm**: Autoscalers (KEDA/HPA) scale on a schedule ahead of the surge.
- **Read scale**: All floor-map reads served from Redis cache; misses fall through to Postgres read replicas.
- **Write contention**: `SELECT ... FOR UPDATE` on the slot row inside a short transaction; Postgres advisory lock keyed by `hash(desk_id, date)`. For very hot floors, a single-writer queue per floor backed by Redis Streams serialises writes and removes DB contention.
- **Idempotency**: Every booking POST carries an `Idempotency-Key`; duplicate submits collapse to one booking.
- **Optimistic UI**: Client marks the desk as "claiming" instantly, reconciles on the WebSocket confirmation. Perceived latency is effectively zero.

#### Real-Time Availability
- Delta payloads only (status diffs, not full floor state). Snapshots fetched via REST; WebSockets carry deltas.
- Reconnect resilience: clients send `last_seq` on reconnect; server replays missed deltas from Redis Streams (5-minute buffer). If the gap exceeds the buffer, client fetches a full snapshot.

#### Multi-Site / Multi-Building
- Single logical multi-tenant deployment with `org_id` on every row; row-level security in Postgres.
- Hierarchy: `Org → Region → Site → Building → Floor → Zone → Desk`. Indexed for hierarchical queries; permissions scoped at any level.
- Every booking stores instant (UTC) **and** local date + IANA timezone of the building.
- Data plane regionalised (UK, EU, US) for residency and latency.

---

### 5. Non-Functional Requirements

| Target | Value |
|---|---|
| Booking API availability (monthly SLO) | 99.9% (~43 min error budget/month) |
| Read path availability | 99.95% |
| RPO | 5 minutes |
| RTO | 30 minutes (warm replica, regional failover) |
| Floor-map snapshot fetch (p95) | < 300 ms |
| Booking create — warm cache path (p95) | < 250 ms server / < 600 ms perceived |
| WebSocket delta delivery in-region (p95) | < 150 ms |
| Mobile cold-start to interactive | < 2.5 s |

**Graceful degradation:**
- Calendar integration down — bookings succeed, sync queued for retry.
- Real-time gateway down — clients fall back to 30s polling.
- HRIS sync down — directory served from last-good snapshot.

**RBAC roles (default set; customisable per tenant):**
- `Employee`, `Delegate`, `Team Lead`, `Floor Admin`, `Site Admin`, `Org Admin`, `Auditor`, `Service`

**Authorisation model:** Role + scope (e.g. `site:*`, `building:42`) evaluated centrally. Every API resolver calls the policy with `(subject, action, resource)`.

**Compliance posture:** Designed for GDPR / UK GDPR, SOC 2 Type II, ISO 27001.

---

### 6. API Design

Three protocols, each playing to its strength:

| Protocol | Used for |
|---|---|
| **REST (JSON, OpenAPI 3.1)** | Resource CRUD, admin, integrations, partner-facing surface |
| **GraphQL (private, app clients only)** | Complex composite views (booking screen, home screen aggregate) |
| **WebSocket (WSS)** | Live desk availability and personal notifications |

GraphQL uses persisted queries exclusively — no arbitrary client queries — with enforced query cost analysis.

**Conventions:**
- URI-versioned major (`/v1`) for REST. GraphQL evolves additively; breaking changes follow a 12-month deprecation window.
- External identifiers are ULIDs (sortable, opaque). DB sequence IDs never exposed.
- Error format: RFC 7807 `application/problem+json` with a stable machine-readable `code` field.
- All POSTs accept an `Idempotency-Key` header; server stores key + response for 24 hours.
- Cursor-based pagination only. Offset pagination not supported.
- All timestamps in ISO 8601 UTC; resources also expose `local_date` and `timezone` where contextually relevant.
- `org_id` derived from the access token — never accepted from a client request body.

**Key REST surface (`/v1/...`):**
- `GET /me`, `PATCH /me`, `GET /users`
- `GET /sites`, `/buildings`, `/floors`, `/desks`
- `GET /floors/{id}/availability?date=&from=&to=`
- `POST /bookings`, `GET /bookings`, `PATCH /bookings/{id}`, `DELETE /bookings/{id}`
- `POST /bookings/{id}/check-in`, `POST /bookings/{id}/release`
- `POST /bookings/recurring` (RFC 5545 RRULE)
- Admin: floor/desk management, utilisation reports, audit log, policy config
- SCIM 2.0 `/Users` and `/Groups`

**WebSocket channels:**
- `org:{orgId}:floor:{floorId}:date:{yyyy-mm-dd}` — desk status deltas
- `user:{userId}` — personal events (booking confirmed, reminder, admin cancellation)
- `admin:{orgId}` — admin notifications

---

## Data Model & Backend

### 1. Core Entities

#### Spatial Hierarchy

**Building** — `id`, `name`, `code`, `address`, `city`, `country`, `timezone` (IANA), `operating_hours` (JSON per weekday), `region_id`, `is_active`

**Floor** — `id`, `building_id`, `level` (signed int; -1 = basement), `name`, `floor_plan_asset_id` (versioned), `capacity` (denormalized)

**Zone** — `id`, `floor_id`, `name`, `zone_type` (enum: `quiet`, `collaboration`, `phone_booth`, `focus`, `general`, `executive`), `bounding_polygon`

**Desk** — `id`, `zone_id`, `floor_id` (denormalized), `label` (e.g. "3F-A12"), `coordinates` (x, y on floor plan), `desk_type` (enum: `standard`, `standing`, `dual_monitor`, `executive`, `hot`, `assigned`, `accessible`), `status` (enum: `available`, `out_of_service`, `reserved_assigned`), `bookable_from`, `bookable_until`

#### People & Org

**User** — `id`, `email`, `display_name`, `external_id` (SSO subject), `home_building_id`, `team_id`, `department_id`, `role`, `employment_status`, `accessibility_needs` (JSON, opt-in), `consent_flags` (JSON), `created_at`, `deactivated_at`

**Team** — `id`, `name`, `department_id`, `default_floor_id`, `default_zone_id`, `manager_user_id`

**Department** — `id`, `name`, `cost_centre`, `parent_department_id` (self-FK for org hierarchy)

#### Bookings

**Booking** — `id`, `user_id`, `desk_id`, `time_range` (`tstzrange`, half-open `[start, end)`), `status` (enum: `pending`, `confirmed`, `checked_in`, `checked_out`, `cancelled`, `no_show`, `auto_released`), `source` (enum: `web`, `mobile`, `kiosk`, `slack_bot`, `admin`, `recurring`), `recurring_booking_id`, `is_exception`, `check_in_deadline`, `created_at`, `cancelled_at`, `cancellation_reason`

**RecurringBooking** — `id`, `user_id`, `desk_id` (or `zone_id`), `rrule` (RFC 5545), `series_start_date`, `series_end_date`, `time_of_day_start`, `time_of_day_end`, `timezone`, `status`, `materialization_horizon_until`

**RecurringBookingException** — records cancelled or modified single occurrences without breaking the whole series.

#### Amenities

**Amenity** — `id`, `code` (e.g. `dual_monitor`, `standing_desk`, `wheelchair_accessible`, `near_window`), `category`, `display_name`, `icon_ref`

**DeskAmenity** (join table) — `desk_id`, `amenity_id`, `notes`, `installed_at`

#### Operational Events

**CheckInEvent** — `id`, `booking_id`, `event_type` (enum: `check_in`, `check_out`, `auto_release`, `extend`), `method` (enum: `qr_scan`, `nfc`, `geofence`, `manual`, `system`), `event_time`

**Notification** — `id`, `user_id`, `type`, `channel` (`push`, `email`, `slack`, `in_app`), `payload` (JSON), `scheduled_for`, `sent_at`, `delivered_at`, `read_at`

**Waitlist** — `id`, `user_id`, `target` (polymorphic: `desk_id` or `zone_id`), `requested_time_range`, `position`, `priority_score`, `status`, `offer_expires_at`

**AuditLog** — `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_state` (JSON), `after_state` (JSON), `timestamp`, `request_id`

---

### 2. Entity Relationships & Key Constraints

| Relationship | Cardinality |
|---|---|
| Building → Floor | 1:N |
| Floor → Zone | 1:N |
| Zone → Desk | 1:N |
| Department → Team | 1:N |
| Team → User | 1:N |
| User → Booking | 1:N |
| Desk → Booking | 1:N (one active per time slot) |
| RecurringBooking → Booking | 1:N (materialized occurrences) |
| Desk → Amenity | N:M (via DeskAmenity) |

**No overlapping active bookings per desk** — enforced at the database layer via a Postgres exclusion constraint:
```sql
EXCLUDE USING gist (desk_id WITH =, time_range WITH &&)
WHERE (status IN ('pending', 'confirmed', 'checked_in'))
```
This is the authoritative guard. Application-level checks are advisory only.

**Key indexes:**
- `bookings (desk_id, time_range)` GIST — overlap queries and availability checks
- `bookings (user_id, lower(time_range) DESC)` — "my upcoming bookings"
- `bookings (building_id, lower(time_range))` — analytics roll-ups
- `desks (floor_id, status)` — floor plan rendering

---

### 3. Booking Logic

#### Conflict Detection
- Primary defence is the GIST exclusion constraint on `(desk_id, time_range)`.
- Service issues `SELECT ... FOR UPDATE` on the desk row, then attempts the insert; the constraint rejects conflicts atomically. Application-level "check then insert" is rejected — it is race-prone.
- For zone-level or "any available desk" requests, candidate desks are locked using `SKIP LOCKED` so parallel requests allocate different desks without contention.
- Booking creation endpoints accept an `Idempotency-Key` header; mobile retries cannot produce duplicate bookings.

#### Recurring Booking Handling
- The RecurringBooking row stores the series definition (RRULE). Individual Booking rows are materialized occurrences.
- A nightly background job expands the RRULE forward to the materialization horizon (default: 60 days).
- Edit semantics: "this occurrence only," "this and future occurrences" (splits the series), or "entire series."
- Cancelling a single occurrence creates a RecurringBookingException. Cancelling the series sets status to `ended` and cancels all future unchecked-in occurrences.

#### Waitlist / Queue Logic
- Created when a user requests a fully-booked desk or zone.
- FIFO ordering by default; priority score configurable (team-floor alignment, accessibility need, manager status).
- When a booking is cancelled or auto-released, the system identifies the highest-priority eligible waitlister and issues a time-bound offer (default: 10 minutes).
- If the offer lapses unclaimed, it cascades to the next eligible entry.

#### Auto-Cancellation (No-Show Policy)
- Every booking carries a `check_in_deadline` = `booking_start + grace_period` (default: 15 minutes; configurable per building).
- A background worker running every 1–2 minutes marks bookings past their deadline without a check-in event as `no_show` and sets `auto_released = true`.
- Desk re-enters the availability pool immediately and any waiting waitlister is offered the slot.
- No-show events counted against the user. Configurable thresholds trigger automated notifications and optionally booking restrictions.

#### Desk Release Policies
- **Manual early checkout** — user ends booking before scheduled end; residual time becomes bookable.
- **End-of-day auto-checkout** — job runs at building close time and issues `checked_out` events with `method = 'system'`.
- **Admin override** — facilities staff can force-release any desk; always written to AuditLog.

---

### 4. Reporting & Analytics

#### Storage Architecture
- Operational database remains normalized for transactional workloads.
- Nightly ETL populates a warehouse (BigQuery, Snowflake, or columnar Postgres) in a star schema for historical reporting.
- Real-time dashboards read from materialized views or a denormalized cache rebuilt every 1–5 minutes.

#### Fact Tables

| Table | Grain | Key Dimensions |
|---|---|---|
| `fact_booking` | One row per booking | dim_user, dim_desk, dim_date; includes duration, lead_time_hours, was_recurring, was_no_show |
| `fact_check_in` | One row per check-in/out event | dim_booking, dim_desk, method |
| `fact_desk_minute` (optional) | Per-desk per-minute state | Supports heatmap and fine-grained utilization analysis |

#### Key Metrics
- **Occupancy rate** — booked desk-hours ÷ available desk-hours, sliced by desk/zone/floor/building/date/hour
- **Utilization rate** — checked-in desk-hours ÷ booked desk-hours; surfaces ghost bookings
- **No-show rate** — per user, per team, per building, per weekday
- **Booking lead time** — distribution (median, p90) of how far in advance users book
- **Peak concurrent occupancy** vs physical capacity — identifies under-provisioned floors
- **Amenity demand ratio** — bookings filtered by amenity ÷ total bookings for desks with that amenity
- **Cancellation lead time** — drives waitlist offer window policy

#### Capacity Planning
- Forecast required desk count by combining utilization trends with known headcount changes.
- Auto-identification of zones persistently below 40% utilization (consolidation candidates) and zones with peak occupancy above 90% (expansion candidates).
- Floor plan heatmaps for executive reporting.

---

### 5. Data Retention & Compliance

| Data Category | Hot / Operational | Warm / Reporting | Cold / Purged |
|---|---|---|---|
| Active and future bookings | Indefinite | — | — |
| Past bookings (raw) | 13 months | 13–24 months | Anonymized after 24 months |
| Check-in events (raw) | 13 months | Aggregated into fact tables | Raw rows deleted at 13 months |
| Notifications | 90 days | — | Hard delete |
| Audit logs | 24 months online | 7 years cold storage | Per jurisdiction override |
| Aggregated analytics | Indefinite (already anonymous) | — | — |

**GDPR / UK GDPR:**
- Lawful basis: legitimate interest (workplace operations) for core booking data; explicit consent for optional features (presence tracking, behavioural analytics).
- Right-to-erasure: replaces `user_id` with a tombstone identifier; aggregate counts remain accurate; no individual identity remains.
- DSAR: dedicated export endpoint returns a user's bookings, check-in events, notifications, and consent history as JSON or CSV.
- Data residency: `region_id` on Building determines which cloud region stores that building's data.
- PII minimisation: client IP addresses on CheckInEvent are hashed with a rotating salt; raw IP never stored. Accessibility data is opt-in.
- Consent ledger: every change to `consent_flags` is written as an immutable record with timestamp, policy version, and source.

---

### 6. Caching Strategy

| Cache Tier | What | TTL / Invalidation |
|---|---|---|
| CDN (immutable, versioned) | Floor plan SVGs keyed by `floor_id + version` | Infinite TTL; version increments on update |
| Edge / API gateway | Building/floor/zone metadata; amenity catalog | 5–15 min; purged via cache-tag on admin edit |
| Redis — availability grid | `floor_id:date` | 30–60s; evicted immediately on any booking/cancellation on that floor/date |
| Redis — user session | Permissions, upcoming bookings | 5–15 min; evicted on role/status change or booking mutation |
| Redis — waitlist position | `(target, slot)` | 30s |
| In-process LRU | Building list, desk types, amenity definitions; RRULE expansion results | 5 min with background refresh |

**Invalidation rules:**
- Event-driven invalidation preferred over pure TTL for the availability grid. Every booking write publishes a `desk_availability_changed(floor_id, date)` event; consumers evict the relevant key synchronously.
- Cache stampede protection: Redis `SETNX`-based lock (single-flight pattern) when rebuilding the availability grid for a hot floor/date.

**What must not be cached:**
- Booking create and mutation paths — must read with `SELECT ... FOR UPDATE`.
- Check-in event writes — must be durable and exact.
- Compliance, audit, or GDPR reads — must always reflect the current state of the authoritative database.

---

## Architectural Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Service shape | Modular monolith, split by domain when team scales | Avoids premature distribution; clean boundaries enable later extraction |
| Primary cloud | Azure (UK-South + EU-West) | Microsoft 365/Entra alignment, UK data residency, Graph integration latency |
| Datastore | PostgreSQL + Redis | Relational booking semantics + low-latency cache and distributed locks |
| Real-time | Self-hosted WebSocket on Redis pub/sub; pluggable to Ably/Azure Web PubSub | Cost-efficient at start, clear escape hatch at scale |
| API surface | REST (public) + GraphQL (private) + WebSocket (live) | Each plays to its strength |
| Identity | OIDC + SCIM; per-user OAuth for calendar | Leverages tenant IdP; supports full lifecycle automation |
| Tenancy | Logical multi-tenant with row-level security | Operational simplicity with a clear path to dedicated DBs for heavy tenants |
| Conflict guard | Postgres GIST exclusion constraint | Atomic, race-free; application checks are advisory only |
| Mobile | React Native (shared codebase with web) | ~80% code reuse, faster time-to-market vs native |

---

*This document was produced collaboratively by three specialist agents covering UX, technical architecture, and data model/backend. It represents a research and design phase output. No implementation has been started.*
