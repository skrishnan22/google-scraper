export default config = {
    worker: {
      connectionString: 'postgresql://dev_user:abc123@localhost:5432/google-scraper?schema=public',
      maxPoolSize: 5,
      pollInterval: 2000,
      preparedStatements: true,
      schema: "public",
      concurrentJobs: 1,
      fileExtensions: [".mjs"],
    },
  };