import axios from "axios";

// const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// export const api = axios.create({
//   baseURL,
//   withCredentials: true,
// });
const envBase =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api`
      : "/api";

export const api = axios.create({
  baseURL: envBase,
  withCredentials: true,
});