import appRoot from 'app-root-path';
import winston from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleException: true,
    maxSize: 5242880, // 5MB
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
  console: {
    level: 'debug',
    handleException: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

// Create a stream with the write function that will be used by 'morgan'
logger.stream = {
  write: function (message, encoding) {
    // Use the 'info' log level so that the output will be picked up by both transports
    logger.info(message.trim());
  },
};

export default logger;
