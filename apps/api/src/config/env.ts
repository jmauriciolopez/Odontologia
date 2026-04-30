import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT || '5432', 10),
    USER: process.env.DB_USER || 'postgres',
    PASS: process.env.DB_PASSWORD || 'postgres',
    NAME: process.env.DB_NAME || 'odontologia',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'secret-key',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  },
  WHATSAPP: {
    API_URL: process.env.WHATSAPP_API_URL || 'http://localhost:8080',
    API_KEY: process.env.WHATSAPP_API_KEY || 'apikey',
    INSTANCE: process.env.WHATSAPP_INSTANCE || 'Main',
    ENABLED: process.env.WHATSAPP_ENABLED === 'true',
  },
};
