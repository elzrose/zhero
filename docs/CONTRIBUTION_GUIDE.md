# ZHERO — Team Contribution & Git Workflow Guide

> **KSUM She Builds Hackathon 2026**  
> *Rules of Engagement for 4 Team Members Across 3 Applications*

---

## 1. Branch Strategy & Ownership

To prevent merge conflicts and allow all 3 developers to work at top speed under tight hackathon deadlines, we enforce a strict branch-per-application isolation model:

```text
       ┌─────────── feature/student ───────────┐
       │             (Developer 1)             │
       │                                       ▼
main ──┴─────────── feature/tuition-centre ────┴──► main (releases)
       │             (Developer 2)             ▲
       │                                       │
       └─────────── feature/admin ─────────────┘
                     (Developer 3)
```

| Branch Name | Primary Application Folder | Responsible Developer | Local Dev URL |
| :--- | :--- | :--- | :--- |
| `main` | Production-ready shared code | Team Lead / Release Coordinator | — |
| `feature/student` | `apps/student/` | Developer 1 | `http://localhost:3001` |
| `feature/tuition-centre` | `apps/tuition-centre/` | Developer 2 | `http://localhost:3002` |
| `feature/admin` | `apps/admin/` | Developer 3 | `http://localhost:3003` |

---

## 2. Rules for Working in the Monorepo

1. **Stay in your lane:**
   - Dev 1 modifies only `apps/student/`.
   - Dev 2 modifies only `apps/tuition-centre/`.
   - Dev 3 modifies only `apps/admin/`.
2. **Touching `shared/`:**
   - Any modifications to `shared/styles/tokens.css` or `shared/components/` must be announced in the team chat before committing.
3. **Never push directly to `main`:**
   - Feature branches must be tested locally with `npm run build:<app>` before merging.
4. **No secrets in repository:**
   - Never commit API keys, `.env` files, or personal tokens.

---

## 3. Daily Developer Workflow

### Step 1: Clone and Set Up Workspace
```bash
git clone https://github.com/<your-username-or-org>/zhero.git
cd zhero
npm install
```

### Step 2: Switch to Your Assigned Branch
```bash
# Developer 1:
git checkout feature/student

# Developer 2:
git checkout feature/tuition-centre

# Developer 3:
git checkout feature/admin
```

### Step 3: Run Your Dedicated App
```bash
# Developer 1:
npm run dev:student     # Runs on port 3001

# Developer 2:
npm run dev:tuition     # Runs on port 3002

# Developer 3:
npm run dev:admin       # Runs on port 3003
```

### Step 4: Staging and Committing Changes
Use concise, conventional commits:
```bash
git status
git add apps/<your-app>/
git commit -m "feat(<your-app>): implement assessment progress bar"
```

### Step 5: Pushing Your Branch to GitHub
```bash
git push -u origin <your-branch-name>
```

### Step 6: Opening a Pull Request
1. Open the repository on GitHub.
2. Select **Pull requests** > **New pull request**.
3. Set **Base:** `main` and **Compare:** your `feature/*` branch.
4. Add a summary of screens completed and test results.
5. Request a quick review from the team before merging into `main`.

---

## 4. Manual GitHub Remote Setup (If Repo Not Yet Created Remotely)

If creating the remote repo directly from the command line is blocked by GitHub login / permissions, execute these steps once on github.com:

1. Log into your GitHub account: [github.com/new](https://github.com/new).
2. Repository name: `zhero`.
3. Set visibility to **Public** (or **Private** with your teammates added under *Settings > Collaborators*).
4. Do **not** initialize with README or .gitignore (these already exist locally).
5. Click **Create repository**.
6. Run these commands locally in the `zhero` directory:
   ```bash
   git remote add origin https://github.com/<your-username>/zhero.git
   git branch -M main
   git push -u origin main
   git push -u origin feature/student
   git push -u origin feature/tuition-centre
   git push -u origin feature/admin
   ```
7. Share the clone URL with your teammates:
   `https://github.com/<your-username>/zhero.git`
