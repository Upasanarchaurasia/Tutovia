# Tutovia — Git Version Control & Release Management

All Tutovia versions are tracked in Git and synced to the remote GitHub repository (`https://github.com/Upasanarchaurasia/Tutovia.git`) using both **annotated Git tags** and **dedicated `release/*` branches**.

---

## 1. Saved Versions & Live Endpoints

| Version Tag | Release Branch | Codebase Directory | Live URL Path | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`v1.0.0`** | `release/v1.0.0` | `src/` | `http://161.118.173.142/` | Original Tutovia V1 platform |
| **`v2.0.0`** | `release/v2.0.0` | `src/v2/` | — | Initial standalone V2 landing experience |
| **`v2.13.0`** | `release/v2.13.0` | `src/v2/` | — | Pre-hub V2 landing & side-by-side Auth experience (basis for V3.0) |
| **`v2.15.0`** | `release/v2.15.0` | `src/v2/` | `http://161.118.173.142/v2/` | V2.15 with decoupled Member Hub (`/v2/hub`) & study modals |
| **`v2.16.0`** | `release/v2.16.0` | `src/v2/` | — | V2.16 multi-stage academic command center dashboard |
| **`v3.0.0`** | `release/v3.0.0` | `src/v3/` (plus `src/` & `src/v2/`) | `http://161.118.173.142/v3/` | Tutovia 3.0 running on `/v3` alongside V1 (`/`) and V2 (`/v2`) |

---

## 2. Quick Commands (Automated Version Manager)

### List All Saved Versions
```bash
npm run version:list
```

### Save & Push a New Version to Git + GitHub
Whenever a new version is ready, run:
```bash
npm run version:save -- v3.1.0 "Brief description of what changed"
```
This automatically:
1. Stages all project files (`git add -A`)
2. Creates a release commit (`release(v3.1.0): ...`)
3. Creates an annotated Git tag (`v3.1.0`) and release branch (`release/v3.1.0`)
4. Pushes `main`, `release/v3.1.0`, and tag `v3.1.0` to GitHub (`origin`)

### Access or Restore Any Previous Version Anytime
To inspect or check out any version:
```bash
npm run version:checkout -- v2.15.0
```
Or using standard Git commands:
```bash
git checkout v2.13.0          # Switch to exact v2.13.0 tag
git checkout release/v2.15.0  # Switch to v2.15.0 release branch
git checkout main             # Return to latest main branch (v1 + v2 + v3)
```

### Build Individual or All Versions
```bash
npm run build:v1   # Builds V1 (/) into dist/
npm run build:v2   # Builds V2 (/v2/) into dist_v2/
npm run build:v3   # Builds V3 (/v3/) into dist_v3/
npm run build:all  # Builds all three versions
```
