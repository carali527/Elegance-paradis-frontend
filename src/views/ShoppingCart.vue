<template>
  <div class="cart">
    <h1>您的購物車</h1>
    <div v-for="item in cartItems" :key="item.id" class="cart__item">
      <img :src="item.image" :alt="item.title" />
      <div class="cart__item-all">
        <h2>{{ item.title }}</h2>
        <div class="cart__item-details">
          <span>{{ item.description }}</span>
          <span>{{ item.size }}</span>
        </div>
        <div class="cart__item-actions">
          <button @click="removeItem(item.id)">移除</button>
          <button>移至願望清單</button>
        </div>
      </div>
      <div>
        <div class="cart__item-quantity">
          <!-- <label :for="'quantity-' + item.id">數量</label> -->
          <Dropdown v-model="item.quantity" options="quantity" :id="'quantity-' + item.id" class="cart__item-quantity-select" />
        </div>
        <span class="cart__item-price">NT$ {{ item.price }}</span>
      </div>
    </div>
    <div class="cart__summary">
      <h2>小計</h2>
      <div class="cart__summary-item">
        <span>運費（將於選擇配送方式後顯示）</span>
      </div>
      <div class="cart__summary-total">
        <span>所有商品</span>
        <span>NT$ {{ totalPrice }}</span>
      </div>
    </div>
    <div class="cart__actions">
      <button>繼續前往結帳</button>
      <a href="#">繼續購物</a>
    </div>
    <div class="cart__payment">
      <h2>付款方式</h2>
      <div class="cart__payment-methods">
        <!-- <img src="../assets/paymethod.webp" alt="creditcard" /> -->
      </div>
      <p>您的信用卡資訊安全無虞。所有資訊皆受安全通訊端層(SSL)技術妥善防護。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Dropdown from '../components/Dropdown.vue';

const cartItems = ref([
  {
    id: 1,
    title: '香奈兒藍色男性系列',
    description: '香奈兒藍色男性香精',
    size: '100ml',
    image: 'https://www.chanel.com/apac/img/prd-emea/sys-master/content/P1/h4b/h2b/9794397339678',
    price: 5650,
    quantity: 1
  },
  {
    id: 2,
    title: '香奈兒藍色男性系列',
    description: '香奈兒藍色男性香精',
    size: '100ml',
    image: 'https://www.chanel.com/images//t_one/t_fragrance//q_auto:good,f_auto,fl_lossy,dpr_1.1/w_160/bleu-de-chanel-parfum-spray-3-4fl-oz--packshot-default-107180-9539148775454.jpg',
    price: 2250,
    quantity: 1
  }
]);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
};
</script>

<style lang="scss" scoped>
.cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
  }
}

.cart__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  img {
    max-width: 100px;
  }
}

.cart__item-all {
  flex: 1;
  margin-left: 20px;
  h2 {
    text-align: left;
    margin: 5px;
    font-size: 18px;
  }
}

.cart__item-details {
  text-align: left;
  color: #888;
  span:first-of-type {
    color: #888;
    margin: 5px;
  }
}

.cart__item-actions {
  display: flex;
  gap: 10px;
  button {
    padding: 5px 10px;
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: #000;
    }
  }
}
.cart__item-quantity {
  position: relative;
  display: flex;
  align-items: center;
  label {
    margin-right: 10px;
  }
}

.cart__item-quantity-select {
  width: 100%;
}

.cart__item-price {
  font-size: 18px;
}

.cart__summary {
  padding-top: 20px;
  margin-top: 20px;
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
}

.cart__summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cart__summary-link {
  text-decoration: underline;
  cursor: pointer;
}

.cart__summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  span:nth-of-type(2) {
    font-size: 18px;
  }
}

.cart__actions {
  text-align: center;
  margin-top: 20px;
  button {
    width: 100%;
    padding: 15px;
    background-color: #000;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 10px;
  }
  a {
    display: inline-block;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    &:hover {
      color: #000;
      text-decoration: underline;
    }
  }
}

.cart__payment {
  text-align: center;
  margin-top: 40px;
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  p {
    color: #888;
  }
}

.cart__payment-methods {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  img {
    width: 30%;
  }
}

@media (max-width: 768px) {
  .cart__item-actions {
    flex-direction: column;
    padding: 5px;
  }
}

@media (max-width: 567px) {
  .cart__payment-methods {
    img {
      width: 50%;
    }
  }
}
</style>
