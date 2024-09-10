import
  axios
from 'axios';

import {
  DataStore,
} from 'common';

const setAuthHeader = (headers = {}) => {

  const accessToken = DataStore.get('ACCESS_TOKEN');

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

export const get = async (url, headers = {}) => {

  headers = setAuthHeader(headers);

  return await axios.get(
    url,
    {
      headers: headers,
    }
  );
}

export const post = async (url, data, headers = {}, options = {}) => {

  headers = setAuthHeader(headers);

  const requestOptions = {
    headers: headers,
    ...options,
  };

  return await axios.post(
    url,
    data,
    requestOptions,
  );
}

export const put = async (url, data, headers = {}) => {

  headers = setAuthHeader(headers);

  return await axios.put(
    url,
    data,
    {
      headers: headers,
    }
  );
}

export const patch = async (url, data, headers = {}) => {

  headers = setAuthHeader(headers);

  return await axios.patch(
    url,
    data,
    {
      headers: headers,
    }
  );
}

export const deleteCall = async (url, data, headers = {}) => {

  headers = setAuthHeader(headers);

  return await axios.delete(
    url,
    {
      headers: headers,
      data,
    }
  );
}
