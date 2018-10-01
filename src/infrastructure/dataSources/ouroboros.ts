import {RESTDataSource} from 'apollo-datasource-rest';

export class Ouroboros extends RESTDataSource {
    public baseURL = '';

    public async mutate(mutationType, root, args, context, info) {
        return {};
    }

    public async resolveType(resolverType, root, args, context, info) {
        return {};
    }
}
