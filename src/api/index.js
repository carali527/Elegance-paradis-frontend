import axios from 'axios';

const baseURL = import.meta.env.VITE_APP_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 
      if (isRefreshing) {
        return handleRequestQueue(originalRequest);
      }
      isRefreshing = true; 
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const newAccessToken = await refreshAccessToken();
        processQueue(null, newAccessToken); 
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
      } catch (refreshError) {
        processQueue(refreshError, null); 
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false; 
      }
    }
    return Promise.reject(error); 
  }
);

function handleRequestQueue(originalRequest) {
  return new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  })
  .then(token => {
    originalRequest.headers['Authorization'] = 'Bearer ' + token;
    return apiClient(originalRequest);
  })
  .catch(err=> {
    Promise.reject(err)
  });
}

async function refreshAccessToken() {
  try {
    const getRefreshToken = localStorage.getItem('refreshToken');
    const getAccessToken = localStorage.getItem('accessToken');
    const response = await apiClient.post('/Auth/RefreshToken', {
      accessToken: getAccessToken, refreshToken: getRefreshToken
    });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    window.location.reload();
  } catch (error) {
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('refreshToken');

    throw error;
  }
}

function handleLogout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/'; 
}

export default apiClient;

export const createAccount = (accountData) => {
  return apiClient.post('/Account/CreateAccount', accountData);
};

export const login = (credentials) => {
  return apiClient.post('/Auth/Login', credentials)
    .then(response => {
      const { accessToken, refreshToken } = response.data;

      if (response.accountStatus !== 1){
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      return response.data;
    })
    .catch(error => {
      console.log('error =',error)
      throw error;
    })
};

export const logout = () => {
  const token = localStorage.getItem('accessToken');
  return apiClient.post(`/Auth/Logout?refreshToken=${token}`)
  .then(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  });
};

export const ResendVerifyEmail = (email) => {
  return apiClient.post('/Account/ResendVerifyEmail', email);
};

export const getAccount = () => {
  return apiClient.get('/Account/GetAccount');
};

export const updateCustomerInfo = (id, customerInfo) => {
  return apiClient.put(`/Account/UpdateCustomerInfo/${id}`, customerInfo);
};

export const updateCustomerPassword = (id, passwords) => {
  return apiClient.put(`/Account/UpdateCustomerPassword/${id}`, passwords);
};

export const fetchCategories = () => {
  return apiClient.get('/Category');
};

export const fetchAllProducts = (categoryId) => {
  return apiClient.get(`/Product/GetProductsByCategory/${categoryId}`);
};

export const fetchProduct = (categoryId) => {
  return apiClient.get(`/Product/GetProductById/${categoryId}`);
};

export const fetchForgetPassword = (email) => {
  return apiClient.post('/Account/ForgetPassword', email);
};

export const fetchResetPassword = (password) => {
  return apiClient.post('/Account/ResetAccountPassword', password);
};

export const fetchVerifyEmail = (encodingParameter) => {
  return apiClient.get(`/Account/VerifyEmail/${encodingParameter}`);
};

// 購物車
export const fetchAddToCart = (item) => {
  return apiClient.post('/Cart/AddCartItem', item);
};

export const fetchCartItems = (accountId) => {
  return apiClient.get(`/Cart/GetCartItems/${accountId}`);
};

export const fetchUpdateCart = (detail) => {
  return apiClient.patch('/Cart/UpdateCartItems', detail);
};

export const fetchCreateOrder = (order) => {
  return apiClient.post('/Order/CreateOrder', order);
};

export const fetchDeleteCartItem = (order) => {
  return apiClient.post('/Cart/DeleteCartItem', order);
};

// 訂單

// 取得所有訂單
export const fetchAllOrders = (accountId) => {
  return apiClient.get(`/Order/GetOrderList/${accountId}`);
};

// 取得單筆訂單
export const fetchOrder = (orderId) => {
  return apiClient.get(`/Order/GetOrder?orderId=${orderId}`);
};

// GetOrderListByStatus
export const fetchGetOrderListByStatus = (accountId) => {
  return apiClient.get(`/Order/GetOrderListByStatus/${accountId}`);
};

// LinePay link
export const fetchGetPayOrder = (orderId) => {
  return apiClient.get(`/LinePay/PayOrder?orderId=${orderId}`);
};