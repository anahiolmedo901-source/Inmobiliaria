import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde la raíz del backend (junto a package.json)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function req(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Falta variable de entorno: ${key}`);
  return val;
}

function opt(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

function bool(key: string, fallback: boolean): boolean {
  const val = process.env[key];
  if (val === undefined || val === '') return fallback;
  return val === 'true' || val === '1';
}

export const ENV = {
  DB_CLIENT: req('DB_CLIENT'),
  DB_HOST: req('DB_HOST'),
  DB_PORT: parseInt(req('DB_PORT'), 10),
  DB_USER: req('DB_USER'),
  DB_PASSWORD: req('DB_PASSWORD'),
  DB_NAME: req('DB_NAME'),
  DB_SSL: bool('DB_SSL', true),
  JWT_SECRET: req('JWT_SECRET'),
  JWT_EXPIRES_IN: opt('JWT_EXPIRES_IN', '7d'),
  PORT: parseInt(opt('PORT', '4000'), 10),
  HTTPS_PORT: parseInt(opt('HTTPS_PORT', '4100'), 10),
  SSL_KEY_PATH: opt('SSL_KEY_PATH', ''),
  SSL_CERT_PATH: opt('SSL_CERT_PATH', ''),
  NODE_ENV: opt('NODE_ENV', 'development'),
  CORS_ORIGIN: opt('CORS_ORIGIN', 'http://localhost:8081'),
} as const;
