import express from 'express';
import * as fileRouter from './modules/file/file.route.js';
import * as keywordRouter from './modules/keyword/keyword.route.js';

import cors from 'cors';

const app = new express();

(async () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use(`/${fileRouter.path}`, fileRouter.router);
  app.use(`/${keywordRouter.path}`, keywordRouter.router);

  app.listen(5001, () => console.log('app started'));
})();
