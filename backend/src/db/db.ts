import { Sequelize } from 'sequelize';

console.log('Sequelize DB Config:', {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD ? '***' : 'NOT SET',
});

export const sequelize = new Sequelize(
    process.env.PG_DATABASE || 'llm_eval',       // 'llm_eval'
    process.env.PG_USER || 'postgres',           // 'postgres'
    process.env.PG_PASSWORD || 'postgres',       // 'postgres'
    {
        host: process.env.PG_HOST || 'db', // fallback to 'db' if PG_HOST is not set
        port: Number(process.env.PG_PORT), // 5432
        dialect: 'postgres',
        logging: console.log,         // Optional: Logging aktivieren
    }
);