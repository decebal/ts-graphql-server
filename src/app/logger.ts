import * as winston from 'winston';
import {Loggly} from 'winston-loggly';
import {LOG_LEVEL, LOG_TO_CONSOLE, LOGGLY_SUBDOMAIN, LOGGLY_TOKEN, NODE_ENV} from './environment/const';

// noinspection TsLint
const logger = new winston.Logger({
    level: LOG_LEVEL,
    transports: [
        new Loggly({
            token: LOGGLY_TOKEN,
            subdomain: LOGGLY_SUBDOMAIN,
            tags: ['api-' + NODE_ENV],
            json: true,
            level: LOG_LEVEL
        })
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
