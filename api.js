import axios from 'axios';

// IMPORTANT: Use your computer's real IP address here
const API_BASE_URL = 'http://192.168.1.7:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;