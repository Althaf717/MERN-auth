import axios from "axios";
const port = 8000
const baseUrl = `http://localhost:${port}/api`
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default instance;

  