import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "../.env" });

let sequelize;

// First try to use the connection URI if available
if (process.env.POSTGRES_URI) {
  console.log("Using PostgreSQL connection URI");

  sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: "postgres",
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Fall back to individual connection parameters
  console.log("Using individual PostgreSQL connection parameters");

  const isCloudDB =
    process.env.POSTGRES_HOST &&
    process.env.POSTGRES_HOST.includes("neon.tech");

  sequelize = new Sequelize(
    process.env.POSTGRES_DB || "smiley",
    process.env.POSTGRES_USER || "postgres",
    process.env.POSTGRES_PASSWORD || "postgres",
    {
      host: process.env.POSTGRES_HOST || "localhost",
      port: process.env.POSTGRES_PORT || 5432,
      dialect: "postgres",
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      // Add SSL configuration for cloud databases
      ...(isCloudDB && {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // for self-signed certs
          },
        },
      }),
    }
  );
}

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL database:", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
