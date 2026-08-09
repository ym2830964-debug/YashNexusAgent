import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
  var _drizzleDb: any;
}

export const getDb = () => {
  if (!global._drizzleDb) {
    if (!process.env.SQL_HOST) {
      return null;
    }
    if (!global._postgresPool) {
      global._postgresPool = new Pool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DB_NAME,
        max: 10,
        connectionTimeoutMillis: 15000,
      });

      global._postgresPool.on('error', (err) => {
        console.error('Unexpected error on idle SQL pool client:', err);
      });
    }
    global._drizzleDb = drizzle(global._postgresPool, { schema });
  }
  return global._drizzleDb;
};

export const db: any = new Proxy({}, {
  get(_target, prop) {
    const instance = getDb();
    if (!instance) {
      throw new Error("Cloud SQL database is not configured (missing SQL_HOST environment variable).");
    }
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  }
});

