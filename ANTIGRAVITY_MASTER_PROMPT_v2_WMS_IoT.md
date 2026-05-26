# ════════════════════════════════════════════════════════════════════
# ANTIGRAVITY MASTER PROMPT v2.0
# WarePro — Industrial IoT Command Platform
# By: Anudeep Thota / Forge Studio for Pipra Solutions
# ════════════════════════════════════════════════════════════════════

## WHO YOU ARE

You are a Principal Product Engineer, Senior UX Architect, and elite
Frontend Builder. You have shipped enterprise-grade IoT dashboards for
companies like Vercel, Linear, AWS IoT, and industrial automation firms.
You do NOT build generic admin tables. You build **command centers** that
operators trust with million-dollar infrastructure.

Your benchmark: Linear's engineering precision + Vercel's typographic
restraint + NASA mission control's information density.

---

## WHAT YOU ARE BUILDING

A **full-stack mock IoT management platform** called **WarePro WMS**
for Pipra Solutions. It manages:
- Multi-tenant hierarchy: Organisations → Locations → Groups
- Edge gateways (Raspberry Pi "PiEDGE Nodes") orchestrating BLE sensors
- ESP32 / NRF52 end-node sensors (temperature, humidity, motion, vibration)
- AWS IoT Core provisioning via Thing Groups
- OTA firmware deployment to the edge fleet

**User persona:** Network Ops Admins. They stare at this screen for 8+
hours during incidents. Every design decision must serve operational
clarity over decoration.

**Tech stack:** React + TypeScript + Tailwind CSS + React Router v6 +
Recharts + Leaflet.js. All data is mock — no backend calls.

---

## ════════════════════════════════════════════════════════
## SECTION 1: THE DESIGN SYSTEM (TOKENS + RULES)
## ════════════════════════════════════════════════════════

### 1.1 — Color Tokens (define as CSS custom properties in :root)

```css
:root {
  /* ── Surfaces ── */
  --bg-app:         #09090B;   /* page shell — deepest black */
  --bg-surface:     #111113;   /* card / panel backgrounds */
  --bg-elevated:    #18181B;   /* modals, drawers, popovers */
  --bg-hover:       #1C1C20;   /* table row hover, nav item hover */
  --bg-input:       #0F0F12;   /* form field backgrounds */

  /* ── Borders ── */
  --border-subtle:  #1F1F23;   /* hairline dividers, card edges */
  --border-default: #27272A;   /* standard component borders */
  --border-focus:   #3B82F6;   /* focused input rings */
  --border-hover:   #3F3F46;   /* hovered component borders */

  /* ── Text ── */
  --text-primary:   #FAFAFA;   /* headings, primary labels */
  --text-secondary: #A1A1AA;   /* body, supporting labels */
  --text-muted:     #52525B;   /* placeholders, disabled */
  --text-code:      #E4E4E7;   /* mono values, addresses */

  /* ── Brand ── */
  --brand:          #2563EB;   /* primary actions, links */
  --brand-hover:    #1D4ED8;   /* hover state for brand */
  --brand-glow:     rgba(37,99,235,0.15); /* focus rings, ambient glow */

  /* ── Semantic Status (CRITICAL — never use flat fills) ── */
  /* Pattern: bg = 8% opacity, text = vivid, border = 20% opacity */

  /* ONLINE / PROVISIONED / INTEGRATED */
  --status-online-bg:     rgba(16,185,129,0.08);
  --status-online-text:   #10B981;
  --status-online-border: rgba(16,185,129,0.20);

  /* OFFLINE / CRITICAL */
  --status-offline-bg:    rgba(239,68,68,0.08);
  --status-offline-text:  #EF4444;
  --status-offline-border:rgba(239,68,68,0.20);

  /* DISCOVERED / NEW */
  --status-disc-bg:       rgba(168,85,247,0.08);
  --status-disc-text:     #A855F7;
  --status-disc-border:   rgba(168,85,247,0.20);

  /* PENDING / AWAITING */
  --status-pend-bg:       rgba(245,158,11,0.08);
  --status-pend-text:     #F59E0B;
  --status-pend-border:   rgba(245,158,11,0.20);

  /* ── Elevation Shadows ── */
  --shadow-card:    0 0 0 1px var(--border-subtle), 0 4px 32px rgba(0,0,0,0.5);
  --shadow-drawer:  -8px 0 32px rgba(0,0,0,0.6), -1px 0 0 var(--border-default);
  --shadow-modal:   0 0 0 1px var(--border-default), 0 24px 64px rgba(0,0,0,0.8);
}
```

---

### 1.2 — Typography System

```
DISPLAY (page titles):   "DM Mono" 600 — monospaced authority
HEADINGS (sections):     "DM Mono" 500 — consistent with display
BODY (labels, text):     "IBM Plex Sans" 400/500 — enterprise clarity
TELEMETRY (MAC, IDs,     "IBM Plex Mono" 400 — perfectly aligned
  timestamps, URLs):      character widths essential in tables
```

Google Fonts import (add to index.html or CSS):
```
@import url('https://fonts.googleapis.com/css2?
  family=DM+Mono:ital,wght@0,400;0,500;1,400&
  family=IBM+Plex+Mono:wght@400;500&
  family=IBM+Plex+Sans:wght@400;500;600&
  display=swap');
```

**RULE:** Every MAC address, device ID, ARN, timestamp, routing URL,
firmware version string, and sensor unique name **MUST** use
`font-family: 'IBM Plex Mono'`. This is non-negotiable.

---

### 1.3 — Spacing & Layout Geometry

```
Sidebar width:          220px (collapsed: 56px)
Content max-width:      1440px (centered with px-6 md:px-8)
Card border-radius:     10px
Modal border-radius:    12px
Input border-radius:    7px
Button border-radius:   7px
Table row padding:      py-3 px-4
Card padding:           p-5
Section gap:            gap-6 (24px between cards)
```

---

### 1.4 — Animation & Motion Rules (CSS-only, no libraries)

