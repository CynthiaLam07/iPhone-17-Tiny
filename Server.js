
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 3000;
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASS || 'Strong_Password_123!',
  database: process.env.DB_NAME || 'myapp',
  waitForConnections: true,
  connectionLimit: 10,
});


async function ensureTables() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(30),
        age INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    await conn.query(`
    CREATE TABLE IF NOT EXISTS passwords (
    user_id INT PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    passcode VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  ) ENGINE=InnoDB;
`);

  } finally {
    conn.release();
  }
}
ensureTables().catch(console.error);


app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, phone, passcode, age } = req.body || {};

   
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, password are required' });
    }

   
    const passwordHash = await bcrypt.hash(String(password), 12);

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

     
      const [userResult] = await conn.execute(
        `INSERT INTO users (username, email, phone,age) VALUES (?, ?, ?, ?)`,
        [String(username).trim(), String(email).trim().toLowerCase(), phone ?? null,age ?? null]
      );

      const userId = userResult.insertId;


      await conn.commit();
      return res.status(201).json({ id: userId,username:username, message: `Account created, Welcome:${username}`, });
    } catch (e) {
      await conn.rollback();
     
      if (String(e).includes('ER_DUP_ENTRY')) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      console.error(e);
      return res.status(500).json({ error: 'Server error' });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
