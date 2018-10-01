import {mutation} from '../model/resolvers/mutation';
import {rootResolver} from '../model/resolvers/rootResolver';


const resolvers = {
    Mutation: {
        StoreUser: mutation('StoreUser'),
    },
    Query: {
        users: rootResolver('users'),
        viewer: rootResolver('viewer'),
    },
};

export {resolvers};
