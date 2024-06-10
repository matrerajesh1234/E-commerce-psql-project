import pg from "pg";
const Pool = pg.Pool;

process.loadEnvFile(".env");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const connectDatabase = (req, res, next) => {
  pool
    .connect()
    .then(() => {
      console.log(`Database connected Successfully`);
    })
    .catch((error) => {
      console.log(`Databse Falied to connect: ${error.message}`);
    });
};

export default pool;
