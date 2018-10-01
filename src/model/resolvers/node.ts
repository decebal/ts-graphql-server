import { curry, has } from "ramda";
import { user, viewer } from "./node/user";

const defaultNodeResolver = curry((nodeType, withParentContext, awaitedData) => (awaitedData));

const resolversMap = {
  user: user,
  viewer: viewer,
};

export const node = (nodeType) => {
  const hasNodeType = has(nodeType);

  if (hasNodeType(resolversMap)) {
    return resolversMap[nodeType];
  }

  return defaultNodeResolver(nodeType);
};
