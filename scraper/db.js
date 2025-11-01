/**
 * Database Helper Functions
 * Provides MySQL table creation and upsert logic for job data.
 */

export async function ensureJobsTable(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(64) PRIMARY KEY,
      source VARCHAR(32),
      title TEXT,
      company VARCHAR(200),
      location VARCHAR(200),
      posted_date VARCHAR(50),
      salary_text VARCHAR(200),
      employment_type VARCHAR(100),
      description_text MEDIUMTEXT,
      skills TEXT,
      job_url TEXT,
      scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
}

export async function upsertJobs(conn, records) {
  if (!records || !records.length) return { inserted: 0, updated: 0 };
  let inserted = 0, updated = 0;
  for (const r of records) {
    const [res] = await conn.query(
      `INSERT INTO jobs (id, source, title, company, location, posted_date, salary_text,
                         employment_type, description_text, skills, job_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         title=VALUES(title),
         company=VALUES(company),
         location=VALUES(location),
         posted_date=VALUES(posted_date),
         description_text=VALUES(description_text)`,
      [r.id, r.source, r.title, r.company, r.location, r.posted_date, r.salary_text,
       r.employment_type, r.description_text, JSON.stringify(r.skills||[]), r.job_url]
    );
    if (res.affectedRows === 1) inserted++; else updated++;
  }
  return { inserted, updated };
}
