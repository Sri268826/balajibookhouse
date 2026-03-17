# Sri Balaji Book House

A premium wholesale and retail e-commerce platform built with Next.js App Router and SQLite.

## Project Structure

This project follows a clean, production-ready structure:
- `/app` - Next.js App Router pages and API routes.
- `/components` - Reusable UI components (ProductCard, Header, Footer, Admin).
- `/lib` - Database initialization (`db.js`) and Authentication utilities (`auth.js`).
- `/public` - Static assets and file uploads.
- `shop.db` - SQLite database (auto-generated on first run).

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup Environment Variables:**
   Rename `.env.example` to `.env.local` and set your secret tokens.
   ```bash
   cp .env.example .env.local
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

When the database is first created, a default admin account is created.
- **Username:** `admin`
- **Password:** `admin123`

*(Make sure to change this or disable it in production!)*

---

## Deployment Instructions

### 1. Render or Railway (Recommended for SQLite)
Since this project uses a local SQLite database (`shop.db`), it requires a **persistent disk** to save data permanently. Render and Railway support this easily.

**Deploying on Render:**
1. Connect your GitHub repository to Render as a **Web Service**.
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. Add a **Disk** to the service:
   - Name: `data`
   - Mount Path: `/data`
5. Add **Environment Variables**:
   - `DATABASE_PATH`: `/data/shop.db` (This ensures the DB uses the persistent disk)
   - `JWT_SECRET`: Generate a random string.
   - `NEXT_PUBLIC_SITE_URL`: Your `.onrender.com` domain.

### 2. Docker (Self-Hosted)
A highly optimized, multi-stage `Dockerfile` is included.
1. Build the image:
   ```bash
   docker build -t bbh-store .
   ```
2. Run it with a persistent volume for the database:
   ```bash
   docker run -p 3000:3000 -v bbh-data:/app/data --env JWT_SECRET=your_secret bbh-store
   ```

### 3. Vercel (Important Limitation)
Vercel is a global serverless platform. It uses an **ephemeral (temporary) filesystem**.
⚠️ **If you deploy this SQLite version to Vercel, any products or categories you add via the Admin panel will be lost as soon as the serverless function goes to sleep.**

To deploy to Vercel successfully, you must migrate the database to a cloud provider:
1. Setup a PostgreSQL database (e.g., Vercel Postgres, Supabase, Neon).
2. Update `/lib/db.js` to connect to the Postgres database instead of local SQLite.

## Git & Version Control

To push this cleanly to GitHub without uploading your local database:
```bash
git init
git add .
git commit -m "Production ready refactor"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```
*(Note: `.gitignore` is already optimized to ignore `.env.local` and `shop.db`)*
