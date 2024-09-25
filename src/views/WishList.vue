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
  
const products = ref([]);
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
  