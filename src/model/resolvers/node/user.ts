import { compose, curry, lensProp, set } from 'ramda';
import { connection } from '../connection';
import { transformNonNullPhoto } from './photo';

const userResolvers = (withParentContext, data) => {
  const userWithPhoto = compose(
      transformNonNullPhoto(lensProp('photo')),
  )(data);

  const withParentUser = withParentContext('user', userWithPhoto);

  return {
    joinedMemorials: (depArgs) => withParentUser('memorials', connection, set(lensProp('joined'), true, depArgs)),
    ...data
  };
};

export const user = userResolvers;
export const viewer = userResolvers;
