import { curry } from 'ramda';
import { connection } from './connection';
import { edge } from './edge';
import { node } from './node';

const withHandler = curry(async (handler, context, info, parentType, parentData, resolverType, handlerType, depArgs) => {
  const depRoot = { __typename: parentType, ...parentData };
  return handler(resolverType, handlerType, depRoot, depArgs, context, info);
});

const rootWrapper = curry(async (resolverType, handlerType, root, args, context, info) => {
  const awaitedData = await context.dataSources.ouroboros.resolveType(resolverType, root, args, context, info);

  const withParentContext = withParent(context, info);
  const resolveHandler = handlerType(resolverType);

  return resolveHandler(withParentContext, awaitedData);
});

const withParent = withHandler(rootWrapper);

export const rootResolver: (root: string) => (any) = (root: string) => {
  return {
    user: rootWrapper('user', node),
    viewer: rootWrapper('viewer', node),

    userEdge: rootWrapper('user', edge),

    users: rootWrapper('users', connection),
  }[root];
};
