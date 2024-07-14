import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://eleganceparadis.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const fetchCategories = () => {
  return apiClient.get('/Category');
};

export const fetchAllProducts = (categoryId) => {
  return apiClient.get(`/Product/GetProductsByCategory/${categoryId}`);
};

export const fetchProduct = (categoryId) => {
  return apiClient.get(`/Product/GetProductById/${categoryId}`);
};