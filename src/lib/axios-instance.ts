import axios, { type AxiosError, type AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

import { envConfig, localStorageConfig } from '@/config';

import { type SuccessResponse } from './auth/client';

interface RefreshTokenResponse {
  access_token: string;
}

const ACCESS_TOKEN = localStorageConfig.accessToken;
const REFRESH_TOKEN = localStorageConfig.refreshToken;
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = envConfig.serverURL;

const setupAxiosInterceptors = (_onUnauthenticated: () => void): void => {
  const onRequestSuccess = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      if (!config.headers) {
        config.headers = {} as AxiosHeaders;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = (response: AxiosResponse): AxiosResponse => response;

  const onResponseError = async (err: AxiosError): Promise<never> => {
    if (err) {
      const status = err.response?.status;

      if (status === 403 || status === 401) {
        try {
          const refreshToken = Cookies.get(REFRESH_TOKEN);

          if (!refreshToken) {
            localStorage.removeItem(ACCESS_TOKEN);
          } else {
            const newAccessToken: AxiosResponse<SuccessResponse<RefreshTokenResponse>> = await axios.post(
              `${envConfig.serverURL}/auth/refresh-token`,
              {
                refresh_token: refreshToken,
              }
            );

            if (newAccessToken.data.data) {
              localStorage.setItem(ACCESS_TOKEN, newAccessToken.data.data?.access_token);
              const originalRequest = err.config!;
              originalRequest.headers.Authorization = `Bearer ${newAccessToken.data.data.access_token}`;
              return axios(originalRequest);
            }
          }
        } catch (error) {
          localStorage.removeItem(ACCESS_TOKEN);
          window.location.reload();
          toast.error('Your session has expired. Please log in again.');
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export { setupAxiosInterceptors, axios };
