import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import moment from 'moment-timezone';

const logDir = 'logs';
const { combine, printf } = winston.format;

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DD HH:mm:ss');
  }
  return info;
});

const logFormat = printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`
);

const logger = winston.createLogger({
  format: combine(appendTimestamp({ tz: 'Asia/Seoul' }), logFormat),
  transports: [
    new WinstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: '%DATE%.log',
      maxFiles: 30,
      zippedArchive: true,
    }),
    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: '%DATE%.error.log',
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

export default logger;
