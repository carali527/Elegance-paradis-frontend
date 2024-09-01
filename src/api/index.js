import axios from 'axios';
const baseURL = import.meta.env.VITE_APP_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 全局變量，用於控制刷新 token 的狀態
let isRefreshing = false;
let failedQueue = [];

// 用於處理請求隊列
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

// 添加攔截器，把 token 添加到請求頭中
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return apiClient(originalRequest);
      }).catch(err => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/Auth/RefreshToken', {
        refreshToken: refreshToken,
      });

      // 提取新的 accessToken 和 refreshToken
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // 更新 accessToken 和 refreshToken
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // 處理等待的請求隊列
      processQueue(null, accessToken);

      // 使用新的 accessToken 重試原始請求
      originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';  // 將用戶重定向到登入頁面
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
});

// 將 apiClient 導出以便在其他地方使用
export default apiClient;


export const createAccount = (accountData) => {
  return apiClient.post('/Account/CreateAccount', accountData);
};

export const login = (credentials) => {
  return apiClient.post('/Auth/Login', credentials)
    .then(response => {
      const { accessToken, refreshToken } = response;

      if (response.accountStatus !== 1){
        // 存到 localStorage
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
  return apiClient.post('/Auth/Logout', { token }).finally(() => {
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