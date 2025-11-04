/**
 * SEEK Web Scraper
 * Scrapes public job listings from SEEK using Axios + Cheerio.
 * No login, no bypass, only HTML parsing of public search results.
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';

export async function fetchSeek({ q = 'software', where = 'Adelaide SA' } = {}) {
  const url = 'https://www.seek.com.au/jobs';
  const { data: html } = await axios.get(url, {
    params: { q, where },
    headers: { 'User-Agent': 'Jason-Scraper/1.0 (+edu demo)' },
    timeout: 20000,
  });

  const $ = cheerio.load(html);
  const results = [];

  $('article[data-automation="normalJob"]').each((_, el) => {
    const $el = $(el);
    let href = $el.find('a[data-automation="jobTitle"]').attr('href') || '';
    if (href && !href.startsWith('http')) href = 'https://www.seek.com.au' + href;

    const record = {
      id: crypto.createHash('sha256').update('seek' + href).digest('hex'),
      source: 'seek',
      title: $el.find('a[data-automation="jobTitle"]').text().trim(),
      company: $el.find('a[data-automation="jobCompany"]').text().trim(),
      location: $el.find('a[data-automation="jobLocation"]').text().trim(),
      posted_date: $el.find('span[data-automation="jobListingDate"]').text().trim() || null,
      salary_text: null,
      employment_type: null,
      description_text: $el.text().trim().slice(0, 4000),
      skills: [],
      job_url: href
    };
    results.push(record);
  });

  return results;
}
