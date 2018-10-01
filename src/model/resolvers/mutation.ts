import { contains, curry, lensPath, lensProp, mapObjIndexed, mergeDeepLeft, view } from 'ramda';
import { rootResolver } from './rootResolver';

const trimEdgeSuffix = (str, suffix = 'Edge') => {
  if (str.endsWith(suffix)) {
    return str.slice(0, str.length - suffix.length);
  } else {
    return str;
  }
};

const mutate = curry(async (mutationType, readables, root, args, context, info) => {
  const afterPersistence = await context.dataSources.ouroboros.mutate(mutationType, root, args, context, info);

  const populateTypes =
    (value, key, object) =>
      async () => {
        const cleanEdgeFromKey = trimEdgeSuffix(key);
        return await value({}, view(lensProp(cleanEdgeFromKey), afterPersistence), context, info);
      };
  const returnable = mapObjIndexed(populateTypes, readables);

  const findClientMutationId = lensPath(['input', 'clientMutationId']);

  return mergeDeepLeft(
    { clientMutationId: view(findClientMutationId, args) },
    returnable
  );
});

export const mutation = (mutationType) => {
  return {
    StoreUser: mutate('StoreUser', {
      user: rootResolver('user')
    }),
  }[mutationType];
};
