import {makeWorkerUtils} from 'graphile-worker';

const workerUtils = await makeWorkerUtils({
    connectionString: process.env.DATABASE_URL
  });
await workerUtils.migrate();
export default workerUtils;
