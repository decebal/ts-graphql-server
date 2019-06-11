import * as winston from 'winston';
import {LOG_LEVEL, LOG_TO_CONSOLE, NODE_ENV} from './environment/const';

// noinspection TsLint
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: LOG_LEVEL }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (NODE_ENV === 'dev' && LOG_TO_CONSOLE) {
    logger.configure({
        transports: [
            new winston.transports.Console({})
        ]
    });
}

export const info = (...message) =>
    logger.log(
        'info',
        message.reduce((firstPart, secondPart) => firstPart + secondPart),
        {tags: 'api-' + NODE_ENV}
    );

export const error = (...message) =>
    logger.log(
        'error',
        message.reduce((firstPart, secondPart) => firstPart + secondPart),
        {tags: 'api-' + NODE_ENV}
    );
