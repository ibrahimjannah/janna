import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

// use port-specific cookie name to avoid conflicts
const port = window.location.port || '8000';
window.axios.defaults.xsrfCookieName = `XSRF-TOKEN-${port}`;
window.axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
