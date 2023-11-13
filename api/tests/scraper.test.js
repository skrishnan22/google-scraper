import { expect } from 'chai';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

import { extractDataFromPage } from '../tasks/scraper.js';
import { fileURLToPath } from 'url';

describe('Scraper - extractDataFromPage', function () {
  let browser, page;
  let ___dirname = path.dirname(fileURLToPath(import.meta.url));

  before(async function () {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  describe('Custom Simple Html', function () {
    it('Should parse correct data from html', async function () {
      const htmlFilePath = path.join(___dirname, 'fixtures', 'html', 'custom.html');
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      await page.setContent(htmlContent);

      const data = await extractDataFromPage(page);

      expect(data.resultCount).to.equal(100254);
      expect(data.linkCount).to.equal(3);
      expect(data.adwordCount).to.equal(1);
    });
  });

  describe('Custom Html with empty links', function () {
    it('Should parse correct data from html', async function () {
      const htmlFilePath = path.join(___dirname, 'fixtures', 'html', 'empty-links.html');
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      await page.setContent(htmlContent);

      const data = await extractDataFromPage(page);

      expect(data.resultCount).to.equal(100254);
      expect(data.linkCount).to.equal(1);
      expect(data.adwordCount).to.equal(1);
    });
  });

  describe('Google HTML with no adword container', function () {
    it('Should parse correct data from html', async function () {
      const htmlFilePath = path.join(___dirname, 'fixtures', 'html', 'sample-google.html');
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      await page.setContent(htmlContent);

      const data = await extractDataFromPage(page);

      expect(data.resultCount).to.equal(117000000);
      expect(data.linkCount).to.equal(39);
      expect(data.adwordCount).to.equal(0);
    });
  });

  describe('Google HTML with Adwords', function () {
    it('Should parse correct data from html', async function () {
      const htmlFilePath = path.join(___dirname, 'fixtures', 'html', 'adword-google.html');
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      await page.setContent(htmlContent);

      const data = await extractDataFromPage(page);

      expect(data.resultCount).to.equal(3000000);
      expect(data.linkCount).to.equal(48);
      expect(data.adwordCount).to.equal(3);
    });
  });

  /**
   * This test is to ensure there is no change in Google's page structure - So not asserting for actual numbers.
   * Since adcount is dynamic we are skipping it.
   */
  describe('Live/Dyanmic HTML from Google search', function () {
    it('Should parse correct data from html', async function () {
      const keyword = 'compassion';
      await page.goto(`https://www.google.com/search?q=${keyword}`, {
        waitUntil: 'domcontentloaded'
      });

      const data = await extractDataFromPage(page);
     
      expect(data.resultCount).to.not.equal(0);
      expect(data.linkCount).to.not.equal(0);
    });
  });

  after(async function () {

    await browser.close();
  });
});
