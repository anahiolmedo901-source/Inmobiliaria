/**
 * migrate.ts – Ejecuta migraciones sin depender del CLI de knex.
 * Compatible con Supabase (PostgreSQL con SSL).
 *
 * Uso:  npx tsx src/migrate.ts          (ejecuta migraciones)
 *       npx tsx src/migrate.ts rollback  (revierte la última)
 */
import knex, { type Knex } from 'knex';
import { ENV } from './config/env';
import { up, down } from './migrations/001_initial';

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

async function run() {
  const action = process.argv[2]; // undefined | 'rollback'

  const db = knex({
    client: ENV.DB_CLIENT,
    connection: buildConnection(),
    pool: { min: 1, max: 1 },
  });

  try {
    if (action === 'rollback') {
      console.log('[Migrate] Revirtiendo migración…');
      await down(db);
      console.log('[Migrate] Reversión completada');
    } else {
      console.log('[Migrate] Ejecutando migraciones…');
      await up(db);
      console.log('[Migrate] Migraciones completadas');
    }
  } catch (err) {
    console.error('[Migrate] Error:', err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

run();
