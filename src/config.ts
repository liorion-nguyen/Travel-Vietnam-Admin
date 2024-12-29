import { getSiteURL } from '@/lib/get-site-url';
import { LogLevel } from '@/lib/logger';

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string };
  logLevel: keyof typeof LogLevel;
}

export const config: Config = {
  site: { name: 'Travel Vietnam', description: '', themeColor: '#090a0b', url: getSiteURL() },
  logLevel: (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ?? LogLevel.ALL,
};

export const envConfig = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  socketURL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
};

export const localStorageConfig = {
  accessToken: 'jwt-access-token',
  refreshToken: 'jwt-refresh-token',
};
