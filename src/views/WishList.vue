<template>
  <h2>願望清單</h2>
  <p>登錄或創建帳戶後您可以在任何地方訪問您的願望清單</p>
  <div class="products__list" ref="productList">
    <Item
        v-for="product in products" 
        :key="product.id"
        :product="product"
      />
  </div>
</template>
  
<script setup>
import Item from '../components/Item.vue'
import { ref } from 'vue'
  
const products = ref([
  {
    id: 1,
    name: '香奈兒嘉柏麗香水1',
    description: '香奈兒嘉柏麗隨機噴香霧',
    price: '2,230',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
  {
    id: 2,
    name: '香奈兒嘉柏麗香水2',
    description: '香奈兒嘉柏麗流金隨身香水',
    price: '5,700',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
  {
    id: 3,
    name: '香奈兒嘉柏麗香水3',
    description: '香奈兒嘉柏麗流金香水',
    price: '4,800',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
  {
    id: 3,
    name: '香奈兒嘉柏麗香水3',
    description: '香奈兒嘉柏麗流金香水',
    price: '4,800',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
  {
    id: 3,
    name: '香奈兒嘉柏麗香水3',
    description: '香奈兒嘉柏麗流金香水',
    price: '4,800',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
  {
    id: 3,
    name: '香奈兒嘉柏麗香水3',
    description: '香奈兒嘉柏麗流金香水',
    price: '4,800',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
  {
    id: 3,
    name: '香奈兒嘉柏麗香水3',
    description: '香奈兒嘉柏麗流金香水',
    price: '4,800',
    image: 'https://www.chanel.com/images//t_one//w_0.51,h_0.51,c_crop/q_auto:good,f_autoplus,fl_lossy,dpr_1.1/w_840/gabrielle-chanel-hair-mist-1-35fl-oz--packshot-default-120870-9545536995358.jpg',
    isFaded: false
  },
]);
</script>
  
<style lang="scss" scoped>
p {
  color: rgba(0, 0, 0, 0.6);;
}
.products__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 20px;
}

@media (max-width: 1024px) {
  .products__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 20px;
  }
}

@media (max-width: 567px) {
  .products__list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    padding: 20px;
  }
}
</style>
  