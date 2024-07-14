import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Fragrances from '@/views/Fragrances.vue'
import Perfume from '@/views/Perfume.vue';
import Account from '@/views/Account.vue';
import ShoppingCart from '@/views/ShoppingCart.vue';
import WishList from '@/views/WishList.vue';

const router = createRouter({
  history: createWebHashHistory('/EleganceParadisFrontend/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/fragrances',
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
      path: '/cart',
      name: 'ShoppingCart',
      component: ShoppingCart
    },
    {
      path: '/wishlist',
      name: 'WishList',
      component: WishList
    }
  ]
})

export default router
