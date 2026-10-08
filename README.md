# 🎬 SceneBox — "The moment you want. Not the whole movie."

> **Scene-First Video Streaming Web Application Prototype**  
> Built strictly with **HTML5, CSS3, Vanilla JavaScript, and LocalStorage**. Zero backend or third-party framework dependencies.

---

## 🌟 1. Project Concept & Vision

Traditional video platforms (Netflix, Prime, Disney+) force users to pick an entire two-hour movie, press play, and fast-forward to find the memorable moment they actually crave.

**SceneBox flips the streaming model upside down:**
- **Moment-First Discovery:** Instead of *"What movie do you want to watch?"*, SceneBox asks: *"What moment do you want to experience?"*
- **Scene DNA Profiling:** Every highlight is profiled across 5 biometric dimensions: **Intensity, Emotion, Humor, Action, and Romance**.
- **Instant Gratification:** One-click playback, scene bookmarking, custom playlist curation, and smart keyword combinations (e.g. *"funny fight"*, *"emotional ending"*).

---

## 🚀 2. Technology Stack

- **Markup:** Semantic HTML5
- **Styling:** Custom Vanilla CSS3 (Cinematic dark theme, CSS grid, flexbox, glassmorphic surfaces, keyframe animations)
- **Scripting:** Modular Vanilla JavaScript (ES6+)
- **Persistence:** Browser `localStorage` with JSON serialization & relational structures
- **Zero Dependencies:** No React, Node.js, Express, MongoDB, Firebase, or external API keys needed. Works right out of the box in any modern browser!

---

## 📂 3. Architecture & File Structure

```
SceneBox/
│
├── index.html              # Cinematic landing page with Hero, Mood Categories & Trending
├── explore.html            # Discovery hub: Recommended, Trending, Categories & Recent
├── search.html             # Smart Search & Multi-facet Scene DNA filter engine
├── player.html             # Dedicated Player with HTML5 video, fallback, DNA meters & actions
├── watch-later.html        # Dedicated Watch Later queue management
├── history.html            # Complete timestamped playback history & clearing
├── playlists.html          # Custom playlist management (Create, Rename, Add/Remove, Delete)
├── profile.html            # User dashboard with personal metrics and tabbed collections
├── login.html              # Member login interface with demo autofill
├── register.html           # New user onboarding with strict form validation
│
├── admin/
│   ├── login.html          # Dedicated staff authentication portal
│   ├── dashboard.html      # Platform telemetry, active user counts, and quick actions
│   ├── users.html          # Member inspection with live Active/Offline badges & timelines
│   ├── scenes.html         # Full CRUD interface (Add/Edit modals with Scene DNA sliders)
│   ├── activity.html       # Platform audit log with user action icons & search filters
│   ├── analytics.html      # CSS-based bar visualizations for views, categories, and likes
│   ├── profile.html        # Super admin settings and one-click demo data reset
│   └── admin.js            # Admin controller & metrics engine
│
├── css/
│   ├── style.css           # Core cinematic design system, cards, player, and animations
│   ├── auth.css            # Authentication cards, inputs, and demo helpers
│   └── admin.css           # Admin sidebar layout, stat cards, tables, and charts
│
├── js/
│   ├── data.js             # Initial seed dataset: 28+ cinematic scenes, users & logs
│   ├── storage.js          # Unified LocalStorage persistence & CRUD manager
│   ├── auth.js             # User & Admin authentication + frontend route protection
│   ├── navigation.js       # Dynamic navbar, user menu, mobile drawer, toasts & modals
│   ├── scenes.js           # Scene cards generator, DNA meters & recommendation engine
│   ├── player.js           # HTML5 video playback, fallback visualizer, actions & related
│   ├── search.js           # Smart query parser, keyword combos ("funny fight") & facets
│   ├── playlists.js        # Playlist manager (create, rename, delete, add scene)
│   ├── user.js             # User profile metrics, watch later & history views
│   └── activity.js         # User action telemetry logger & formatting helpers
│
└── README.md               # Complete project documentation and viva guide
```

---

## 🔑 4. Demo Credentials

### 🛡️ Administrator Portal (`/admin/login.html`)
- **Email:** `admin@scenebox.com`
- **Password:** `Admin@123`
- *Features:* View live dashboard, manage users, create/edit/delete scenes, view audit logs, view analytics charts, and reset data.

### 👤 Demo Member Account (`/login.html`)
- **Email:** `rahul@demo.com`
- **Password:** `Password@123`
- *Pre-seeded with:* Liked scenes, Watch Later items, Playlists ("My Favorite Fights", "Epic Climax Moments"), and Watch History.

*(You can also register any new account on `/register.html`)*

---

## 🧬 5. Key Features & How They Work

### 1. Scene DNA
Every scene features an interactive biometric radar:
- **Intensity:** Speed, threat level, volume, pacing
- **Emotion:** Heartstrings, tears, stakes, poignant farewells
- **Humor:** Slapstick, comedic timing, witty banter
- **Action:** Choreography, stunts, battles, car chases
- **Romance:** Tender moments, confessions, rooftop kisses

### 2. Smart Query Combinations
In `/search.html`, the search engine decomposes composite multi-word intents:
- `"funny fight"` → Matches scenes with high Humor DNA + Action category/tags (e.g., *Rival Chefs Kitchen Showdown*, *The Drunk Wizard Duel*).
- `"emotional ending"` → Matches high Emotion scenes with ending/farewell tags (e.g., *The Hospital Heartbeat Monitor*, *The Letter from Tomorrow*).
- `"best villain dialogue"` → Matches Iconic Dialogue with villain/dark archetypes (e.g., *The Villains Last Toast*).

### 3. Graceful Player Fallback
When a network connection is offline or a browser blocks video streaming via CORS, the player automatically switches to a high-contrast **HTML5 Canvas Visualizer** with simulated audio waveforms and scene typography rather than showing a broken black box.

### 4. Admin Scene CRUD
Administrators can:
1. **Create Scenes:** Provide title, movie source, category, duration, rating, URLs, description, tags, and adjust **live interactive sliders** for all 5 Scene DNA parameters.
2. **Edit Scenes:** Pre-load existing scene data into the modal and update any attribute.
3. **Delete Scenes:** Permanent removal with interactive confirmation modal and automatic cascade cleanup across user playlists and watch queues.

---

## 💡 6. College Viva / Interview Guide

When presenting SceneBox, highlight these design decisions:
1. **Why LocalStorage with Relational Structure?**  
   We separated storage entities into distinct tables (`scenebox_scenes`, `scenebox_users`, `scenebox_likes`, `scenebox_playlists`, `scenebox_activityLogs`) mapped via unique foreign keys (`userId`, `sceneId`), mimicking a normalized SQL database entirely within client-side memory.
2. **Client-Side Recommendation Logic:**  
   The recommendation algorithm extracts category frequencies and tag overlap vectors from the user's historical views and likes, scoring candidate scenes without requiring heavy server-side machine learning.
3. **Frontend Route Protection:**  
   Guards check session state (`Auth.isUserLoggedIn()` / `Auth.isAdminLoggedIn()`) on protected pages (`profile.html`, `playlists.html`, `admin/*`) and preserve `returnUrl` parameters to seamlessly redirect users after authentication.
"# Scenebox" 
