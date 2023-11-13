import express from 'express';
import cors from 'cors';

import * as fileRouter from './modules/file/file.route.js';
import * as keywordRouter from './modules/keyword/keyword.route.js';
import * as userRouter from './modules/user/user.route.js';
import authMiddleware from './middlewares/auth.js';
import errorMiddleware from './middlewares/error.js';

const app = new express();
import('dotenv/config');
const port = process.env.PORT || 5001;

async function bootstrap() {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(authMiddleware);

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use(`/${userRouter.path}`, userRouter.router);
  app.use(`/${fileRouter.path}`, fileRouter.router);
  app.use(`/${keywordRouter.path}`, keywordRouter.router);

  app.use(errorMiddleware);

  app.listen(port, () => console.log(`App started on port ${port}`));
}

bootstrap()
  .then(() => console.log('Application started successfully'))
  .catch(err => console.log(err));

process.on('unhandledRejection', err => {
  console.log({ description: 'Unhandled rejection', err });
});
