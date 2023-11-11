
import { run } from 'graphile-worker';
import scraperJob from './scraper.js';
async function main() {
  await run({
    connectionString: "postgresql://dev_user:abc123@localhost:5432/google-scraper?schema=public", // Replace with your database connection string
    taskList: {
       scraper:scraperJob,
    },
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
