# Jason Web Scraper

### Overview
A fully commented English-only web scraping module using **Node.js, Axios, Cheerio, and MySQL**.
It fetches public job listings from SEEK and provides REST APIs to retrieve stored data.

---

### Folder Structure
```
scraper/
 ├─ seek.js      -> Scraper logic (Axios + Cheerio)
 ├─ db.js        -> Database helper functions
Server.js        -> Express backend with scraping endpoints
mysql.jobs.sql   -> SQL schema for the jobs table
```

---

### Usage (Local Demo)
1. Install dependencies:
   ```bash
   npm install axios cheerio express mysql2 cors dotenv
   ```

2. Create table:
   ```bash
   mysql -u root -p myapp < mysql.jobs.sql
   ```

3. Run server:
   ```bash
   node Server.js
   ```

4. Trigger scraping:
   ```bash
   curl -X POST http://localhost:3000/api/scrape/seek      -H "Content-Type: application/json"      -d '{"q":"software","where":"Adelaide SA"}'
   ```

5. View results:
   ```bash
   curl http://localhost:3000/api/jobs
   ```

---

### Upload to GitHub (Safe Method)
1. Go to your **Back-end** repo → **Code → Upload files**.
2. Create a new branch called `feature/web-scraping`.
3. Upload all five files in this folder.
4. Commit → Create Pull Request → Add this note:

```
Adds a complete English-documented web scraping module (Axios + Cheerio).
Includes:
- SEEK scraper
- MySQL integration
- REST endpoints: /api/scrape/seek, /api/jobs
No existing code overwritten.
```
