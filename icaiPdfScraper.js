// ============================================================================
// ICAI Study Material Web Scraper & Indexer Service
// Principal Full-Stack Engineering Module for Tutovia
// ============================================================================

import * as cheerio from 'cheerio';
import axios from 'axios';
import { CURATED_ICAI_MATERIALS } from './icaiStudyMaterialData.js';

// Realistic browser User-Agents for request cycling to bypass basic rate limiting
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
];

/**
 * Return random realistic headers
 */
function getRequestHeaders(referer = 'https://boslive.icai.org/') {
  const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  return {
    'User-Agent': ua,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Referer': referer,
    'Sec-Ch-Ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Upgrade-Insecure-Requests': '1'
  };
}

/**
 * Extract standard code from text (e.g. AS 7, Ind AS 115, SA 200)
 */
function extractStandardCode(text) {
  if (!text) return null;
  const asMatch = text.match(/\b(AS\s*\d{1,2}|Ind\s*AS\s*\d{2,3}|SA\s*\d{3})\b/i);
  if (asMatch) {
    return asMatch[1].toUpperCase().replace(/\s+/g, ' ');
  }
  return null;
}

/**
 * Clean chapter title by removing noise like "Download PDF", "Click Here", icon text, etc.
 */
function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/(?:download|view|click\s+here|pdf\s+file|new|bos)\s*$/i, '')
    .replace(/^[-\s:•·]+/, '')
    .trim();
}

/**
 * Ensure URL is a valid absolute CDN link
 */
function normalizePdfUrl(href, baseUrl = 'https://boslive.icai.org') {
  if (!href) return null;
  let cleanHref = href.trim();

  // If already absolute CDN link
  if (cleanHref.startsWith('http://') || cleanHref.startsWith('https://')) {
    return cleanHref;
  }

  // Handle relative links pointing to cdn or local paths
  if (cleanHref.includes('resource.cdn.icai.org')) {
    const idx = cleanHref.indexOf('resource.cdn.icai.org');
    return 'https://' + cleanHref.substring(idx);
  }

  try {
    const resolved = new URL(cleanHref, baseUrl);
    return resolved.href;
  } catch (err) {
    return null;
  }
}

/**
 * Scrape a specific ICAI BoS page and extract structured study material PDF hierarchy
 */
export async function scrapeIcaiPage(url, context = {}) {
  const extracted = [];
  try {
    const response = await axios.get(url, {
      headers: getRequestHeaders(url),
      timeout: 10000,
      validateStatus: (status) => status < 400
    });

    const html = response.data;
    if (!html || typeof html !== 'string') return [];

    const $ = cheerio.load(html);

    // Track active hierarchy state while traversing DOM
    let currentCourse = context.course || 'CA Intermediate';
    let currentGroup = context.group || 'Group 1';
    let currentSubject = context.subject || 'Advanced Accounting';
    let currentModule = context.module || 'Study Material';

    // Page title or main header check
    const pageHeading = $('h1, h2.title, .page-title').first().text().trim();
    if (pageHeading.includes('Foundation')) currentCourse = 'CA Foundation';
    else if (pageHeading.includes('Final')) currentCourse = 'CA Final';
    else if (pageHeading.includes('Intermediate')) currentCourse = 'CA Intermediate';

    // Traverse all anchor tags that point to a PDF
    $('a').each((i, el) => {
      const $el = $(el);
      const href = $el.attr('href');
      if (!href) return;

      const isPdf = href.toLowerCase().includes('.pdf') || 
                    href.includes('resource.cdn.icai.org') || 
                    href.includes('boslive.icai.org');

      if (!isPdf) return;

      const rawText = $el.text().trim() || $el.attr('title') || $el.parent().text().trim();
      const chapterTitle = cleanTitle(rawText);

      // Skip generic single-word links like "Home" or empty strings
      if (!chapterTitle || chapterTitle.length < 3 || chapterTitle.toLowerCase() === 'download') {
        return;
      }

      // Look up surrounding section headers (closest preceding h2/h3/h4/thead/th)
      const closestHeading = $el.closest('tr, li, .panel, .accordion-item, .card, div')
        .prevAll('h2, h3, h4, h5, .subject-title, .module-title')
        .first()
        .text()
        .trim();

      let subject = currentSubject;
      let moduleName = currentModule;

      if (closestHeading) {
        if (closestHeading.includes('Accounting')) subject = 'Advanced Accounting';
        else if (closestHeading.includes('Law')) subject = 'Corporate and Other Laws';
        else if (closestHeading.includes('Tax')) subject = 'Taxation';
        else if (closestHeading.includes('Cost')) subject = 'Cost and Management Accounting';
        else if (closestHeading.includes('Audit')) subject = 'Auditing and Ethics';
        else if (closestHeading.includes('Financial Management') || closestHeading.includes('FM')) subject = 'Financial Management and Strategic Management';
        
        if (closestHeading.includes('Module')) {
          moduleName = closestHeading;
        }
      }

      const directPdfUrl = normalizePdfUrl(href, url);
      if (!directPdfUrl || !directPdfUrl.includes('.pdf')) return;

      const stdCode = extractStandardCode(chapterTitle);

      // Deterministic unique ID
      const safeSlug = (chapterTitle + '-' + (stdCode || ''))
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const id = `icai-${currentCourse.toLowerCase().replace(/\s+/g, '-')}-${safeSlug}`.substring(0, 80);

      extracted.push({
        id,
        course: currentCourse,
        group: currentGroup,
        subject,
        module: moduleName,
        chapter_title: chapterTitle,
        pdf_url: directPdfUrl,
        portal_source_url: url,
        file_size_approx: '1.5 MB',
        is_standard: !!stdCode,
        standard_code: stdCode,
        last_scraped_at: new Date().toISOString()
      });
    });

  } catch (err) {
    console.warn(`[ICAI Scraper] Warning while scraping ${url}:`, err.message);
  }

  return extracted;
}

