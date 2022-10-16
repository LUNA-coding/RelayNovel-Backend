import dotenv from 'dotenv';
import App from './app';
import config from './config';
import { logger, serverSocket } from './resources';

dotenv.config();

const port: number = parseInt(config.port) || 5000;
const { app } = new App();

const httpServer = app
  .listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  })
  .on('error', (error) => {
    logger.error(error);
  });

serverSocket(httpServer);
