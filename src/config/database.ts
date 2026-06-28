import knex, { type Knex } from 'knex';
import { ENV } from './env';

let db: Knex | null = null;

function buildConnection(): Knex.Config['connection'] {
  const base: Knex.StaticConnectionConfig = {
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
  };

  // Supabase (y otros Postgres remotos) requieren SSL
  if (ENV.DB_SSL) {
    return {
      ...base,
      ssl: { rejectUnauthorized: false },
    };
  }

  return base;
}

export function getDb(): Knex {
  if (!db) {
    db = knex({
      client: ENV.DB_CLIENT,
      connection: buildConnection(),
      pool: { min: 2, max: 10 },
    });
  }
  return db;
}

export async function testConnection(): Promise<void> {
  try {
    await getDb().raw('SELECT 1');
    console.log('[DB] Conexión exitosa a Supabase/PostgreSQL');
  } catch (err) {
    console.error('[DB] Error de conexión:', err);
    throw err;
  }
}
