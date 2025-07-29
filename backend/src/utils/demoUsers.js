const bcrypt = require('bcryptjs');
const pool = require('./db');

async function createDemoUsers() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    const readonlyPassword = await bcrypt.hash('readonly123', 10);

    // Insert demo users
    await pool.query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Admin User', 'admin@demo.com', ?, 'admin'),
      ('Regular User', 'user@demo.com', ?, 'user'),
      ('Read Only User', 'readonly@demo.com', ?, 'read-only')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `, [adminPassword, userPassword, readonlyPassword]);

    console.log('Demo users created successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin: admin@demo.com / admin123');
    console.log('User: user@demo.com / user123');
    console.log('Read-only: readonly@demo.com / readonly123');
  } catch (err) {
    console.error('Error creating demo users:', err);
  } finally {
    process.exit(0);
  }
}

createDemoUsers(); 