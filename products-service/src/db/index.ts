import { PoolConfig, Pool } from 'pg';

import logger from '@src/utils/logger';

let pool: Pool;

const createPool = () => {
  if (pool) {
    throw new Error('Connection pool is already created.');
  }

  const {
    PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD,
  } = process.env;
  const connectionConfig: PoolConfig = {
    host: PG_HOST,
    port: parseInt(PG_PORT, 10),
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 1000,
  };

  pool = new Pool(connectionConfig);

  pool.on('error', (e) => {
    logger.error('Unexpected error on idle client', e);
    process.exit(-1);
  });
};

export const end = () => {
  if (pool) {
    return pool.end().then(() => {
      pool = undefined;
    });
  }
  return Promise.resolve();
};

export const query = async <T>(sql: string, params: Array<string | number | null> = []) => {
  if (!pool) {
    await createPool();
  }

  try {
    const response = await pool.query<T>(sql, params);
    return response;
  } catch (err) {
    logger.error(err);
    throw new Error('sql query error.');
  }
};

export const execInTx = async (txFn) => {
  if (!pool) {
    await createPool();
  }

  const tx = await pool.connect();
  try {
    await tx.query('begin');
    const response = await txFn(tx);
    await tx.query('commit');

    return response;
  } catch (err) {
    logger.error(err);
    try {
      await tx.query('rollback');
    } catch (rollbackErr) {
      logger.error(rollbackErr);
    }
    throw new Error('sql query error.');
  } finally {
    tx.release();
  }
};
