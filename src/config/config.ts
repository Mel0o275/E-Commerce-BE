export const PORT = process.env.PORT;

export const DB_URI = process.env.DB_URI;

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

export const USER_TOKEN_SECRET_KEY = process.env.USER_TOKEN_SECRET_KEY as string;
export const REFRESH_USER_TOKEN_SECRET_KEY = process.env.REFRESH_USER_TOKEN_SECRET_KEY as string;;
export const SYSTEM_TOKEN_SECRET_KEY = process.env.SYSTEM_TOKEN_SECRET_KEY as string;
export const REFRESH_SYSTEM_TOKEN_SECRET_KEY = process.env.REFRESH_SYSTEM_TOKEN_SECRET_KEY as string;
export const REDIS_URL = process.env.REDIS_URL!;