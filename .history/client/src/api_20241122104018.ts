import axios from 'axios';

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export default api;