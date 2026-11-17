# ZHERO 🚀
> **B2B2C Career Guidance & Educational Support Platform**  
> Built for the **KSUM She Builds Hackathon 2026** by a team of 4.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-zhero--sand.vercel.app-FE6904?style=for-the-badge&logo=vercel)](https://zhero-sand.vercel.app/)  
**🌐 Live Production Deployment:** [https://zhero-sand.vercel.app/](https://zhero-sand.vercel.app/)


## 🌟 Overview

**ZHERO** connects students with structured career roadmaps, AI-driven assessments, and educational institutions under a scalable B2B2C model:
- **Students:** Gain free sponsored access to career assessments, recommendation matrices, skill-gap analysis, and milestone roadmaps.
- **Tuition Centres:** Offer high-value career intelligence to their student cohorts and track readiness analytics.
- **Platform Admin:** Verifies institutions, curates the national career taxonomy, and manages platform operations.

---

## 🏗️ Repository Architecture

This repository is structured as a **lightweight, zero-bloat monorepo** housing three completely decoupled React applications sharing a centralized design system:

```text
zhero/
├── apps/
│   ├── student/               # 👩‍🎓 Student Portal (Port 3001)
│   ├── tuition-centre/        # 🏫 Tuition Centre & Cohorts (Port 3002)
│   └── admin/                 # ⚙️ Platform Admin & Ops (Port 3003)
├── server/                    # 🚀 Shared Backend & SQLite DB (Port 5000)
│   ├── index.js               # HTTP REST Server & CORS preflight
│   ├── db.js                  # Persistent SQLite engine (node:sqlite)
│   ├── auth.js                # PBKDF2 hashing & JWT sessions
│   ├── routes.js              # Full REST API endpoints & audit logger
│   └── test.js                # In-process automated test suite
├── shared/
│   ├── styles/                # Brand tokens & CSS variables
│   ├── components/            # Reusable UI components & BrandNavbar
│   └── config/                # apiClient.js, Port map, URLs, and constants
├── docs/
│   ├── PROJECT_OVERVIEW.md    # Product specs & stakeholder specs
│   ├── ARCHITECTURE.md        # Monorepo architecture & integration plan
│   ├── DESIGN_SYSTEM.md       # Color palettes, typography & tokens
│   └── CONTRIBUTION_GUIDE.md  # Git branching workflow & team rules
├── .gitignore
├── README.md
└── package.json
```

---

## 🔐 Shared Database & Authentication

ZHERO features a unified, zero-dependency persistent SQLite database (`server/data/zhero.db`) and a secure JWT authentication system with role-based access control.

### Demo Credentials:
| Portal | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Student Portal** (Port 3001) | `student` | `student@zhero.app` | `Student@123` |
| **Tuition Centre** (Port 3002) | `tuition-centre` | `tuition@zhero.app` | `Tuition@123` |
| **Platform Admin** (Port 3003) | `admin` | `admin@zhero.app` | `Admin@123` |

*⚡ All portals also support **1-Click Quick Demo Login** directly in their login dialogs, and the top navigation includes an instant Role Switcher.*

---

## 🚀 Quick Start for Developers

### 1. Clone the Repository
```bash
git clone https://github.com/elzrose/zhero.git
cd zhero
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Your Application Independently

Each application runs on its own dedicated port to eliminate any port collision:

| Application | Command | Local Address | Live Deployment | Assigned Developer | Branch |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Backend & DB** | `npm run server` | [http://localhost:5000](http://localhost:5000) | *REST API & SQLite* | Team Backend | `main` |
| **Student** | `npm run dev:student` | [http://localhost:3001](http://localhost:3001) | [https://zhero-sand.vercel.app/](https://zhero-sand.vercel.app/) | Developer 1 | `feature/student` |
| **Tuition Centre** | `npm run dev:tuition` | [http://localhost:3002](http://localhost:3002) | *Internal* | Developer 2 | `feature/tuition-centre` |
| **Admin Console** | `npm run dev:admin` | [http://localhost:3003](http://localhost:3003) | *Internal* | Developer 3 | `feature/admin` |

### 4. Run Automated Test Verification
```bash
# Run shared backend & database test suite (12 tests)
npm run test:server

# Run student platform test suites (100+ tests)
node apps/student/test/bountyHub.test.js
node apps/student/test/calibration.test.js
node apps/student/test/dailyPlanner.test.js
node apps/student/test/mastery.test.js
node apps/student/test/studyRoomsAndStreaks.test.js
```

### 5. Build Applications for Production
```bash
# Build specific app
npm run build:student
npm run build:tuition
npm run build:admin

# Build all 3 apps together
npm run build:all
```

---

## 🎨 Shared Design Tokens

All applications adhere to the **ZHERO Design System** (`shared/styles/tokens.css`):

| Color | Hex | Role |
| :--- | :--- | :--- |
| **Primary Orange** | `#FE6904` | Main brand color & primary buttons |
| **Warm Orange** | `#FA9B2A` | Accent highlights & gradients |
| **Pale Peach** | `#FFE5CE` | Highlight backgrounds & badge fills |
| **Golden Orange** | `#F39E2A` | High-emphasis status elements |
| **White** | `#FFFFFF` | Card & modal surfaces |
| **Off-White** | `#F8F8F7` | Platform background (`--color-bg-base`) |
| **Near-Black** | `#171717` | High-contrast typography |
| **Muted Text** | `#77736F` | Secondary descriptions & table labels |
| **Borders** | `#EAE7E2` | Clean subtle borders |

---

## 🌿 Git Branch Workflow

1. `main` is protected for stable releases.
2. Each developer checks out their assigned feature branch:
   - Developer 1: `git checkout feature/student`
   - Developer 2: `git checkout feature/tuition-centre`
   - Developer 3: `git checkout feature/admin`
3. Push changes to GitHub and submit a Pull Request to `main`.
4. Review [`docs/CONTRIBUTION_GUIDE.md`](./docs/CONTRIBUTION_GUIDE.md) for detailed instructions.

---

## 📚 Documentation Index

- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [Monorepo & Integration Architecture](./docs/ARCHITECTURE.md)
- [Design System Guide](./docs/DESIGN_SYSTEM.md)
- [Team Contribution Guide](./docs/CONTRIBUTION_GUIDE.md)
