# ZHERO — Tuition Centre Platform 🏫
> **Dedicated Application Workspace:** `apps/tuition-centre/`  
> **Target Branch:** `feature/tuition-centre`  
> **Development Port:** `http://localhost:3002`  
> **Built for:** KSUM She Builds Hackathon 2026 (B2B2C Educational Growth Platform)

---

## 🌟 Overview & Purpose

The **Tuition Centre Platform** is the B2B institutional backbone of **ZHERO**. While traditional coaching and tuition centres struggle with cold student acquisition, high marketing churn, and generic guidance, ZHERO provides a complete B2B2C flywheel:

$$\text{Career Assessment} \longrightarrow \text{Student Engagement} \longrightarrow \text{Course Recommendation} \longrightarrow \text{Batch Admission} \longrightarrow \text{Cohort Retention}$$

1. **Student Acquisition via Assessment Campaigns:** Tuition centres launch targeted QR codes and shareable links for partner schools and campus fairs. Students take a free, 5-minute dynamic AI diagnostic assessment.
2. **Cognitive & Skill-Gap Diagnosis:** Tests evaluate logical reasoning, building preferences, and existing skills, identifying student affinities across 6 major technical disciplines.
3. **Explainable Course Matching:** A transparent heuristic engine matches student profiles with the centre's active courses, calculating mathematical alignment scores (Career 50% + Skills 35% + Prerequisites 15%) that counselors can explain to parents.
4. **Admissions & Retention Monitoring:** Qualified leads are converted into batch enrollments with capacity enforcement. Mentors track attendance rates, module completions, and proactive retention risk categories (`Healthy`, `Needs Attention`, `At Risk`).

---

## 🚀 Quick Start & How to Run

### 1. Start the Tuition Centre Development Server
From the repository root:
```bash
npm run dev:tuition
```
Or directly inside `apps/tuition-centre`:
```bash
npm run dev
```
The app will launch on **`http://localhost:3002`**.

### 2. Build for Production
```bash
npm run build:tuition
```
*(Transpiled bundle output is created in `apps/tuition-centre/dist/` without altering root files.)*

### 3. Oxlint Check
```bash
npm run lint:tuition
# or
npm --prefix apps/tuition-centre run lint
```

---

## 🎨 Design System & PostFlow Visual Reference

- **Visual Reference:** Matches the modern, minimal SaaS composition of the PostFlow visual reference with a left-aligned hero, prominent pill CTAs, dynamic sweeping wave ribbons, and a floating dashboard preview.
- **Brand Identity:** Styled in the ZHERO warm golden-yellow color system:
  - **Primary Yellow:** `#F5C842` (with `#E8B930` hover & `#C4971A` active states)
  - **Cream & Pale Yellow Accents:** `#FEF9E7`, `#FDF1C8`, `#FFFDF5`
  - **Surfaces & Neutrals:** `#FFFFFF` cards, `#F8F8F7` base, `#171717` dark high-contrast typography
  - **Soft Neutral Borders:** `#E8E5DE`
  - **Yellow Gradients:** `linear-gradient(135deg, #FAD75E 0%, #F5C842 50%, #E8B930 100%)`
  - **Restraint:** Gradients are reserved for focal calls-to-action, hero wave ribbons, and high-emphasis tags.

---

## 🔑 Authentication & Demo Access

The platform includes a zero-friction, clearly labeled **Demo Authentication Experience**:
- **Default State:** Pre-authenticated for instant demo walkthrough upon launch.
- **Demo Credentials:**
  - **Tuition Centre Director:** `director@apexacademy.edu.in` / `demo-apex-2026` (Role: `TUITION_ADMIN`)
  - **Admissions Counselor:** `counseling@apexacademy.edu.in` / `demo-apex-2026` (Role: `ACADEMIC_COUNSELOR`)
- **Demo Isolation:** No hard-coded secrets or live cloud API keys are exposed.
- **Sign In / Sign Out:** One-click toggling between public visitor and authenticated centre staff perspectives.

---

## 🏗️ Architecture & Implemented Modules

