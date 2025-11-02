# iPhone-17-Tiny
# iPhone-17-Tiny

AUSWO Intelligent Immigration System - University of Adelaide Industry Project (2025)

A web platform helping international students and skilled migrants in Australia find jobs, check visa eligibility, and get immigration advice through an AI chatbot.

## Features

- **Job Search**: Real-time scraping of Australian job listings
- **Visa Calculator**: Points-based visa eligibility assessment
- **AI Chatbot**: Automated answers to immigration questions
- **User Dashboard**: Track applications and save searches

## Tech Stack

**Frontend**
- HTML/CSS/JavaScript
- Responsive design

**Backend**
- Node.js + Express.js
- MySQL database
- RESTful API

**Web Scraping**
- Puppeteer/Cheerio for SEEK integration

**AI**
- Chatbot prototype with backend integration

## Project Structure
```
iPhone-17-Tiny/
├── frontend/          # HTML/CSS/JS files
├── backend/           # Express.js server
├── scraper/           # Job scraping scripts
│   └── seek.js       # SEEK scraper
├── database/          # MySQL schemas
└── chatbot/           # AI chatbot module
```

## Setup

1. Clone the repo
```bash
git clone https://github.com/your-username/iPhone-17-Tiny.git
cd iPhone-17-Tiny
```

2. Install dependencies
```bash
npm install
```

3. Set up MySQL database
```bash
mysql -u root -p < database/schema.sql
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Run the application
```bash
npm start
```

## Development Phases

1. Requirements Analysis
2. System Design
3. Development & Implementation
4. Testing & Validation
5. Deployment & Documentation

## Team

| Name | Student ID | Role |
|------|------------|------|
| Yusen Wang | A1898205 | Web Scraping Developer |
| Kunxin Liu | A1880707 | UI/UX Designer |
| Wing Yui Lam | A1880707 | UI/UX Designer |
| Yuhang Cai | A1865662 | Frontend Developer |
| Jiaqi Luo | A1900124 | Backend & Database Engineer |
| Jiahe Shi | A1808696 | AI Chatbot Developer |

## License

University of Adelaide - Industry Project
