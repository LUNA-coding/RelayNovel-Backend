import express from 'express';

import cors from 'cors';
import bearerToken from 'express-bearer-token';
import helmet from 'helmet';

import { errorHandler } from './middlewares';
import { serviceRouter } from './services';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRouter();
    this.initializeErrorHandlers();
  }

  private initializeRouter() {
    this.app.use('/', serviceRouter);
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(
      express.json({
        limit: '20mb',
      })
    );
    this.app.use(
      bearerToken({
        headerKey: 'Bearer',
        reqKey: 'token',
      })
    );
  }

  private initializeErrorHandlers() {
    this.app.use(errorHandler);
  }
}

export default App;
