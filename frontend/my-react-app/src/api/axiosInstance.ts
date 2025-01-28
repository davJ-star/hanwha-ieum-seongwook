import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot 서버 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;