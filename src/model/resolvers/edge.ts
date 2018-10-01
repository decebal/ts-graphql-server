import { curry } from 'ramda';
import { node } from './node';
import { base64 } from './edge/base64';

const PREFIX = 'connection_prefix:';
const cursorFromId = (id) => base64(PREFIX + id);

const dataTransformer = curry((nodeResolver, withParentContext, awaitableEdge) => {
  if ('cursor' in awaitableEdge && 'node' in awaitableEdge) {
    return {
      cursor: awaitableEdge.cursor,
      node: nodeResolver(withParentContext, awaitableEdge.node)
    };
  }

  return {
    cursor: cursorFromId(awaitableEdge.id),
    node: nodeResolver(withParentContext, awaitableEdge)
  };

});

export const edge = (edgeType) => dataTransformer(node(edgeType));
