-- MySQL Table: jobs
-- Only this table is created; existing schema is unaffected.

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
