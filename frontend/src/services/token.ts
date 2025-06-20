import { InternalAxiosRequestConfig } from 'axios';

import { AUTH_REFRESH_TOKEN_KEY_NAME, AUTH_TOKEN_KEY_NAME, TOKEN_EXPIRATION_KEY_NAME } from '~/conts';
import { postAuthRefresh } from '~/generated-api/auth/auth';

const setTokens = (accessToken: string, refreshToken: string, expiresIn: number): void => {
  localStorage.setItem(AUTH_TOKEN_KEY_NAME, accessToken);
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY_NAME, refreshToken);
  localStorage.setItem(TOKEN_EXPIRATION_KEY_NAME, (Date.now() + expiresIn * 1000).toString());
};

const clearTokens = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY_NAME);
  localStorage.removeItem(TOKEN_EXPIRATION_KEY_NAME);
};

export const refreshAuthLogic = async (failedRequest: InternalAxiosRequestConfig) => {
  try {
    const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY_NAME);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await postAuthRefresh({ refreshToken: refreshToken });
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = response;

    setTokens(accessToken, newRefreshToken || refreshToken, expiresIn);

    failedRequest.headers['Authorization'] = `Bearer ${accessToken}`;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY_NAME);
  const expiration = localStorage.getItem(TOKEN_EXPIRATION_KEY_NAME);

  if (token && expiration && Date.now() < Number(expiration)) {
    return token;
  }

  return null;
};

export const saveToken = (token: string, refreshToken: string, expiresIn: number): void => {
  setTokens(token, refreshToken, expiresIn);
};

export const dropToken = (): void => {
  clearTokens();
};
