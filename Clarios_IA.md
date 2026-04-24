# CLARIOS
## Information Architecture
**Version 1.0 · April 2026**

---

## 1. App Structure

| Area | Purpose | Access |
|---|---|---|
| Home | Entry point. Launch new session, resume existing one, view past spaces. | App open |
| New Session | Starts the full description → capture → analysis → guided flow. | Home screen CTA |
| Space History | All completed and saved sessions. | Home nav |
| Settings | Voice preferences, display options, notification preferences. | Home nav |
| Profile | Account details, sign-out. | Home nav |

---

## 2. Authentication Flow *(First Launch Only)*

**Screen: Welcome**
- App logo and one-line value proposition
- Two options: Sign in with Google / Sign in with Apple
- No email/password option

**Screen: Permissions**
- Camera access (required)
- Microphone access (required for voice mode)
- Notifications (optional, skippable)

After permissions, user lands on Home. Authentication is not repeated on subsequent opens.

---

## 3. New Session Flow

---

### STEP 1 — SPACE DESCRIPTION *(Optional)*

**Screen: Before we look...**

- Skip button is the most prominent element: single tap goes directly to Capture
- Input method toggle at the top: Type / Speak

**Type mode fields** *(all optional):*
- Space type — pill selector: Bedroom / Living Room / Home Office / Kitchen / Study / Other
- Goal — free text: *"What do you want to achieve?"*
- Mode preference — pills: Tidy / Restructure / AI decides (default)

**Speak mode:**
- Microphone button replaces text fields
- User taps and speaks freely: *"This is my bedroom, I want more space to work"*
- Transcript displayed for review after speaking
- User can edit transcript or re-record before proceeding
- Same data extracted as type mode

**CTA:** "Capture my space" — signals this is preparation, not a detour

---

### STEP 2 — CAPTURE

**Screen: Capture**

- Camera viewfinder opens immediately
- If description was completed: a "Context set: [space type]" indicator shown at top of viewfinder — confirms context carried through
- If description was skipped: no indicator shown
- Capture options: Photo / Multi / Scan (toggle at bottom)
- Retake available before proceeding — no import option

**Scan mode state:**
- Slow pan guidance: *"Move slowly around your room. Keep the camera steady."*
- Progress percentage shown as user pans
- Animated dot map builds as scan progresses
- Pause option available

---

### STEP 3 — ANALYSIS

**Screen: Analysing**
- Loading state: calm copy *"Looking at your space…"*
- No progress percentage — unpredictable wait creates anxiety

**Screen: Analysis Result**

- Annotated photo: items and areas circled and labelled inline
- If description was completed: "Confirmed from your description" row shown — displays space type and goal as pills, confirming the AI received and used the context
- Plain-language findings list (3–4 items, colour-coded by severity/type)
- Mode recommendation card with rationale personalised to user's goal where available
- If AI recommendation differs from user's mode preference: explanation shown inline
- User confirms or overrides mode directly on this screen
- No separate mode confirmation screen — this is the only decision point

---

### STEP 4A — GUIDED EXECUTION (TIDY MODE)

**Screen: Text or Voice Selection** *(shown once per session)*
- Two cards: "Read the steps" (Text Mode) / "Talk me through it" (Voice Mode)
- Switchable mid-session from any step card

---

**Screen: Step Card — Text Mode**

| Element | Detail |
|---|---|
| Step indicator | "Step 2 of 6" — top left |
| Progress bar | Top of screen, below status bar |
| Step title | Large single instruction |
| Image | Zoomed/cropped photo of the active area only (~80% of card height) |
| Highlight | Calm-colored ring around the target item/area |
| Time estimate | Shown below title |
| Substeps | Collapsed by default, expandable |
| Primary CTA | "Done" — advances to next step |
| Secondary actions | Skip this step / Go back / Switch to voice |

---

**Screen: Step Card — Voice Mode**

| Element | Detail |
|---|---|
| Zoomed image | Upper ~60% of screen — cropped to active area only |
| Highlight | Calm-colored ring around the target item/area |
| Spoken instruction | Auto-plays on screen load |
| Transcript | Shown below image — no substeps visible |
| Time estimate | Not shown in voice mode |
| Voice commands | "Done" / "Next" / "Repeat" / "Go back" |
| Fallback | Tap-to-speak button always visible |
| Interaction | Full hands-free supported — user can look away or turn screen off |

---

**Screen: Session Complete — Tidy**
- Calm completion moment
- Steps completed and time taken
- Save to Space History CTA
- No before/after comparison — not applicable to Tidy Mode

---

### STEP 4B — GUIDED EXECUTION (RESTRUCTURE MODE)

**Screen: Generating Layout**
- Loading state while Gemini 2.0 Flash processes the photo and generates the layout diagram
- Calm copy: *"Mapping your space…"*

---

**Screen: Before / After Diagram**
- Top-down SVG diagram: current arrangement (left panel) vs. suggested arrangement (right panel)
- Furniture represented as labelled blocks
- Key changes annotated (e.g. "Desk → north wall")
- User must confirm this screen before steps begin — steps never start without diagram review
- Two actions: "Request alternative" / "Accept plan"
- Requesting alternative re-runs the layout generation with a variation prompt

