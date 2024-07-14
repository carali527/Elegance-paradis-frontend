<template>
    <div class="products__item" ref="productItems">
      <div class="products__item-stick">
        <a href="#/perfume">
          <img :src="product.image" :alt="product.name">
          <h3>{{ product.name }}</h3>
          <span>{{ product.description }}</span>
        </a>
        <span>NT$ {{ product.price }}</span>
        <button class="add-to-bag" @click="addToCart(product.id)">
          <span>新增到購物車</span>
        </button>
      </div>
    </div>
</template>

<script setup>
import { useMemberStore } from '../stores/member';
const userStore = useMemberStore();

const props = defineProps({
  product: Object
})

const addToCart = (product) => {
  userStore.addToCart(1);
}
</script>

<style lang="scss" scoped>
.products__item {
  margin: auto;
  height: 100vh;
  text-align: center;
  max-width: 200px;
  box-sizing: border-box;
  transition: opacity 0.5s ease;
  img {
    width: 100%;
    height: auto;
  }
  a:hover {
    img {
      border-bottom: 1px solid #1d1d1d;
      transform: scale(1.1);
    }
  }
}

.products__item-stick {
  top: 70px;
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-position: center;
  background-size: cover;
  margin-top: 0;
  background-color: #ffffff;
}

</style>