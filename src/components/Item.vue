<template>
    <div class="products__item" ref="productItems">
      <div class="products__item-stick">
        <a :href="`/perfume/${product.productId}`">
          <i class="fa-regular fa-star"></i>
          <img :src="product.productImageUrl" :alt="product.productName">
          <h3>{{ product.productName }}</h3>
          <span>{{ product.description }}</span>
        </a>
        <span>NT$ {{ product.unitPrice }}</span>
        <button class="add-to-bag" @click="addToCart(product.productId)">
          <span>新增到購物車</span>
        </button>
      </div>
    </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore';
const userStore = useUserStore();
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
  a {
    position: relative;
    color: white;
    i.fa-star {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
  .add-to-bag {
    span {
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        background: #1d1d1d;
        transition: width 0.3s;
        margin-top: 5px;
      }

      &:hover::after {
        width: 100%;
      }
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