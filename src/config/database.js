import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '35432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    console.log('  Server time:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
}

export async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

export async function executeInTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Execute without transaction (auto-commit each statement)
export async function executeWithClient(callback) {
  const client = await pool.connect();
  try {
    const result = await callback(client);
    return result;
  } catch (error) {
    console.error('Execution error:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool() {
  await pool.end();
  console.log('✓ Database connection pool closed');
}

export default pool;
