import {curry, isEmpty, lensPath, over, set, view} from 'ramda';
import {NODE_ENV} from '../../../app/environment/const';

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const stagingStockImages = [
    'e6248d495fae448495c8603941bbafe6',
    'e522e022ed0f4aff87d50c5f4d50c373',
    'da9435db9f0243eca89d3968e2a78026',
    'd954189c256f4a21b6741f590d9a3611',
    'c8511d21ef6a4275a2efefc4ee00a4db',
    'bb32da517dc041aab4630304a238e516',
    'a533e820f92f4d1b977800e2d9c9b5c5',
    '633f56ea4a364d118ca4a5200193e47b',
    '431518d864a242aaa798ca33c1fe9dbf',
    '18b1367e45084bc28ccadfdf426aac97'
];

const variantResolver = async (resourceId) => {

    const variantShortHand = (variantName) =>
        async (depArgs, context) => context.dataSources.imageApi.getVariant(resourceId, variantName);

    return {
        Avatar: variantShortHand('Avatar'),
        SocialShare: variantShortHand('SocialShare'),
    };
};

const photoVariantsLens = lensPath(['photoResource', 'uris']);
const photoResourceLens = lensPath(['photoResource', 'photoResourceId']);

const getResourceId = (photo) => {
    if (NODE_ENV !== 'production') {
        return stagingStockImages[randomIntFromInterval(0, 9)];
    }

    return view(photoResourceLens, photo);
};

export const photoVariantsResolver = (photo) => set(
    photoVariantsLens,
    variantResolver(getResourceId(photo)),
    photo
);

export const transformNonNullPhoto = curry((photoLens, photoHolder) => {
    if (view(photoLens, photoHolder) == null || isEmpty(view(photoLens, photoHolder))) {
        return set(photoLens, null, photoHolder);
    }
    return over(photoLens, photoVariantsResolver, photoHolder);
});
