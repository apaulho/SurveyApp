// lib/types.d.ts - Type declarations for external modules
declare module '../../../lib/neon-db' {
  import { Pool } from 'pg';
  const pool: Pool;
  export default pool;
  export { pool };
  export function query(text: string, params?: any[]): Promise<any>;
}
