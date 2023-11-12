import express from 'express';
import cors from 'cors';

import * as fileRouter from './modules/file/file.route.js';
import * as keywordRouter from './modules/keyword/keyword.route.js';
import * as userRouter from './modules/user/user.route.js';
import authMiddleware from './middlewares/auth.js';

const app = new express();

(async () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(authMiddleware);
  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use(`/${userRouter.path}`, userRouter.router);
  app.use(`/${fileRouter.path}`, fileRouter.router);
  app.use(`/${keywordRouter.path}`, keywordRouter.router);

  app.listen(5001, () => console.log('app started'));
})();
