import * as dotenv from 'dotenv';

let path;

export const NODE_ENV = process.env.NODE_ENV || 'development';

switch (NODE_ENV) {
    case 'test':
        path = `${__dirname}/.env.test`;
        break;
    case 'production':
        path = `${__dirname}/.env.production`;
        break;
    default:
        path = `${__dirname}/.env.development`;
}

dotenv.config({path});

export const LOG_LEVEL = process.env.LOG_LEVEL;
export const LOG_TO_CONSOLE = process.env.LOG_TO_CONSOLE;
export const APOLLO_ENGINE_API_KEY = process.env.APOLLO_ENGINE_API_KEY;
export const APP_PORT = process.env.APP_PORT;
export const MEDIA_SERVICE_HOST = process.env.MEDIA_SERVICE_HOST || '0.0.0.0';
export const MEDIA_SERVICE_PORT = process.env.MEDIA_SERVICE_PORT;
export const REDIS_CACHE_HOST = process.env.REDIS_CACHE_HOST;
export const REDIS_CACHE_PORT = process.env.REDIS_CACHE_PORT;
export const REDIS_CACHE_DB = process.env.REDIS_CACHE_DB;
export const JWT_PUBLIC_CERT = process.env.JWT_PUBLIC_CERT;
