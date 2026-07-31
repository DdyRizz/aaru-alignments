# Running the Warp Coding App locally

Prerequisites
- Node.js (v16 or newer) and npm installed
- Docker (optional, for containers)

Quick start (npm)
1. Open a terminal in the `warp-coding-app` folder.
2. Run the setup script:
   - Unix/macOS: `./setup.sh`
   - Windows PowerShell: `.\setup.ps1`
3. Start the backend (dev): `npm run dev` (in `warp-coding-app/backend`) or use the VS Code task "Start Backend (dev)".
4. Open the frontend: run `npm run start` in `warp-coding-app/frontend` or open `warp-coding-app/frontend/index.html`.

Quick start (Docker)
1. From the repository root run: `docker compose -f warp-coding-app/docker-compose.yml up --build`
2. Backend will be available on port 3000 and frontend on port 8080 by default.

CI
- A GitHub Actions workflow is available at `.github/workflows/ci.yml`.

If you want me to run the app here, install Node.js and Docker in this environment or tell me which file to consider the active document.