---

**Screen: Step Card — Restructure**

| Element | Detail |
|---|---|
| Step indicator | "Step 1 of 5" — top left |
| Progress bar | Top of screen |
| Step title | Single task-oriented instruction |
| Image | Zoomed/cropped photo of the furniture piece being moved |
| Directional indicator | Arrow or highlight showing destination position |
| Time estimate | Shown below title |
| Diagram reference | Inline amber callout: "See diagram — position A" where relevant |
| Diagram | Thumbnail or persistent panel — must remain visible throughout |
| Substeps | Shown collapsed, expandable |
| Primary CTA | "Done" — advances to next step |
| Secondary actions | Skip this step / Go back / View diagram |
| Voice interaction | Voice-assisted available (TTS reads steps, vocal "Done"/"Next"), but screen must remain visible with diagram accessible |

---

**Screen: Session Complete — Restructure**
- Calm completion moment
- Steps completed and time taken
- Save to Space History CTA
- No before/after photo comparison at session end — the before/after diagram was already shown at the planning stage

---

## 4. Supporting Screens

| Screen | Content |
|---|---|
| Space History | Grid of past sessions. Resume incomplete. Show mode used and date. |
| Session Detail | Full step log, annotated photo, mode used, time spent. |
| Settings | Voice speed, TTS voice selection, font size, notification preferences. |
| Profile | Account info (Google/Apple), sign-out option. |

---

## 5. Screen Inventory

| Screen | Mode | Auth Required |
|---|---|---|
| Welcome (OAuth) | — | No |
| Permissions | — | No |
| Home / Dashboard | Both | Yes |
| Space Description *(optional)* | Both | Yes |
| Capture — Photo/Multi | Both | Yes |
| Capture — Scan | Both | Yes |
| Analysing (loading) | Both | Yes |
| Analysis Result + Mode Decision | Both | Yes |
| Text or Voice Selection | Tidy | Yes |
| Step Card — Text Mode | Tidy | Yes |
| Step Card — Voice Mode | Tidy | Yes |
| Session Complete — Tidy | Tidy | Yes |
| Generating Layout (loading) | Restructure | Yes |
| Before / After Diagram | Restructure | Yes |
| Step Card — Restructure | Restructure | Yes |
| Session Complete — Restructure | Restructure | Yes |
| Space History | Both | Yes |
| Session Detail | Both | Yes |
| Settings | Both | Yes |
| Profile | Both | Yes |

---

## 6. Key Behaviours

**Context carries through**
Any information provided in the Space Description screen is passed to the AI analysis and echoed back on the Analysis Result screen. If the user skips description, no context is assumed — the AI works from the photo alone.

**Voice Mode Distinction: TIDY vs RESTRUCTURE**

| | TIDY | RESTRUCTURE |
|---|---|---|
| TTS narration (AI reads step) | ✅ Yes | ✅ Yes |
| STT commands ("Done", "Next") | ✅ Yes | ✅ Yes |
| Full hands-free (screen off) | ✅ Supported | ❌ Not supported — diagram must remain visible |
| Switch to text mode | ✅ Anytime | ✅ Anytime |

**Zoomed Step Images**
Both modes display a cropped/zoomed photo of the active area on each step card — not the full room photo. A calm-colored highlight ring surrounds the target item. RESTRUCTURE steps include a directional indicator (arrow) showing where the furniture piece moves to.

**Description before capture**
The description screen always appears before the camera opens. This gives the AI context before it sees the photo, enabling more targeted analysis and personalised recommendations.

**No separate mode confirmation screen**
Mode selection happens on the Analysis Result screen only. The user sees the AI's recommendation and confirms or overrides it in one action. There is no additional screen for this.

**Before/after is Restructure only**
The before/after diagram exists solely in Restructure Mode, as a planning screen before guided steps begin. Tidy Mode has no before/after comparison at any point — not during the flow, not at session complete.

**Voice description produces the same output as typed description**
Both input methods feed the same data model. Voice input shows a transcript for review before the user proceeds to capture.

**Scan mode context indicator**
If the user completed the description screen before scanning, the "Context set" indicator appears on the camera/scan screen to confirm the context is active.

---

## 7. Data Model

| Entity | Key Fields | Notes |
|---|---|---|
| User | id, auth_provider (google/apple), auth_id, created_at, preferences | |
| Session | id, user_id, mode, status, created_at, completed_at | Status: active / complete / abandoned |
| Space | id, session_id, name, type, goal, description_method (type/voice/skipped), images[] | |
| Analysis | id, session_id, annotated_image_url, findings[], mode_recommendation, mode_rationale, context_confirmed (bool) | |
| Diagram | id, session_id, before_svg, after_svg, annotations[] | Restructure sessions only |
| Step | id, session_id, order, title, substeps[], time_estimate, status | Status: pending / done / skipped |

---

*Clarios IA v1.0 · April 2026*
