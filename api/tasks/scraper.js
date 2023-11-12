import prisma from '../utils/prismaClient.js';
import puppeteer, { Page } from 'puppeteer';
const userAgents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
];

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
    const index = Math.floor(Math.random() * userAgents.length);
    const userAgent = userAgents[index];
    await page.setUserAgent(userAgent);

    const query = encodeURIComponent(keyword.name);
    await page.goto(`https://www.google.com/search?q=${query}`, {
      waitUntil: 'domcontentloaded'
    });

    const htmlContent = await page.content();
    const extractedData = await extractDataFromPage(page);
    console.log(extractedData);
    await prisma.keyword.update({
      where: {
        id: keyword.id
      },
      data: {
        scrapeStatus: 'SUCCESS',
        htmlContent,
        linkCount: extractedData.linkCount,
        resultCount: extractedData.resultCount
      }
    });
    await randomizeUserActions(page);
  }

  await browser.close();
}

async function randomizeUserActions(page) {
  await page.mouse.move(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  await page.waitForTimeout(Math.random() * 2000 + 1000);

  await page.evaluate(() => {
    window.scrollBy(0, -window.innerHeight);
  });

  await page.mouse.move(Math.floor(Math.random() * 500), Math.floor(Math.random() * 500));
}

async function extractDataFromPage(page) {
  const data = await page.evaluate(async () => {
    const statsText = document?.querySelector('#result-stats');
    let resultCount = 0;
    if (statsText?.innerText) {
      console.log({statsText})
      const regex = /About\s+([\d,]+)\s+results/;
      const match = statsText.innerText.match(regex);
      resultCount = match && match[1].replace(/,/g, '');
    }

    const anchors = Array.from(document?.querySelectorAll('a[href]')) || [];
    const validLinks = anchors.filter(
      a => a?.getAttribute('href') !== '#' && !a.getAttribute('href').startsWith('javascript:')
    )?.length;

    return {
      linkCount: validLinks,
      resultCount: parseInt(resultCount)
    };
  });
  // if(!data.stats){
  //   const content = await page.content()
  //   console.log(content)
  // }
  return data;
}
