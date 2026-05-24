// Carga las variables de entorno (.env) y las expone tipadas.
// Este módulo es importado por todos los demás, así que dotenv.config()
// se ejecuta antes de que nadie lea process.env.
import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cambiar';
export const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

// Si hay DATABASE_URL la usamos; si no, armamos la config con PG* sueltas.
export const dbConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'restaurante',
    };
