// Pool de conexiones a PostgreSQL.
// Reutiliza conexiones en vez de abrir una nueva por request.
import pg from 'pg';
import { dbConfig } from './config.js';

const { Pool } = pg;

export const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

// Helper para consultas parametrizadas (previene inyección SQL).
export const query = (text, params) => pool.query(text, params);
