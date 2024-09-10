import {
  get
} from './axios';

import {
  Environment,
  Utils
} from 'common';

export class MapApi {

  static async getMapSystemData() {
    try {
      const res = await get(`${Environment.apiHost}/api/map/get-systems`);
      return Utils.resolveHttpResponse(res);
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async getZonesByLocation(lat, lng) {
    try {
      const res = await get(`${Environment.apiHost}/api/map/get-zones-by-location?lat=${lat}&lng=${lng}`);
      return Utils.resolveHttpResponse(res);
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }
}