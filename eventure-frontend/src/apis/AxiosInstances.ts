import axios from 'axios';

export const javaBackendAxiosInstance = axios.create({
    baseURL:"http://localhost:8080/api"
})

export const nodeBackendAxiosInstance = axios.create({
    baseURL:"http://localhost:8000"
})

export const setAuthHeader = (authToken) => {
    if (authToken) {
        javaBackendAxiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        nodeBackendAxiosInstance.defaults.headers.common.Authorization = `Bearer ${authToken}`;
    }
};

export const removeAuthHeader = () => {
    javaBackendAxiosInstance.defaults.headers.common.Authorization = '';
    nodeBackendAxiosInstance.defaults.headers.common.Authorization = '';
};