```css
/* Standard transition — applied to ALL interactive elements */
.transition-base { transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); }

/* Drawer slide-in from right */
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
.drawer-enter { animation: slideInRight 240ms cubic-bezier(0.32,0.72,0,1); }

/* Fade-in for modals */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
}
.modal-enter { animation: fadeIn 180ms cubic-bezier(0.4,0,0.2,1); }

/* Status pulse ring — DISCOVERED and ONLINE states only */
@keyframes pulseRing {
  0%   { box-shadow: 0 0 0 0 var(--status-disc-border); }
  70%  { box-shadow: 0 0 0 6px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}
.pulse-discovered { animation: pulseRing 2s ease-out infinite; }

/* Page load — stagger card entries */
@keyframes cardReveal {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card-1 { animation: cardReveal 300ms 0ms   both ease-out; }
.card-2 { animation: cardReveal 300ms 60ms  both ease-out; }
.card-3 { animation: cardReveal 300ms 120ms both ease-out; }
.card-4 { animation: cardReveal 300ms 180ms both ease-out; }

/* Count-up for metric numbers */
/* Use a JS counter: animate from 0 to value over 800ms on mount */
```

---

### 1.5 — Reusable Component Specs

#### A. StatusBadge
```tsx
// Props: status: 'ONLINE'|'OFFLINE'|'DISCOVERED'|'PENDING'|'PROVISIONED'|'INTEGRATED'
// Render:
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs
             font-mono border" style="
  background: var(--status-{x}-bg);
  color: var(--status-{x}-text);
  border-color: var(--status-{x}-border);
">
  <span class="w-1.5 h-1.5 rounded-full" style="background:currentColor" />
  {status}
</span>
// Add .pulse-discovered class to the dot span when status === 'DISCOVERED'
```

#### B. MetricCard
```tsx
<div class="p-5 rounded-[10px] border flex flex-col gap-2 card-N"
     style="background:var(--bg-surface); border-color:var(--border-subtle);
            box-shadow:var(--shadow-card); border-left: 2px solid {accentColor}">
  <p class="text-xs uppercase tracking-widest font-mono"
     style="color:var(--text-muted)">{LABEL}</p>
  <p class="text-3xl font-mono font-medium" style="color:var(--text-primary)">{value}</p>
  <p class="text-xs" style="color:var(--text-secondary)">{subtext}</p>
</div>
```

#### C. DataTable
```tsx
<table class="w-full">
  <thead>
    <tr class="border-b" style="border-color:var(--border-subtle)">
      <th class="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider"
          style="color:var(--text-muted); background:rgba(9,9,11,0.5)">{COL}</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b group cursor-pointer"
        style="border-color:var(--border-subtle)"
        // hover: background var(--bg-hover), 150ms transition
    >
      <td class="px-4 py-3 text-sm" style="color:var(--text-secondary)">{cell}</td>
      // MAC/IDs: add font-family:'IBM Plex Mono' to the td
    </tr>
  </tbody>
</table>
```

#### D. RightDrawer (used for Register Sensor + View Devices)
```tsx
// Overlay: fixed inset-0 bg-black/60 backdrop-blur-sm z-40
// Panel: fixed inset-y-0 right-0 w-[480px] z-50
//        background: var(--bg-elevated)
//        border-left: 1px solid var(--border-default)
//        box-shadow: var(--shadow-drawer)
//        animation: slideInRight 240ms
// Header: px-6 py-5 border-b flex items-center justify-between
// Body:   px-6 py-6 overflow-y-auto flex-1
// Footer: px-6 py-4 border-t flex gap-3 justify-end
```

#### E. FormInput
```tsx
<label class="flex flex-col gap-1.5">
  <span class="text-xs font-mono uppercase tracking-wider"
        style="color:var(--text-muted)">{FIELD_LABEL}</span>
  <input class="w-full px-3.5 py-2.5 rounded-[7px] text-sm font-mono border
                outline-none transition-all duration-150"
         style="background:var(--bg-input); color:var(--text-primary);
                border-color:var(--border-default)"
         // focus: border-color:var(--border-focus), box-shadow:0 0 0 3px var(--brand-glow)
         placeholder={placeholder} />
</label>
```

#### F. Toast Notification
```tsx
// Position: fixed top-4 right-4 z-[100] flex flex-col gap-2
// Each toast: flex items-center gap-3 px-4 py-3 rounded-[10px]
//   background: var(--bg-elevated)
//   border: 1px solid var(--border-default)
//   box-shadow: 0 8px 32px rgba(0,0,0,0.5)
//   animation: slideInRight 200ms, then auto-dismiss after 3s
// Left accent bar: w-1 h-full rounded-l-full (green/red/blue based on type)
```

#### G. WaitingRoomBanner
```tsx
// A full-width card with amber left-border (2px solid #F59E0B)
// background: rgba(245,158,11,0.04)
// border: 1px solid rgba(245,158,11,0.15)
// Contains discovered device card(s) with inline dropdowns + Register button
```

#### H. CommandPalette (Cmd+K)
```tsx
// Trigger: fixed bottom-4 left-1/2 -translate-x-1/2 pill button
//   "⌘K  Search fleet..."
//   background: var(--bg-elevated), border: var(--border-default)
//   width: 280px, text: var(--text-muted)
// On open: fullscreen overlay + centered input + filtered results list
// Shortcuts: "Register Sensor", "Push OTA", "View Offline Devices", "Organisation Setup"
```

---

## ════════════════════════════════════════════════════════
## SECTION 2: APP SHELL (GLOBAL LAYOUT)
## ════════════════════════════════════════════════════════

### Global Layout Structure
```
┌──────────────────────────────────────────────────────┐
│ TOPBAR (h-14, border-bottom, fixed)                  │
│ [☰] [W WMS Logo]    ─────────────    [🔔] [● Admin] │
├─────────────┬────────────────────────────────────────┤
│             │                                        │
│  SIDEBAR    │   MAIN CONTENT AREA                    │
│  (220px)    │   (flex-1, overflow-y-auto)            │
│  fixed      │   max-w-[1440px] px-6 md:px-8         │
│  h-screen   │   py-8                                 │
│             │                                        │
└─────────────┴────────────────────────────────────────┘
```

### Topbar
- Height: 56px (h-14)
- Background: `var(--bg-app)` + `border-bottom: 1px solid var(--border-subtle)`
- Backdrop blur: `backdrop-blur-md`
- Position: `fixed top-0 left-0 right-0 z-30`

