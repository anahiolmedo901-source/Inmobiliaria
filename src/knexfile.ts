import path from 'path';
import type { Knex } from 'knex';
import { ENV } from './config/env';

function buildConnection(): Knex.Config['connection'] {
  const base: Knex.StaticConnectionConfig = {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  };
  if (ENV.DB_SSL) {
    return { ...base, ssl: { rejectUnauthorized: false } };
  }
  return base;
}

const config: Knex.Config = {
  client: ENV.DB_CLIENT,
  connection: buildConnection(),
  pool: { min: 2, max: 10 },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds'),
    extension: 'ts',
  },
};

export default config;
