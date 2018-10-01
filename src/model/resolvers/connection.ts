import { curry, lensPath, lensProp, map, over, view } from 'ramda';
import { edge } from './edge';

const pageInfo
  = (connection) => ({
  __typename: 'PageInfo',
  endCursor: view(lensPath(['data', 'pageInfo', 'endCursor']), connection) || null,
  hasNextPage: view(lensPath(['data', 'pageInfo', 'hasNextPage']), connection) || false,
  hasPreviousPage: view(lensPath(['data', 'pageInfo', 'hasPreviousPage']), connection) || false,
  startCursor: view(lensPath(['data', 'pageInfo', 'startCursor']), connection) || null,
});

const totalCount = (connection) => view(lensProp('totalCount'), connection);

const edges = (edgeTransformer, withParentContext, connectionData) => {
  const edgesMap = (edges) => map(edgeTransformer(withParentContext), edges);
  const connectionWithResolvers = (connection) => over(lensProp('edges'), edgesMap, connection);

  return view(
    lensProp('edges'),
    connectionWithResolvers(connectionData)
  );
};

const dataTransformer = curry((edgeResolver, withParentContext, awaitedData) => ({
  edges: edges(edgeResolver, withParentContext, awaitedData),
  pageInfo: pageInfo(awaitedData),
  totalCount: totalCount(awaitedData)
}));

export const connection = (connectionType) => {
  return {
    users: dataTransformer(edge('user')),
  }[connectionType];
};
