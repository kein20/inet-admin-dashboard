import axios from 'axios';

const api = axios.create({
    baseURL: 'inet-admin-dashboard-production.up.railway.app',
});

export default api;