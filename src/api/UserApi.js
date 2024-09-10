import {
  put,
  get
} from './axios';

import {
  Environment,
  Utils
} from 'common'

export class UserApi {
  static async getUserInfo() {
    try {
      const res = await get(`${Environment.apiHost}/api/users`);

      let ret = Utils.resolveHttpResponse(res);
      return ret;
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async updateUserInfo(information) {
    try {
      const res = await put(`${Environment.apiHost}/api/users`, information);

      let ret = Utils.resolveHttpResponse(res);
      return ret;
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }
}