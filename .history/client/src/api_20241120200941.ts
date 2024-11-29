import axios from 'axios';
import config from './envConfig';

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export default api;