import axios from 'axios'
import { Promise } from 'core-js'
import store from "../store"
import Cookies from "js-cookie"

const instance = axios.create({
    baseURL: 'https://api.1kole.com/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60000
})

instance.interceptors.request.use((config) => {
    const hasLogged = store.getters.hasLogged
    
    if (hasLogged) {
        const token = store.getters.accessToken
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// Interceptor de resposta
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Caso o token seja inválido (401)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Remove o refreshKey e redireciona para o login
            Cookies.remove("refresh_token_key")
            console.warn('Token expirado. Redirecionando para o login...');
            window.location.href = '/';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 404) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 500) {
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
export default instance