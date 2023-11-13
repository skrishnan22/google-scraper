import prisma from '../utils/prismaClient.js';
import puppeteer from 'puppeteer';
const userAgents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
];

/**
 * Job handler for scraping task
 * @param {*} payload - data added while creating job using addJob
 */
export default async function job(payload) {
  console.log('Job running', payload);

  const keywordInFile = await prisma.keyword.findMany({
    where: {
      fileId: payload.fileId,
      userId: payload.userId,
      scrapeStatus: 'PENDING'
    }
  });
  await scrapeGoogle(keywordInFile);
}

async function scrapeGoogle(keywords) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  });

  const page = await browser.newPage();

  for (const keyword of keywords) {
    //Use different user agents randomly to emulate different users accessing Google from same IP
    const index = Math.floor(Math.random() * userAgents.length);
    const userAgent = userAgents[index];
    await page.setUserAgent(userAgent);

    const query = encodeURIComponent(keyword.name);

    await page.goto(`https://www.google.com/search?q=${query}`, {
      waitUntil: 'domcontentloaded'
    });

    const htmlContent = await page.content();
    const extractedData = await extractDataFromPage(page);
    await prisma.keyword.update({
      where: {
        id: keyword.id
      },
      data: {
        scrapeStatus: 'SUCCESS',
        htmlContent,
        linkCount: extractedData.linkCount,
        resultCount: extractedData.resultCount,
        adwordCount: extractedData.adwordCount
      }
    });

    await randomizeUserActions(page);
  }

  await browser.close();
}

/**
 * Perform some user actions on the page like an actual user would do
 * @param {*} page - Page object from Puppeteer
 */
async function randomizeUserActions(page) {
  //random mouse movements
  await page.mouse.move(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));

  //page scrolling
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  //idle time to indicate reading
  await page.waitForTimeout(Math.random() * 2000 + 1000);

  await page.evaluate(() => {
    window.scrollBy(0, -window.innerHeight);
  });

  await page.mouse.move(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
}

/**
 * Parse html to extract necessary data like Adword counts, Links and Result stats
 * @param {*} page Page object from Puppeteer
 */
export async function extractDataFromPage(page) {
  const data = await page.evaluate(async () => {
    const statsText = document?.querySelector('#result-stats');
    let resultCount = 0;
    if (statsText?.innerText) {
      const regex = /About\s+([\d,]+)\s+results/;
      const match = statsText.innerText.match(regex);
      resultCount = match && match[1].replace(/,/g, '');
    }

    const anchors = Array.from(document?.querySelectorAll('a[href]')) || [];
    //filter out empty links
    const validLinks = anchors.filter(
      a => a?.getAttribute('href') !== '#' && !a.getAttribute('href').startsWith('javascript:')
    )?.length;
    let sponsoredAdsCount = 0;

    /**
     * All Ads are contained within a div with Id "tads"
     * Every ad has a div with property "data-text-ad". This being a custom data attribute should be reliable and stable
     * Checking the div to ensure it has Sponsored text - This is subject to change but its only a secondary verification
     */
    const adsContainer = document.querySelector('div#tads[aria-label="Ads"]');
    if (adsContainer) {
      const ads = adsContainer?.querySelectorAll('div[data-text-ad]');

      ads.forEach(ad => {
        const isSponsored = ad?.querySelector('span')?.textContent.includes('Sponsored');
        if (isSponsored) sponsoredAdsCount++;
      });
    }

    return {
      linkCount: validLinks,
      resultCount: parseInt(resultCount),
      adwordCount: sponsoredAdsCount
    };
  });
  return data;
}
