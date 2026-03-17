import db from '../lib/db.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    const username = 'admin';
    const password = 'password123';

    // Check if admin already exists
    const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        insert.run(username, hashedPassword);
        console.log('Admin user seeded successfully. Username: admin, Password: password123');
    } else {
        console.log('Admin user already exists.');
    }

    // Add some sample categories
    const categoriesToInsert = ['Electronics', 'Clothing', 'Accessories', 'Home & Kitchen'];
    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');

    for (const cat of categoriesToInsert) {
        insertCategory.run(cat);
    }

    console.log('Database seeded.');
};

seedDatabase().catch(console.error);
