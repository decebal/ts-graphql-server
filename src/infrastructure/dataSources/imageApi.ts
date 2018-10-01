import { RESTDataSource } from 'apollo-datasource-rest';
import { MEDIA_SERVICE_HOST, MEDIA_SERVICE_PORT } from '../../app/environment/const';

const port: number = parseInt(MEDIA_SERVICE_PORT);
const host: string = MEDIA_SERVICE_HOST.toString();
const serviceAddress: string = [host, port].join(':');

export class ImageApi extends RESTDataSource {
  public baseURL = serviceAddress;

  public async getVariant(resourceId, variantName) {
    const json = await this.get(
      `/variant`,
      { resourceId, variantName },
      { cacheOptions: { ttl: 3650 * 24 * 60 * 60 } }
    );
    return json.data;
  }
}