/**
 * Main Indexer: Combines the verified seed catalog with live scrape attempts
 * Guarantees zero downtime and complete coverage of all CA Intermediate/Final/Foundation subjects
 */
export async function getOrRefreshStudyMaterials(forceLiveScrape = false) {
  // Start with complete curated database
  const catalogMap = new Map();
  CURATED_ICAI_MATERIALS.forEach(item => {
    catalogMap.set(item.id, {
      ...item,
      last_scraped_at: item.last_scraped_at || new Date().toISOString()
    });
  });

  if (forceLiveScrape) {
    console.log('[ICAI Scraper] Running live portal scrape on ICAI BoS...');
    const targetPages = [
      {
        url: 'https://boslive.icai.org/intermediate_course.php',
        course: 'CA Intermediate',
        group: 'Group 1'
      },
      {
        url: 'https://boslive.icai.org/final_course.php',
        course: 'CA Final',
        group: 'Group 1'
      },
      {
        url: 'https://boslive.icai.org/foundation_course.php',
        course: 'CA Foundation',
        group: 'Foundation'
      }
    ];

    for (const target of targetPages) {
      const scraped = await scrapeIcaiPage(target.url, target);
      scraped.forEach(item => {
        catalogMap.set(item.id, item);
      });
    }
  }

  return Array.from(catalogMap.values());
}

/**
 * High-performance search for chapters, accounting standards, subjects, and keywords
 */
export function searchMaterials(materials, query = '', filters = {}) {
  let results = [...materials];

  const { course, group, subject, onlyStandards } = filters;

  if (course && course !== 'All') {
    results = results.filter(m => m.course.toLowerCase() === course.toLowerCase());
  }

  if (group && group !== 'All') {
    results = results.filter(m => m.group.toLowerCase() === group.toLowerCase());
  }

  if (subject && subject !== 'All') {
    results = results.filter(m => m.subject.toLowerCase() === subject.toLowerCase());
  }

  if (onlyStandards) {
    results = results.filter(m => m.is_standard);
  }

  const q = (query || '').trim().toLowerCase();
  if (!q) return results;

  // Handle queries like "AS 7", "AS7", "AS-7", "Ind AS 115", "SA 200", "Contract"
  const normalizedQuery = q.replace(/[-_]/g, ' ');
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  return results.filter(item => {
    const title = (item.chapter_title || '').toLowerCase();
    const stdCode = (item.standard_code || '').toLowerCase();
    const subj = (item.subject || '').toLowerCase();
    const mod = (item.module || '').toLowerCase();
    const fullText = `${title} ${stdCode} ${subj} ${mod}`;

    // Exact standard match boost
    if (stdCode && stdCode.replace(/\s+/g, '') === q.replace(/\s+/g, '')) {
      return true;
    }

    // All query words match in text
    return queryWords.every(word => fullText.includes(word));
  }).sort((a, b) => {
    // Prioritize exact standard match first
    const aStdMatch = a.standard_code && a.standard_code.toLowerCase().includes(q);
    const bStdMatch = b.standard_code && b.standard_code.toLowerCase().includes(q);
    if (aStdMatch && !bStdMatch) return -1;
    if (!aStdMatch && bStdMatch) return 1;

    // Prioritize title start match
    const aStarts = a.chapter_title.toLowerCase().startsWith(q);
    const bStarts = b.chapter_title.toLowerCase().startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return 0;
  });
}

/**
 * Returns complete hierarchical catalog for navigation & filtering
 */
export function buildCatalogHierarchy(materials) {
  const tree = {};

  materials.forEach(item => {
    const course = item.course || 'CA Intermediate';
    const group = item.group || 'Core';
    const subject = item.subject || 'General';
    const module = item.module || 'Main Module';

    if (!tree[course]) tree[course] = { name: course, groups: {} };
    if (!tree[course].groups[group]) tree[course].groups[group] = { name: group, subjects: {} };
    if (!tree[course].groups[group].subjects[subject]) {
      tree[course].groups[group].subjects[subject] = { name: subject, modules: {} };
    }
    if (!tree[course].groups[group].subjects[subject].modules[module]) {
      tree[course].groups[group].subjects[subject].modules[module] = { name: module, chapters: [] };
    }

    tree[course].groups[group].subjects[subject].modules[module].chapters.push(item);
  });

  // Extract flat list of unique courses and subjects for filter dropdowns
  const courses = Array.from(new Set(materials.map(m => m.course)));
  const subjects = Array.from(new Set(materials.map(m => m.subject)));
  const groups = Array.from(new Set(materials.map(m => m.group)));

  return {
    tree,
    courses,
    subjects,
    groups,
    totalPdfs: materials.length,
    totalStandards: materials.filter(m => m.is_standard).length
  };
}
