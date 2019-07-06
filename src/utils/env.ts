if (!process.env.API_BASE)
  throw new Error('Env variable API_BASE is not defined');
export const API_BASE = process.env.API_BASE;

if (!process.env.NODE_ENV)
  throw new Error('Env variable NODE_ENV is not defined');
export const NODE_ENV = process.env.NODE_ENV;
