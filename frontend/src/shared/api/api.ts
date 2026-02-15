import axios from 'axios';

const BACK_URL = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: BACK_URL,
  timeout: 5000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.name === 'CanceledError') {
      return Promise.reject(err);
    }
    console.error('API ERROR: ', err);
    return Promise.reject(err);
  },
);
