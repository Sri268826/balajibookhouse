import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'database.db');

// Ensure the directory for the database exists (crucial for Docker/Render volume mounts)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;
try {
  // timeout: 10s — lets concurrent Next.js build workers wait for the lock
  // instead of immediately throwing "database is locked"
  db = new Database(dbPath, { timeout: 10000 });

  // WAL must be set first — it's a DB-level property that enables concurrent reads
  db.pragma('journal_mode = WAL');
  db.pragma('busy_timeout = 10000'); // extra safety: retry writes for up to 10s
  db.pragma('synchronous = NORMAL'); // safe + faster than FULL
  db.pragma('foreign_keys = ON');
  db.pragma('cache_size = -32000');  // 32MB page cache
  db.pragma('temp_store = MEMORY');  // temp tables in RAM

  // Create tables if they don't exist
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category_id INTEGER,
    is_latest BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS product_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    url TEXT NOT NULL,
    type TEXT NOT NULL, -- 'image' or 'video'
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  );
`);

  // Indexes for 8000+ products — makes category filter, search, and sorting fast
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_latest ON products(is_latest);
    CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    CREATE INDEX IF NOT EXISTS idx_media_product ON product_media(product_id);
  `);

  // Create default admin if users table is empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(defaultPassword, salt);
    // Use INSERT OR IGNORE to prevent unique constraint failures when multiple build workers init the DB
    db.prepare('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)').run('admin', hashedPassword);
    console.log(`✅ Default admin user ensured. Username: admin`);
  }
} catch (error) {
  console.error("❌ Database Initialization Error:", error.message);
  console.error("Please ensure the directory is writable and the SQLite path is correct.");
  // During 'next build', workers initialize the DB concurrently — don't exit the whole
  // build process on a transient lock. Only hard-exit at actual runtime startup.
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) {
    process.exit(1);
  }
}

export default db;
