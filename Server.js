/**
 * Express Server for Web Scraping Demo
 * Provides two endpoints:
 *   - POST /api/scrape/seek  (trigger scraping)
 *   - GET  /api/jobs         (fetch job data)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

import { fetchSeek } from './scraper/seek.js';
import { ensureJobsTable, upsertJobs } from './scraper/db.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myapp',
  connectionLimit: 10,
});

// GET: Return all scraped jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      await ensureJobsTable(conn);
      const [rows] = await conn.query('SELECT * FROM jobs ORDER BY scraped_at DESC LIMIT 200');
      res.json(rows);
    } finally { conn.release(); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST: Trigger SEEK scraping
app.post('/api/scrape/seek', async (req, res) => {
  try {
    const { q = 'software', where = 'Adelaide SA' } = req.body || {};
    const data = await fetchSeek({ q, where });
    const conn = await pool.getConnection();
    try {
      await ensureJobsTable(conn);
      const result = await upsertJobs(conn, data);
      res.json({ ok: true, total: data.length, ...result });
    } finally { conn.release(); }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Scrape failed' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