```text
apps/tuition-centre/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header navigation & cross-app port switcher (3001, 3002, 3003)
│   │   ├── Sidebar.jsx         # Authenticated dashboard sidebar & section navigation
│   │   ├── Modal.jsx           # Reusable accessible dialog & StatCard components
│   │   └── QRCodeModal.jsx     # Live SVG QR code generator & copyable share URL
│   ├── data/
│   │   ├── mockData.js         # Interconnected relational demo datasets
│   │   └── store.js            # Reactive persistent localStorage state store + CRUD + validation
│   ├── utils/
│   │   └── engine.js           # Deterministic explainable course-matching & assessment diagnostic engine
│   ├── styles/
│   │   └── theme.css           # Golden-yellow design tokens (#F5C842), buttons, tables, badges
│   ├── views/
│   │   ├── LandingPage.jsx     # PostFlow-inspired public SaaS landing page with yellow ribbon waves
│   │   ├── CourseCatalog.jsx   # Public course directory with search, category filters & quick enquiry
│   │   ├── PublicAssessment.jsx# Live 5-question career test, scoring & instant lead generation
│   │   ├── AuthView.jsx        # Demo login screen with role switching & validation
│   │   ├── DashboardView.jsx   # Main KPI hub, acquisition funnel, priority follow-ups, batch bars
│   │   ├── CoursesView.jsx     # Full Course CRUD, syllabus skills, difficulty, faculty & fees
│   │   ├── BatchesView.jsx     # Batch CRUD, schedule dates, rooms, and seat capacity limits
│   │   ├── CampaignsView.jsx   # Assessment campaign creation, QR generation & channel tracking
│   │   ├── LeadsView.jsx       # Student enquiry pipeline (New -> Assessed -> Qualified -> Enrolled)
│   │   ├── StudentsView.jsx    # Student directory, module progress, attendance & retention risks
│   │   ├── RecommendationsView.jsx # Transparent course matching with explainable factor breakdown
│   │   ├── EnrollmentsView.jsx # Admission management, course-batch consistency & capacity enforcement
│   │   ├── AnalyticsView.jsx   # Conversion funnels, skill gap demand & batch utilization
│   │   └── SettingsView.jsx    # Centre profile, campus branches, seat quota & demo data reset
│   ├── App.jsx                 # Top-level view router and state coordinator
│   └── main.jsx
├── vite.config.js              # Dedicated port 3002, @shared alias, and local React resolution
└── package.json
```

---

## 🧠 Explainable Course-Matching Engine

The course-matching engine (`src/utils/engine.js`) operates deterministically without speculative black-box AI claims:
- **Factor 1: Primary Career Alignment (50% max):**  
  Checks if the student's target career or top assessment affinity matches the course's occupational roadmap.
- **Factor 2: Skill Synergies & Gap Bridging (35% max):**  
  Evaluates overlap between candidate demonstrated strengths, target skill gaps, and course syllabus competencies.
- **Factor 3: Academic Readiness & Prerequisites (15% max):**  
  Matches student education level and assessment score (e.g. $\ge 75\%$) against course difficulty levels (`Beginner`, `Intermediate`, `Advanced`).
- **Explainability Output:**  
  Generates explicit human-readable reasons (e.g. *"Primary Career Alignment: Course directly prepares for target role 'AI / ML Specialist' (+50%)"*), matching skills, and a list of specific skills the student will acquire.

---

## 💾 Data Persistence & Demo Reset

- **Storage Engine:** Reactive browser `localStorage` under key `zhero_tc_store_v1`.
- **Integrity Validation:** Prevents over-capacity batch admissions and rejects invalid course-batch linkages.
- **Reset Feature:** Any modifications can be restored to pristine demo records at any time using the *"Reset All Demo Data"* button in the sidebar or Settings view.

---

## 🔒 Repository Isolation & Git Safety Adherence

- **Work Location:** 100% confined to `apps/tuition-centre/`.
- **Protected Boundaries:** Zero edits to `apps/student/`, `apps/admin/`, `shared/`, or root configuration files.
- **Branch:** Maintained strictly on `feature/tuition-centre`.
- **Commit/Push:** No commits or pushes made without explicit developer authorization.
