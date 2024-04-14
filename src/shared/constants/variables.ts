export const FRONT_END_URL = process.env.NEXT_PUBLIC_FRONT_END_URL;
export const API_PATH = `${process.env.NEXT_PUBLIC_API_HOST}/${process.env.NEXT_PUBLIC_API_VERSION}`;
export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
export const AUTH_COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE || '';
export const AUTH_COOKIE_RECORD_VERSION = process.env.NEXT_PUBLIC_AUTH_COOKIE || '';
export const AUTH_COOKIE_REMEMBER_ME = process.env.AUTH_COOKIE_REMEMBER_ME || '';
export const COOKIE_EXPIRATION_DAYS = parseFloat(process.env.NEXT_PUBLIC_COOKIE_EXPIRATION_DAYS || '0.1');
export const COOKIE_REMEMBER_EXPIRATION_DAYS = parseFloat(
    process.env.NEXT_PUBLIC_COOKIE_REMEMBER_EXPIRATION_DAYS || '7'
);
