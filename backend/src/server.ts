import app from './app';
import { config } from './config/env';
import { pool } from './config/database';

async function startServer() {
  try {
    const conn = await pool.getConnection();
    await conn.execute('SELECT 1');
    conn.release();
    console.log('✅ MySQL connected to Aiven');

    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
      console.log(`   Environment : ${config.env}`);
      console.log(`   Database    : ${config.db.host}:${config.db.port}/${config.db.name}`);
      console.log(`   API Base    : http://localhost:${config.port}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }
}

startServer();
