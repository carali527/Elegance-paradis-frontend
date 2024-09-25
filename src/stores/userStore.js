import { defineStore } from 'pinia'
import VueCookies from 'vue-cookies'

import {
  getAccount,
  updateCustomerInfo,
  fetchCategories,
  fetchAllProducts,
  fetchProduct,
  fetchCartItems
} from '@/api/index'

export const useUserStore = defineStore('member', {
  state: () => ({
    // 處理未登入和 email 未驗證
    emaillForResendVerifyEmail: '',
    accountStatus: '',
    
    userInfo: null,
    allCategories: [],
    products: [],
    product: {},
    memberPopupVisible: false,
    alertMessagesVisible: false,
    alertMessagesStatus: true,
    forgetPasswordPopupVisible: false,
    alertMessages: '',
    cart: [],
    cartItems: 0,
    validateEmailPopupVisible: false,
    accessToken: null,
    refreshToken: null
  }),
  actions: {
    async fetchUserInfo() {
      const response = await getAccount();
      this.userInfo = response.data;
    },
    async updateCustomerInfo(id, customerInfo) {
      const response = await updateCustomerInfo(id, customerInfo);
      this.userInfo = response.data;
      return response;
    },
    async fetchCategories() {
      if (this.allCategories.length > 0) {
        return;
      }
      try {
        const response = await fetchCategories();
        this.allCategories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchAllProducts(categoryId) {
      try {
        const response = await fetchAllProducts(categoryId);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching all products:', error);
      }
    },
    async fetchProduct(categoryId) {
      try {
        const response = await fetchProduct(categoryId);
        this.product = response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
    showValidateEmailPopup(blooen) {
      this.validateEmailPopupVisible = blooen;
    },
    setAccessToken(token) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    setRefreshToken(token) {
      this.refreshToken = token
      localStorage.setItem('refreshToken', token)
    },
    loadTokens() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
    },
    logout() {
      this.$reset()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    isMemberPopupVisible(blooen) {
      this.memberPopupVisible = blooen;
    },
    isAlertMessagesShow({ visible, message, status }) {
      this.alertMessagesVisible = visible;
      if (message !== undefined) {
        this.alertMessages = message;
      }
      if (status !== undefined) {
        this.alertMessagesStatus = status;
      }
    },
    addToCart(number) {
      this.cartItems = number;

      // 功能：未登入的情況下加入購物車，會先加入cookie，然後再使用者登入後帶進
      // if (!this.userInfo) {
      //   let cart = VueCookies.get('cart') || [];
      //   cart.push(productID);
      //   VueCookies.set('cart', cart);
      //   console.log('商品已添加到Cookie中的購物車');
      // }
    },
    unverifiedEmail({ status, email }) {
      this.accountStatus = status;
      this.emaillForResendVerifyEmail = email;
    },
    closeAllPopup() {
      this.validateEmailPopupVisible = false;
      this.memberPopupVisible = false;
      this.alertMessagesVisible = false;
      this.forgetPasswordPopupVisible = false;
    },
    isForgetPasswordPopupVisible(blooen) { 
      this.forgetPasswordPopupVisible = blooen;
    },
    async fetchCartItems(accountId) {
      try {
        const response = await fetchCartItems(accountId);
        this.cart = response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    },
    updateCartItems(cart) {
      this.cart = cart;
    },
  }
})
