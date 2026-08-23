# Srini iTech Solution India Pvt. Ltd. — PostgreSQL V3

## Local
Install Node.js 18+ and Docker Desktop.
Open this folder in VS Code.
Run:
docker compose up -d postgres
copy .env.example to .env
npm install
npm install --prefix frontend
npm run dev

Open http://localhost:5173

## Vercel
Push to GitHub, import into Vercel, and set DATABASE_URL, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD and VITE_API_BASE=/api.
