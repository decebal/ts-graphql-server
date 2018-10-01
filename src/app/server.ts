import { compose } from 'ramda';
import { ApolloServer } from 'apollo-server-koa';
import { RedisCache } from 'apollo-server-cache-redis';

import { schema } from './schema';
import { reqToken } from './http/middleware/reqToken';
import { userContextMap } from './userContextMap';
import { APOLLO_ENGINE_API_KEY, REDIS_CACHE_DB, REDIS_CACHE_HOST, REDIS_CACHE_PORT } from './environment/const';
import { ImageApi } from '../infrastructure/dataSources/imageApi';

const server = new ApolloServer({
  schema,
  engine: {
    apiKey: APOLLO_ENGINE_API_KEY
  },
  tracing: false,
  cacheControl: {
    defaultMaxAge: 500,
    stripFormattedExtensions: false
  },
  debug: false,
  context: ({ ctx }) => {
    return compose(
      userContextMap,
      reqToken
    )(ctx);
  },
  // cache: new RedisCache({
  //   host: REDIS_CACHE_HOST,
  //   port: REDIS_CACHE_PORT,
  //   db: REDIS_CACHE_DB,
  //   connectTimeout: 5000,
  //   reconnectOnError: function(err) {
  //     console.log('Reconnect on error', err);
  //     const targetError = 'READONLY';
  //     if (err.message.slice(0, targetError.length) === targetError) {
  //       return true;
  //     }
  //   },
  //   retryStrategy: function(times) {
  //     console.log('Redis Retry', times);
  //     if (times >= 3) {
  //       return undefined;
  //     }
  //     return Math.min(times * 50, 2000);
  //   },
  //   socket_keepalive: false
  // }),
  dataSources: () => {
    return {
      imageApi: new ImageApi()
      // ouroboros: new Ouroboros(),
    };
  }
});

export { server };
