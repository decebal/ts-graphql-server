import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'graphql-tools';
import * as path from 'path';

import { resolvers } from './resolvers';

const typeDefs = importSchema(path.join(__dirname, '../model/schema/schema.graphql'));


// noinspection TsLint
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers, // optional
  // logger, // optional
  allowUndefinedInResolve: false, // optional
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }, // optional
  // directiveResolvers = null, // optional
  // schemaDirectives = null,  // optional
  parseOptions: {},  // optional
  inheritResolversFromInterfaces: false,  // optional
});
