import axios from 'axios';

const api = axios.create({
    baseURL: 'https://inet-admin-dashboard-production.up.railway.app',
});

export default api;