Logo: `[W]` mark (blue square, white W) + `WMS` in DM Mono 500
Right side: Bell icon (with badge if notifications > 0) + Avatar circle
Bell dropdown: list of 3 alerts styled like toast but vertical

### Sidebar (left, fixed)
- Width: 220px | Collapsed: 56px (toggle with hamburger)
- Background: `var(--bg-app)` + `border-right: 1px solid var(--border-subtle)`
- Top padding: 56px (below topbar)

Navigation structure:
```
  ● Overview              (LayoutDashboard icon)

  INFRASTRUCTURE          (section label — text-xs uppercase tracking-widest text-muted)
  ● Organisation          (Building2 icon)
  ● RPI Nodes             (Router icon, under RPI collapsible)

  FLEET                   (section label)
  ● Fleet OTA             (Activity icon)
  ● AWS Jobs              (Cloud icon)

  IOT                     (section label)
  ● IoT Sensors           (Cpu icon)

  ───────────────────
  v2.0  Pipra Solutions   (bottom, text-muted, font-mono)
```

Nav item active state:
- `background: var(--bg-hover)`
- `border-left: 2px solid var(--brand)`
- `color: var(--text-primary)`
- padding-left shifts 2px left to compensate border

Nav item hover:
- `background: var(--bg-hover)` + 150ms transition

---

## ════════════════════════════════════════════════════════
## SECTION 3: ROUTES & PAGES
## ════════════════════════════════════════════════════════

**React Router routes:**
```
/              → redirect to /overview
/overview      → Live Command Overview
/organisation  → Organisation Setup (Miller Columns)
/rpi           → RPI Node Groups
/fleet         → Fleet OTA & Status
/iot           → IoT Sensors
```

---

## ════════════════════════════════════════════════════════
## PAGE 1: /overview — LIVE COMMAND OVERVIEW
## ════════════════════════════════════════════════════════

### Page Header Row
```
Organisation: [Pipra Solutions ▾]              Updated: 4:55:56 PM  [↻]
```
Organisation selector: styled select with brand border-focus.
Refresh button: icon-only, rotates 360° while loading.
"Last updated" text: font-mono, text-muted, updates on each refresh.

---

### KPI Strip (4 MetricCards, grid-cols-4 gap-4)

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ LOCATIONS        │ │ GATEWAYS (RPI)   │ │ END NODES (IoT)  │ │ SYSTEM ALERTS    │
│ left: #2563EB   │ │ left: #EF4444   │ │ left: #F59E0B   │ │ left: #EF4444   │
│                  │ │                  │ │                  │ │                  │
│  2               │ │  9               │ │  0               │ │  9               │
│                  │ │                  │ │                  │ │                  │
│ +0 Streaming     │ │ +0 Online        │ │ +2 Streaming     │ │ 3 Warning        │
│  2 Idle          │ │  9 Offline ●     │ │  2 Silent        │ │ 6 Offline ●      │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```
- The "● Offline" sub-labels: color matches card accent (red for offline)
- Numbers animate count-up on mount (0 → value, 800ms)

---

### Live Location Map (Leaflet.js)
- Container: `rounded-[10px] border overflow-hidden` — 340px height
- Tiles: CartoDB Dark Matter `https://{s}.basemap.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Attribution: small, bottom-right, styled to match dark theme
- Markers:
  - Hyderabad HQ: `17.4399, 78.4983` — blue circle pulse (OFFLINE red ring)
  - Hitech Office: `17.4500, 78.3800` — blue circle
- Custom marker: 12px circle, blue fill, 3px white border, shadow
- Zoom: 7, scrollWheelZoom: false
- Map header: `"Live Location Map"` left + `● Active  ● Idle` legend right

---

### Gateway Status Grid
Section header: `"Gateway Status"  |  All Locations ▾  ──────  [↻ Refresh]`

3-column responsive grid (grid-cols-3 xl:grid-cols-4, gap-3).
Each gateway card — 160px min-height:
```
┌────────────────────────────────────┐
│ [⚙] AA:BB:CC:DD:EE:01  [OFFLINE]  │  ← MAC in IBM Plex Mono
│ Hyderabad Office                   │
│ Hitech Gateways · fw v3.0          │
│ ──────────────────────────────     │
│ 0 end nodes  0 streaming           │
│ Last: 5/25/2026 5:39 AM           │
└────────────────────────────────────┘
```
- DISCOVERED card: amber border + pulse dot + purple badge
- PROVISIONED card: emerald border + green badge
- OFFLINE card: default border + red badge
- Hover: border transitions to `var(--border-hover)` + subtle scale(1.01)

Mock data (9 gateways):
```js
[
  { mac:"CC:DD:EE:FF:00:01", loc:"Hyderabad Office", grp:"Hitech Campus", fw:"v3.0", nodes:0, status:"PROVISIONED" },
  { mac:"AA:BB:CC:DD:EE:01", loc:"Hyderabad Office", grp:"Hitech Gateways", fw:"v3.0", nodes:0, status:"OFFLINE" },
  { mac:"AA:BB:CC:DD:EE:02", loc:"Hyderabad HQ", grp:"Server Room Sensors", fw:"v3.0", nodes:0, status:"OFFLINE" },
  { mac:"AA:BB:CC:DD:EE:03", loc:"Hyderabad HQ", grp:"HQ Floor 4 Sensors", fw:"v3.0", nodes:0, status:"OFFLINE" },
  { mac:"AA:BB:CC:DD:EE:04", loc:"Hyderabad HQ", grp:"Hitech Env Sensors", fw:"v3.0", nodes:0, status:"OFFLINE" },
  { mac:"11:22:33:44:55:05", loc:"Hitech Office", grp:"Hitech Env Sensors", fw:"v3.0", nodes:0, status:"OFFLINE" },
  { mac:"88:A2:9E:1B:34:58", loc:"Hyderabad HQ", grp:"HQ Floor 4 Gateways", fw:"v3.0", nodes:0, status:"DISCOVERED" },
  { mac:"PIPRA_NODE_C3", loc:"Unknown", grp:"/", fw:"—", nodes:0, status:"OFFLINE" },
]
```

---

### End Nodes — Grouped Accordion

Section header: `"End Nodes  |  Location > Group > Gateway"  All Locations ▾`

