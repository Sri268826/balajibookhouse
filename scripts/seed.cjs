const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'shop.db');
const db = new Database(dbPath);

const seedDatabase = async () => {
    const username = 'admin';
    const password = 'password123';

    // The tables might not exist yet if node hasn't run lib/db.js
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
      type TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

    const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
        console.log('Admin user seeded successfully. Username: admin, Password: password123');
    }

    const categoriesToInsert = ['Electronics', 'Clothing', 'Accessories', 'Home & Kitchen'];
    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    for (const cat of categoriesToInsert) {
        insertCategory.run(cat);
    }

    console.log('Database seeded.');
};

seedDatabase().catch(console.error);
