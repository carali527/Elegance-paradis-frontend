import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Fragrances from '@/views/Fragrances.vue'
import Fragrance from '@/views/Fragrance.vue';
import Account from '@/views/Account.vue';
import Orders from '@/views/Orders.vue';
import CartStep1 from '@/views/CartStep1.vue';
import CartStep2 from '@/views/CartStep2.vue';
import ConfirmPayment from '@/views/ConfirmPayment.vue';
import WishList from '@/views/WishList.vue';
import NotFound from '@/views/NotFound.vue';
import VerifyEmail from '@/views/VerifyEmail.vue';
import ForgetPassword from '@/views/ForgetPassword.vue';
import { useUserStore } from '@/stores/userStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/fragrances/:id/:subCategoryId?',
      name: 'Fragrances',
      component: Fragrances
    },
    {
      path: '/fragrance/:id',
      name: 'Fragrance',
      component: Fragrance
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    },
    {
      path: '/cart/step1',
      name: 'CartStep1',
      component: CartStep1
    },
    {
      path: '/cart/step2',
      name: 'CartStep2',
      component: CartStep2,
      beforeEnter: (to, from, next) => {
        // 檢查是否從 /cart/step1 來
        if (from.path === '/cart/step1') {
          next(); // 允許導航
        } else {
          next('/cart/step1'); // 否則重定向到 /cart/step1
        }
      }
    },
    {
      path: '/cart/finish',
      name: 'ConfirmPayment',
      component: ConfirmPayment
    },
    {
      path: '/wishlist',
      name: 'WishList',
      component: WishList
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound,
      meta: { hideHeader: true }
    },
    {
      path: '/VerifyEmail',
      name: 'VerifyEmail',
      component: VerifyEmail,
      meta: { hideHeader: true }
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword,
      meta: { hideHeader: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (userStore.accountStatus === 1 && to.path !== '/VerifyEmail') {
    // 如果帳號未經驗證，且目標路徑不是驗證頁面，則重定向到驗證頁面
    next('/')
    userStore.showValidateEmailPopup(true)
  } else {
    next()
  }
})

export default router