**Location-level accordion** (collapsible, chevron toggles):
```
▼ Hyderabad HQ                                          [hide / 6 nodes]
  ┌──────────────────────────────────────────────────────────────┐
  │ ▸ HQ Floor 4 Gateways    [GATEWAYS badge]                   │
  │   └─ 88:A2:9E:1B:34:58  ⛔ Offline  fw v3.0  [DISCOVERED] │
  │        0 nodes · 0 streaming · last 5/25 4:55 PM            │
  │        "No end nodes discovered yet" (muted italic)          │
  ├──────────────────────────────────────────────────────────────┤
  │ ▸ Server Room Sensors    [SENSORS badge]                     │
  │   └─ 11:22:33:44:55:01  ⛔ Offline  fw v3.0  OFFLINE       │
  │   └─ 11:22:33:44:55:02  ⛔ Offline  fw v3.0  OFFLINE       │
  │   └─ 11:22:33:44:55:03  ⛔ Offline  fw v3.0  OFFLINE       │
  └──────────────────────────────────────────────────────────────┘

▼ Hitech Office                                         [hide / 4 nodes]
  ...same pattern
```

Node rows:
- MAC in IBM Plex Mono
- Status badge (small, outlined)
- fw version in muted mono
- "last seen" timestamp right-aligned in muted mono
- Hover: faint blue left-border slides in

---

## ════════════════════════════════════════════════════════
## PAGE 2: /organisation — MILLER COLUMN HIERARCHY
## ════════════════════════════════════════════════════════

**THIS IS THE KEY UX INNOVATION.** Gemini's research confirmed this.
Do NOT use stacked form sections. Use a 3-column Miller Column layout.

### Layout
```
Page Header:
🏢 Organisation Setup
Define your hierarchy: Organisation → Location → Group

┌──────────────────┬──────────────────┬──────────────────┐
│ COL 1            │ COL 2            │ COL 3            │
│ Organisations    │ Locations        │ Groups           │
│                  │ (unlocks when    │ (unlocks when    │
│                  │  org selected)   │  location        │
│                  │                  │  selected)       │
├──────────────────┼──────────────────┼──────────────────┤
│ [+ Add]          │ [+ Add Location] │ [+ Add Group]    │
│                  │                  │                  │
│ ● Pipra          │ ● Hyderabad HQ   │ ● HQ Floor 4     │
│   Solutions      │   2 groups       │   Gateways       │
│   2 locations    │                  │   GATEWAYS       │
│   ACTIVE ←       │ ● Hitech Office  │   fw v3.0        │
│                  │   2 groups       │   INTEGRATED     │
│ ● Acme Corp      │                  │                  │
│   1 location     │                  │ ● Server Room    │
│                  │                  │   Sensors        │
│                  │                  │   SENSORS        │
│                  │                  │   fw v3.0        │
│                  │                  │   INTEGRATED     │
└──────────────────┴──────────────────┴──────────────────┘
```

Column styles:
- Each column: `border-r border-[--border-subtle] overflow-y-auto h-[calc(100vh-200px)]`
- Column header: `px-4 py-3 border-b flex items-center justify-between sticky top-0`
  - bg: `var(--bg-surface)` backdrop-blur
- Items: clickable rows `px-4 py-3 cursor-pointer hover:bg-[--bg-hover]`
  - Selected item: `background:var(--bg-hover)` + blue left border + chevron `›` right

### Inline Add Forms (slide down when [+ Add] clicked)
Each column reveals an inline form that slides down (not a modal):
```
┌──────────────────────────────────┐
│ Add Organisation                 │
├──────────────────────────────────┤
│ ORGANISATION NAME *              │
│ [input]                          │
│                                  │
│ DESCRIPTION                      │
│ [textarea, 2 rows]               │
│                                  │
│ ADDRESS *                        │
│ [input]                          │
│                                  │
│ LATITUDE *      LONGITUDE *      │
│ [input]         [input]          │
│                                  │
│ CONTACT NAME    PHONE            │
│ [input]         [input]          │
│                                  │
│ EMAIL                            │
│ [input]                          │
│                                  │
│ YOUR NAME (AGENT)                │
│ [input]                          │
│                                  │
│ [Cancel]   [⊕ Add Organisation →]│
└──────────────────────────────────┘
```
Animation: `max-height` transition 0 → auto, 200ms ease.

### Group item detail (right-side expansion)
Clicking a Group in Col 3 expands a 4th panel (or bottom panel) showing:
```
Hitech Gateways
─────────────────────────────────
Group Type:    GATEWAYS
Status:        ACTIVE
Target FW:     v2.1
Max Capacity:  50 devices
AWS Policy:    PiEdgeSensorPolicy
AWS Status:    PENDING
AWS Thing Grp: —
AWS ARN:       —

[Push to AWS IoT ▸]   [Edit ✏] [Delete 🗑]
```

---

## ════════════════════════════════════════════════════════
## PAGE 3: /rpi — RPI NODE GROUPS
## ════════════════════════════════════════════════════════

### Page Header
```
⇌ RPI Node Groups                                    [↻ Refresh]
Manage Raspberry Pi device groups and provision them to AWS IoT Core as Thing Groups.
```

### Waiting Room Banner (PRIORITY ZONE — top of page)
Full-width, amber-accented, visually dominant:
```
┌─────────────────────────────────────────────────────────────────────┐
│ ⚡ Waiting Room: Newly Connected Devices              [↻ Refresh]  │
│ These RPIs have checked in and are waiting for production promotion.│
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐   │
│ │ [●] 88:A2:9E:1B:34:58          [DISCOVERED ●]               │   │
│ │     First Seen: 3/25/2026, 3:34:29 PM (font-mono, muted)    │   │
│ │                                                              │   │
│ │ [Select Organisation ▾] [Select Location ▾]                 │   │
│ │ [Select Location Group ▾]                                   │   │
│ │                                                              │   │
│ │                              [Register →]                   │   │
│ └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```
- Banner border: `2px solid rgba(245,158,11,0.30)`
- Banner bg: `rgba(245,158,11,0.04)`
- DISCOVERED badge: purple with pulse animation
- Register button: blue, full border-radius pill shape

