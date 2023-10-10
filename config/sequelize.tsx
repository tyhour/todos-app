import * as pg from "pg";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres", // or 'postgresql'
  dialectModule: pg,
  host: "ep-tiny-dew-85797222.ap-southeast-1.aws.neon.tech",
  username: "tyhour",
  password: "mEGC4fQrp9Uc",
  database: "neondb",
  port: 5432, // Default PostgreSQL port
  dialectOptions: {
    ssl: {
      require: true, // This enforces SSL
    },
  },
  logging: false, // Disable logging if needed
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
