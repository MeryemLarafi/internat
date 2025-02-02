import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-laravel-app.test/api', // Remplacez par l'URL de votre backend Laravel
});

export default api;