### AWS IoT Status Bar
```
✅ AWS IoT Core Connected
   Endpoint: aojggxiqsh1w7-ats.iot.ap-south-1.amazonaws.com  (font-mono)
```
- bg: `rgba(16,185,129,0.06)` + green border
- Endpoint in IBM Plex Mono, selectable text

### KPI Row (3 cards)
| ⇌ 6  TOTAL GROUPS | ✅ 2  AWS INTEGRATED | ⚡ 4  AWAITING |
Blue / Green / Amber left-border accent

### Filter Tabs + Table
Tabs: `[All Groups]  [AWS Integrated]  [Pending]`
Active: `bg-[--brand] text-white rounded-md`

Table columns: GROUP NAME | DESCRIPTION | AWS THING GROUP | AWS ARN | STATUS | ACTION

```
Hitech Gateways      Gateway cluster…   —    —    PENDING     [Push to AWS IoT ▸] [🗑]
Hitech Env Sensors   Env monitoring…    —    —    PENDING     [Push to AWS IoT ▸] [🗑]
Acme Line A Sensors  Conveyor A…        —    —    PENDING     [Push to AWS IoT ▸] [🗑]
Acme Plant Gateways  Acme plant RPI…    —    —    PENDING     [Push to AWS IoT ▸] [🗑]
HQ Floor 4 Gateways  RPI on Floor 4     PLEDGE_…  arn:aws:…   INTEGRATED  [⟳ Synced] [View Devices] [🗑]
Server Room Sensors  Temp & humidity…   PLEDGE_…  arn:aws:…   INTEGRATED  [⟳ Synced] [View Devices] [🗑]
```

"Push to AWS IoT" click behavior:
1. Button shows spinner + "Pushing..." for 1500ms
2. Row status changes PENDING → INTEGRATED
3. AWS Thing Group and ARN fields populate with mock values
4. Toast: ✅ "Group pushed to AWS IoT Core successfully"

"View Devices" → opens RightDrawer:
```
Drawer Header: "HQ Floor 4 Gateways"  [PLEDGE_GROUP_1_HQ_FLOOR_4_GATEWAYS — amber tag]
Table: MAC | STATUS | LOCATION | ORG | REGISTERED AT | ACTIONS
Row: 88:A2:9E:1B:34:58 | DISCOVERED | Hyderabad HQ | Pipra Solutions | 5/25/2026 | [Deregister] [Push Script]
```

---

## ════════════════════════════════════════════════════════
## PAGE 4: /fleet — FLEET OTA & STATUS
## ════════════════════════════════════════════════════════

### Page Header
```
🖥 Fleet OTA & Status
Global view of your hardware fleet. Managed via AWS IoT Core orchestration.
                               [⚡ Global Metrics]  [↻ Refresh]
```

"Global Metrics" button: outlined amber, opens a mini modal with fleet-wide
aggregates (total devices, avg uptime, OTA success rate — all mock).

### Fleet Distribution Card (centered, prominent)
```
┌────────────────────────────────────────────┐
│          FLEET DISTRIBUTION                │
│                                            │
│   5 PiEDGE Nodes    │    8 General IoT    │
│   (click → filter)  │    (click → filter) │
└────────────────────────────────────────────┘
```
Background: `var(--bg-surface)` + border + centered, max-w-lg

### Tab Bar
`[⇌ PiEDGE Devices (5)]  [📡 General IoT (8)]`

### PiEDGE Devices Table

Columns: IDENTITY | THING NAME | STATUS | CPU | RAM | MAINTENANCE | LAST SEEN | ACTIONS

```
CC:DD:EE:FF:00:01    —    PROVISIONED   [██░░] 0%  [█░░░] 0%  —  5/25 4:40AM  [⚡][⏱][↑ OTA]
AA:BB:CC:DD:EE:01    —    OFFLINE       [░░░░] 0%  [░░░░] 0%  —  5/25 5:40AM  [⚡][⏱][↑ OTA]
AA:BB:CC:DD:EE:02    —    OFFLINE       [░░░░] 0%  [░░░░] 0%  —  5/25 5:38AM  [⚡][⏱][↑ OTA]
AA:BB:CC:DD:EE:03    —    OFFLINE       [░░░░] 0%  [░░░░] 0%  —  5/25 5:35AM  [⚡][⏱][↑ OTA]
88:A2:9E:1B:34:58  88:A2… DISCOVERED    [░░░░] 0%  [░░░░] 0%  —  5/25 4:58PM  [⚡][⏱][↑ OTA]
```

CPU/RAM micro-progress bars:
- Width: 64px, height: 6px, rounded-full
- Track: `var(--border-default)`, Fill: emerald if < 60%, amber if < 85%, red if ≥ 85%

Action icons:
- ⚡ (amber) — Ping / run diagnostics. Click: spinner 1s → toast "Ping sent"
- ⏱ (muted) — View OTA job history drawer
- [↑ OTA Update] — Blue text + upload icon → opens OTA Modal

### OTA Update Modal
```
┌──────────────────────────────────────────────────┐
│  🔼 Push OTA Update                   [✕]       │
├──────────────────────────────────────────────────┤
│  Target Device                                   │
│  AA:BB:CC:DD:EE:01  ·  PiEDGE Node  ·  OFFLINE  │
│                                                  │
│  Firmware Version                                │
│  [v3.1 — Latest (2026-05-20) ▾]                 │
│                                                  │
│  Deployment Schedule                             │
│  ○ Immediate                                     │
│  ○ Next maintenance window                       │
│  ○ Scheduled time: [date-time input]            │
│                                                  │
│  Release Notes (v3.1)                            │
│  ┌──────────────────────────────────────────┐   │
│  │ - BLE scan interval optimized            │   │
│  │ - Memory leak fix in MQTT handler        │   │
│  │ - Added NRF52 auto-pair                  │   │
│  └──────────────────────────────────────────┘   │
├──────────────────────────────────────────────────┤
│  [Cancel]                    [Push OTA Job →]   │
└──────────────────────────────────────────────────┘
```

### General IoT Tab
Same layout but showing the 8 BLE sensors.
Columns: SENSOR | MAC | CATEGORY | GATEWAY | STATUS | LAST SEEN | ACTIONS

---

## ════════════════════════════════════════════════════════
## PAGE 5: /iot — IOT SENSORS FLEET
## ════════════════════════════════════════════════════════

