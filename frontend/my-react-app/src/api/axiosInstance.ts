import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.124.88.193:8080', // Spring Boot 서버 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;