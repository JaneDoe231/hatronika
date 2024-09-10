import {
  post
} from './axios';

import {
  Environment,
  Utils
} from 'common';

export class AuthApi {

  static async login({
    email,
    password
  }) {
    try {
      const res = await post(`${Environment.apiHost}/api/auth/login`, {
        email: email,
        password: password
      });

      let ret = Utils.resolveHttpResponse(res);
      return ret;
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async register({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    guid,
    otp
  }) {
    try {
      const res = await post(`${Environment.apiHost}/api/auth/register`, {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        otp,
        guid
      });
      
      let ret = Utils.resolveHttpResponse(res);
      return ret;
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async changePassword({
    email,
    password,
    guid,
    otp
  }) {
    try {
      const res = await post(`${Environment.apiHost}/api/auth/change-password`, {
        email,
        newPassword: password,
        otp,
        guid,
      });
      return Utils.resolveHttpResponse(res);
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async SendOtp({
    email
  }) {
    try {
      const res = await post(`${Environment.apiHost}/api/auth/otp/send`, {
        email: email
      });

      return Utils.resolveHttpResponse(res);
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async resendOtp({
    email,
    guid
  }) {
    try {
      const res = await post(`${Environment.apiHost}/api/auth/otp/resend`, {
        email: email,
        guid: guid
      });

      return Utils.resolveHttpResponse(res);
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }

  static async verifyOtp({
    email,
    otp,
    guid
  }) {
    try {
      const res = await post(`${Environment.apiHost}/api/auth/otp/verify`, {
        email,
        otp,
        guid
      });

      return Utils.resolveHttpResponse(res);
    } catch (err) {
      return Utils.resolveHttpRejected(err);
    }
  }
}