### Page Header
```
⚙ IoT Sensors
Provision and manage BLE sensors via Raspberry Pi orchestrators.
                                    [↻ Refresh]  [+ Register Sensor]
```

### KPI Strip (4 cards)
```
TOTAL SENSORS: 8 (blue)  |  HEALTHY/ACTIVE: 0 (green)  |  SUCCESS RATE: —  |  OFFLINE: 8 (red)
```

### Filter Bar
```
[🔍 Search by name or MAC...] [All Types ▾] [All Gateways ▾] [Status ▾]
```
All filters functionally wire to the table below (filter by displayed rows).

### Sensors Table

Columns: SENSOR | TYPE | GATEWAY (RPI) | STATUS | TIME SLOT | LAST SEEN | ACTIONS

```
⚙ Server Room Temp 1         ESP32 / TEMPERATURE  ⇌ AA:BB:..01  OFFLINE  —  5/25 5:39AM  [🗑]
  11:22:33:44:55:01 ← mono

⚙ Server Room Humidity       ESP32 / HUMIDITY     ⇌ AA:BB:..01  OFFLINE  —  5/25 5:38AM  [🗑]
  11:22:33:44:55:02

⚙ Corridor Motion 1          NRF52 / MOTION       ⇌ AA:BB:..01  OFFLINE  —  5/25 5:32AM  [🗑]
  11:22:33:44:55:03

⚙ Hitech Env Node 1          ESP32 / MULTI        ⇌ AA:BB:..02  OFFLINE  —  5/25 5:37AM  [🗑]
  11:22:33:44:55:04

⚙ Hitech Env Node 2          ESP32 / TEMPERATURE  ⇌ AA:BB:..02  OFFLINE  —  5/25 5:25AM  [🗑]
  11:22:33:44:55:05

⚙ Acme Line A Vibration 1    NRF52 / MULTI        ⇌ AA:BB:..03  OFFLINE  —  5/25 5:39AM  [🗑]
  11:22:33:44:55:06

⚙ Acme Line A Vibration 2    NRF52 / MULTI        ⇌ AA:BB:..03  OFFLINE  —  5/25 5:39AM  [🗑]
  11:22:33:44:55:07

⚙ PIPRA_NODE_C3               /                   ⇌ Unknown     OFFLINE  —  5/25 2:57PM  [🗑]
  PIPRA_NODE_C3
```

TYPE badge colors:
- TEMPERATURE → `border-blue-500/30 text-blue-400`
- HUMIDITY    → `border-cyan-500/30 text-cyan-400`
- MOTION      → `border-purple-500/30 text-purple-400`
- MULTI       → `border-amber-500/30 text-amber-400`
- / (unknown) → `border-zinc-500/30 text-zinc-500`

Row click → Expand inline details panel (smooth height animation):
```
┌─ SENSOR DETAILS — Server Room Temp 1 ──────────────────────┐
│ Unique ID:     11:22:33:44:55:01     Parent RPI: AA:BB:..01 │
│ Category:      Temperature           Node Type:  ESP32       │
│ Organisation:  Pipra Solutions       Location:   Hyderabad HQ│
│ Group:         Server Room Sensors   Time Slot:  12:00–12:15 │
│ Temp Route:    —                     Humid Route: —           │
│ Firmware:      v3.0                  Last Seen:  5/25 5:39AM │
└────────────────────────────────────────────────────────────  ┘
```

### Register Sensor Drawer (Right side, 480px)

Opens with slideInRight animation when "+ Register Sensor" clicked.

```
DRAWER HEADER:
[⚙] Register IoT Sensor                              [✕]
─────────────────────────────────────────────────────────

SECTION: IDENTITY
  SENSOR UNIQUE NAME *          → placeholder: PIPRA_NODE_01 (font-mono)
  SENSOR DISPLAY NAME           → placeholder: Server Room Temp 1

SECTION DIVIDER: ── ASSIGNMENT ──

  ORGANISATION                  → [Select Organisation ▾]
  LOCATION                      → [Select Location ▾] (cascades from org)
  GROUP                         → [Select Group ▾] (cascades from location)
  PARENT RPI (GATEWAY)          → [Select RPi ▾]

SECTION DIVIDER: ── HARDWARE CONFIG ──

  REPORTING TIME SLOT           → [12:00 PM – 12:15 PM ▾]
    (15-min windows, 00:00–23:45, full list)
  CATEGORY                      → [Multi-Sensor / Temperature / Humidity / Motion / Vibration]
  NODE TYPE                     → [ESP32 (BLE + WiFi) / NRF52 (BLE) / ESP32-S3 / Custom]

SECTION DIVIDER: ── ROUTING (OPTIONAL) ──

  TEMPERATURE ROUTING URL       → [http://... placeholder]
  HUMIDITY ROUTING URL          → [http://... placeholder]

SECTION DIVIDER: ── FIRMWARE ──

  DRAG & DROP ZONE:
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │  ↑  Drop firmware binary here                      │
  │     .bin files only · Max 16MB                     │
  │     or click to browse                             │
  │                                                     │
  └─────────────────────────────────────────────────────┘
  Border: 2px dashed var(--border-default)
  Hover: border-color var(--brand), bg rgba(37,99,235,0.05)

DRAWER FOOTER:
[Cancel]                        [Register & Provision →]
```

On "Register & Provision":
1. Validate required fields → show inline field errors if empty
2. Button shows spinner 1500ms
3. New sensor added to table
4. Drawer closes with reverse slide animation
5. Toast: ✅ "Sensor registered and provisioned successfully"

---

## ════════════════════════════════════════════════════════
## SECTION 4: GLOBAL INTERACTIVE FEATURES
## ════════════════════════════════════════════════════════

### Delete Confirmation Dialog (centered modal)
```
┌─────────────────────────────────────────────┐
│  ⚠ Remove Sensor?                          │
│                                             │
│  "Server Room Temp 1" will be removed from │
│  the fleet. This cannot be undone.          │
│                                             │
│  [Cancel]              [Remove Device]      │
└─────────────────────────────────────────────┘
```
"Remove Device" button: `bg-red-500/10 text-red-400 border border-red-500/20`

### Command Palette (⌘K)
Triggered by: keyboard shortcut OR clicking the search pill in topbar.

