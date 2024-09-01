import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Fragrances from '@/views/Fragrances.vue'
import Perfume from '@/views/Perfume.vue';
import Account from '@/views/Account.vue';
import Orders from '@/views/Orders.vue';
import ShoppingCart from '@/views/ShoppingCart.vue';
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
      path: '/fragrances/:id',
      name: 'Fragrances',
      component: Fragrances
    },
    {
      path: '/perfume',
      name: 'Perfume',
      component: Perfume
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
      path: '/cart',
      name: 'ShoppingCart',
      component: ShoppingCart
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
