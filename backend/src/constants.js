import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "T3Sports";

export const allowedOrigins = process.env.ORIGINS.split(',');

export const port = process.env.PORT || 3001;

export const API_KEY = '12345678-abcd-90ef-ghij-klmnopqrstuv';
// export const API_KEY = '123-abc-456-def';