```
┌─────────────────────────────────────────────────────┐
│  [🔍 Search or jump to...]                         │
├─────────────────────────────────────────────────────┤
│  QUICK ACTIONS                                      │
│  ⚡ Register new sensor                             │
│  ⚡ Push OTA to fleet                               │
│  ⚡ View offline devices                            │
│  ⚡ Add new organisation                            │
│                                                     │
│  NAVIGATION                                         │
│  → Overview                                         │
│  → RPI Node Groups                                  │
│  → Fleet OTA & Status                               │
│  → IoT Sensors                                      │
└─────────────────────────────────────────────────────┘
```

### Toast System (top-right stack)
```
✅ Success: green left-bar
❌ Error:   red left-bar
ℹ Info:    blue left-bar
⚠ Warning: amber left-bar
```
All toasts: appear top-4 right-4, slideInRight 200ms, auto-dismiss 3s, stackable.

### Notification Bell Dropdown
```
┌────────────────────────────────────────────┐
│  Notifications                    [✓ All] │
├────────────────────────────────────────────┤
│ 🔴 8 sensors offline > 6 hours   [2m ago] │
│ 🟣 New device: 88:A2:9E:1B:34:58 [1h ago] │
│ 🟡 OTA available for 3 devices   [3h ago] │
└────────────────────────────────────────────┘
```

---

## ════════════════════════════════════════════════════════
## SECTION 5: COMPLETE MOCK DATA
## ════════════════════════════════════════════════════════

```typescript
// data/mockData.ts

export const ORGS = [
  { id:"org_1", name:"Pipra Solutions", agent:"Satyendra Singh", locCount:2,
    address:"4th floor, Ruby Block, Fairmount Square, 413 & 414, Brundavan Colony, Kompally, Hyderabad, Telangana 500100",
    lat:17.4399, lng:78.4983, email:"admin@pipra.io" },
  { id:"org_2", name:"Acme Corporation", agent:"John", locCount:1,
    address:"Acme Corporation, Industrial Park, Chennai",
    lat:13.0827, lng:80.2707, email:"john@acme.com" },
]

export const LOCATIONS = [
  { id:"loc_1", orgId:"org_1", name:"Hyderabad HQ", address:"Kompally, Hyderabad", lat:17.4399, lng:78.4983, poc:"Satyendra Singh" },
  { id:"loc_2", orgId:"org_1", name:"Hitech Office", address:"Hitech City, Hyderabad", lat:17.4504, lng:78.3808, poc:"Rupesh" },
  { id:"loc_3", orgId:"org_2", name:"Acme Plant", address:"Industrial Park, Chennai", lat:13.0827, lng:80.2707, poc:"John" },
]

export const GROUPS = [
  { id:"grp_1", locId:"loc_1", name:"HQ Floor 4 Gateways", desc:"RPI gateways on Floor 4", type:"GATEWAYS", status:"ACTIVE", fw:"v3.0", cap:50, awsPolicy:"PiEdgeSensorPolicy", awsThingGroup:"PLEDGE_Group_1_HQ_FLOOR_4_GATEWAYS", awsArn:"arn:aws:iot:ap-south-1:123456:thinggroup/PLEDGE_Group_1", awsStatus:"INTEGRATED" },
  { id:"grp_2", locId:"loc_1", name:"Server Room Sensors", desc:"Temp & humidity in server room", type:"SENSORS", status:"ACTIVE", fw:"v3.0", cap:30, awsPolicy:"PiEdgeSensorPolicy", awsThingGroup:"PLEDGE_Group_3_Server_Room_Sensors", awsArn:"arn:aws:iot:ap-south-1:123456:thinggroup/PLEDGE_Group_3", awsStatus:"INTEGRATED" },
  { id:"grp_3", locId:"loc_2", name:"Hitech Gateways", desc:"Gateway cluster at Hitech campus", type:"GATEWAYS", status:"ACTIVE", fw:"v2.1", cap:50, awsStatus:"PENDING" },
  { id:"grp_4", locId:"loc_2", name:"Hitech Env Sensors", desc:"Environment monitoring at Hitech", type:"SENSORS", status:"ACTIVE", fw:"v3.0", cap:30, awsStatus:"PENDING" },
  { id:"grp_5", locId:"loc_3", name:"Acme Line A Sensors", desc:"Conveyor line A sensor cluster", type:"SENSORS", status:"ACTIVE", fw:"v3.0", awsStatus:"PENDING" },
  { id:"grp_6", locId:"loc_3", name:"Acme Plant Gateways", desc:"Acme plant RPI gateway cluster", type:"GATEWAYS", status:"ACTIVE", fw:"v3.0", awsStatus:"PENDING" },
]

export const RPIS = [
  { mac:"CC:DD:EE:FF:00:01", thingName:null, grpId:"grp_1", status:"PROVISIONED", cpu:0, ram:0, fw:"v3.0", lastSeen:"2026-05-25T04:40:27" },
  { mac:"AA:BB:CC:DD:EE:01", thingName:null, grpId:"grp_2", status:"OFFLINE",     cpu:0, ram:0, fw:"v3.0", lastSeen:"2026-05-25T05:40:27" },
  { mac:"AA:BB:CC:DD:EE:02", thingName:null, grpId:"grp_3", status:"OFFLINE",     cpu:0, ram:0, fw:"v2.1", lastSeen:"2026-05-25T05:38:27" },
  { mac:"AA:BB:CC:DD:EE:03", thingName:null, grpId:"grp_5", status:"OFFLINE",     cpu:0, ram:0, fw:"v3.0", lastSeen:"2026-05-25T05:35:27" },
  { mac:"88:A2:9E:1B:34:58", thingName:"88:A2:9E:1B:34:58", grpId:"grp_1", status:"DISCOVERED", cpu:0, ram:0, fw:"v3.0", lastSeen:"2026-05-25T16:58:00", firstSeen:"2026-05-25T15:34:29" },
]

export const SENSORS = [
  { id:"s1", uid:"11:22:33:44:55:01", name:"Server Room Temp 1", cat:"Temperature", type:"ESP32", rpi:"AA:BB:CC:DD:EE:01", grpId:"grp_2", status:"OFFLINE", slot:"12:00–12:15", fw:"v3.0", lastSeen:"2026-05-25T05:39:27" },
  { id:"s2", uid:"11:22:33:44:55:02", name:"Server Room Humidity", cat:"Humidity", type:"ESP32", rpi:"AA:BB:CC:DD:EE:01", grpId:"grp_2", status:"OFFLINE", slot:"12:00–12:15", fw:"v3.0", lastSeen:"2026-05-25T05:38:27" },
  { id:"s3", uid:"11:22:33:44:55:03", name:"Corridor Motion 1", cat:"Motion", type:"NRF52", rpi:"AA:BB:CC:DD:EE:01", grpId:"grp_2", status:"OFFLINE", slot:"12:15–12:30", fw:"v3.0", lastSeen:"2026-05-25T05:32:27" },
  { id:"s4", uid:"11:22:33:44:55:04", name:"Hitech Env Node 1", cat:"Multi", type:"ESP32", rpi:"AA:BB:CC:DD:EE:02", grpId:"grp_4", status:"OFFLINE", slot:"12:30–12:45", fw:"v3.0", lastSeen:"2026-05-25T05:37:27" },
  { id:"s5", uid:"11:22:33:44:55:05", name:"Hitech Env Node 2", cat:"Temperature", type:"ESP32", rpi:"AA:BB:CC:DD:EE:02", grpId:"grp_4", status:"OFFLINE", slot:"12:45–13:00", fw:"v3.0", lastSeen:"2026-05-25T05:25:27" },
  { id:"s6", uid:"11:22:33:44:55:06", name:"Acme Line A Vibration 1", cat:"Multi", type:"NRF52", rpi:"AA:BB:CC:DD:EE:03", grpId:"grp_5", status:"OFFLINE", slot:"13:00–13:15", fw:"v3.0", lastSeen:"2026-05-25T05:39:57" },
  { id:"s7", uid:"11:22:33:44:55:07", name:"Acme Line A Vibration 2", cat:"Multi", type:"NRF52", rpi:"AA:BB:CC:DD:EE:03", grpId:"grp_5", status:"OFFLINE", slot:"13:15–13:30", fw:"v3.0", lastSeen:"2026-05-25T05:39:42" },
  { id:"s8", uid:"PIPRA_NODE_C3", name:"PIPRA_NODE_C3", cat:"Unknown", type:"Unknown", rpi:"Unknown", grpId:null, status:"OFFLINE", slot:null, fw:"—", lastSeen:"2026-05-25T14:57:50" },
]

export const NOTIFICATIONS = [
  { id:"n1", type:"error",   msg:"8 sensors offline > 6 hours", time:"2m ago" },
  { id:"n2", type:"disc",    msg:"New device: 88:A2:9E:1B:34:58 discovered", time:"1h ago" },
  { id:"n3", type:"warning", msg:"OTA update available for 3 devices", time:"3h ago" },
]
```

