/* tslint:disable:radix ordered-imports */
import * as Koa from 'koa';
import { server } from './app/server';
import { APP_PORT } from './app/environment/const';


// @ts-ignore
const app: any = new Koa();
const PORT: number = parseInt(APP_PORT) || 3000;

server.applyMiddleware({ app });

app.listen({ port: PORT });
