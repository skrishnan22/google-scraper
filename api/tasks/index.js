
import { run } from 'graphile-worker';
import scraperJob from './scraper.js';
async function main() {
  await run({
    connectionString: process.env.DATABASE_URL,
    taskList: {
       scraper:scraperJob,
    },
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
