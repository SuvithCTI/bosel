import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env as well as root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const { Pool } = pg;

// Neon PostgreSQL connection configuration
const connectionString = process.env.DATABASE_URL;

let pool = null;
let isConnected = false;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Neon requires SSL
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      console.error('[Neon Postgres] Unexpected pool error:', err.message);
    });

    console.log('[Neon Postgres] Pool configured with provided connection string.');
  } catch (err) {
    console.warn('[Neon Postgres] Failed to initialize pool:', err.message);
  }
} else {
  console.warn('[Neon Postgres] No DATABASE_URL found in environment variables. Running in fallback mode.');
}

/**
 * Execute a SQL query against Neon Postgres with automatic error handling
 */
export async function query(text, params) {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured. Please add your Neon connection string to .env');
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Neon DB Query] (${duration}ms) ${text.slice(0, 100).replace(/\s+/g, ' ')}`);
    }
    return res;
  } catch (error) {
    console.error('[Neon DB Error]:', error.message, '\nQuery:', text);
    throw error;
  }
}

/**
 * Test database connectivity
 */
export async function testConnection() {
  if (!pool) return false;
  try {
    const res = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
    isConnected = true;
    console.log(`[Neon Postgres] Connected to ${res.rows[0].db_name} at ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    console.warn('[Neon Postgres] Connectivity test failed:', err.message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected && Boolean(pool);
}

export default {
  query,
  testConnection,
  isDbConnected,
  getPool: () => pool
};