---

## ════════════════════════════════════════════════════════
## SECTION 6: BUILD SEQUENCE INSTRUCTIONS
## ════════════════════════════════════════════════════════

Build in this exact order. Each step must be complete before next:

**STEP 1 — Foundation**
- Set up React Router v6 with all 5 routes
- Create CSS variables in index.css (all tokens from Section 1.1)
- Load Google Fonts (DM Mono + IBM Plex Sans + IBM Plex Mono)
- Build: AppShell (Topbar + Sidebar + content area)
- Build: Shared components (StatusBadge, MetricCard, Toast system)

**STEP 2 — Overview Page**
- Build KPI strip (4 MetricCards with count-up animation)
- Integrate Leaflet map with CartoDB dark tiles + custom markers
- Build Gateway Status Grid with all states
- Build End Nodes accordion

**STEP 3 — Organisation (Miller Columns)**
- Build 3-column layout with individual scroll
- Column selection state with blue left-border highlight
- Inline add forms (slide-down height animation)
- Wire cascading column data (org→loc→group)

**STEP 4 — RPI Node Groups**
- Waiting Room amber banner
- AWS status bar
- Groups table with Push to AWS simulation
- View Devices right-side drawer

**STEP 5 — Fleet OTA**
- PiEDGE / General IoT tabs
- CPU/RAM micro-progress bars
- OTA Update modal
- Simulated push flow

**STEP 6 — IoT Sensors**
- Filter bar (search + dropdowns, functionally wired)
- Sensors table with expandable row details
- Register Sensor right drawer with all fields
- Firmware drag & drop zone

**STEP 7 — Polish**
- Command Palette (⌘K)
- Notification bell dropdown
- Delete confirm dialog
- All loading/spinner states
- All toast notifications wired

---

## ABSOLUTE RULES (NEVER VIOLATE)

1. ALL MAC addresses, device IDs, ARNs, timestamps, firmware versions,
   routing URLs → `font-family: 'IBM Plex Mono'` — no exceptions.

2. NEVER use flat solid-fill status badges (red/green boxes).
   Always use the low-opacity bg + vivid text + subtle border pattern.

3. NEVER use standard centered modal dialogs for forms.
   Register Sensor = right-side drawer. Organisation = inline Miller Columns.

4. ALL interactive state changes must have visible loading feedback
   (spinner, disabled state, progress). The 300ms feedback rule.

5. NEVER use plain `border-radius: 4px` everywhere. Use the geometry scale:
   cards=10px, modals=12px, inputs=7px, badges=999px (full pill).

6. The Sidebar navigation MUST have section labels (INFRASTRUCTURE / FLEET / IOT)
   in tiny uppercase monospaced tracking-widest text-muted.

7. Keep mock state ACTIVE. All buttons must DO something visible — no dead CTAs.

8. Table rows must be clickable/hoverable. Hover bg = `var(--bg-hover)` 150ms.

---

## DELIVERABLE

A single `App.tsx` that is fully self-contained with React + Tailwind.
Must render immediately with zero external API dependencies.
Must look like a $100k enterprise IoT product, not a bootstrap admin template.

The single benchmark question: **"Would Vercel ship this?"**
If yes → submit. If not → refine.

---
*Antigravity Prompt v2.0 — Synthesized by Anudeep Thota / Forge Studio*
*Reference: 10 WMS screenshots + Gemini UX research + Senior design system*
*Build target: Antigravity Vibe Coding · Stack: React+TS+Tailwind+Leaflet*
