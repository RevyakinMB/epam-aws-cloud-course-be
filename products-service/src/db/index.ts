import { PoolConfig, Pool } from 'pg';

let pool: Pool;

const createPool = () => {
  if (pool) {
    throw new Error('Connection pool is already created.');
  }

  const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
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
    console.error('Unexpected error on idle client', e);
    process.exit(-1);
  });
};

export const end = () => {
  if (pool) {
    return pool.end();
  }
  return Promise.resolve();
}

export const query = async <T>(sql: string, params: Array<string | number | null> = []) => {
  if (!pool) {
    await createPool();
  }

  const connection = await pool.connect();
  try {
    const response = await connection.query<T>(sql, params);
    return response;
  } catch (err) {
    console.error(err);
    throw new Error('sql query error.');
  } finally {
    connection.release();
  }
};
