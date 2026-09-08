import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look for .env files in multiple standard locations
const possibleEnvPaths = [
  path.join(process.cwd(), 'backend', '.env'),
  path.join(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
  path.resolve(__dirname, '..', '..', '..', '.env'),
];

for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
// Also execute default dotenv config
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'leox_jwt_super_secret_production_key_2026',
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL || 'harsha@leox').toLowerCase(),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'leoX@4536',
  MONGO_URI: process.env.MONGO_URI || '',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'leox',
  EMAIL_HOST: process.env.EMAIL_HOST || '',
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'mesapamharsha@gmail.com',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
