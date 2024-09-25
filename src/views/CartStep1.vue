<template>
  <div class="cart">
    <h1>您的購物車</h1>
    <Loading v-if="isLoading" />
    <div v-else>
      <div v-for="item in cartItems" :key="item.cartId" class="cart__item">
        <img :src="item.productImage" :alt="item.title" />
        <div class="cart__item-content">
          <div class="cart__item-all">
            <h2>{{ item.productName }}</h2>
            <div class="cart__item-details">
              <span>{{ item.description }}</span>
              <select v-model="item.specName" @change="updateCartItem(item)">
                <option 
                  v-for="spec in item.specs" 
                  :key="spec.specName" 
                  :value="spec.specName" 
                  :disabled="spec.stock === 0"
                >
                  {{ spec.specName }} <span v-if="spec.stock === 0">(缺貨)</span>
                </option>
              </select>
            </div>
            <div class="cart__item-actions">
              <button @click="removeItem(item.cartId)">移除</button>
              <!-- <button>移至願望清單</button> -->
            </div>
          </div>
          <div>
            <div class="cart__item-quantity">
              <QuantitySelector 
                v-model="item.quantity" 
                :maxQuantity="computeMaxQuantity(item)" 
                class="cart__item-quantity-select" 
                @update:modelValue="updateCartItem(item)" 
              />
            </div>
            <span class="cart__item-price">NT$ {{ formatCurrency(item.unitPrice) }}</span>
          </div>
        </div>
      </div>
      <div v-if="cartItems.length > 0" class="cart__summary">
        <h2>小計</h2>
        <div class="cart__summary-item">
          <span>運費</span>
          <span>NT$ {{ formatCurrency(shippingFee) }}</span>
        </div>
        <div class="cart__summary-total">
          <span>所有商品</span>
          <span>NT$ {{ formatCurrency(computedSubTotal) }}</span>
        </div>
      </div>
      <div v-if="cartItems.length > 0" class="cart__actions">
        <button @click="proceedToCheckout()">繼續前往結帳</button>
        <a href="/fragrances/2">繼續購物</a>
      </div>
      <div v-else class="products--none">
        <p>購物車內尚無商品。</p>
      </div>
      <div class="cart__payment">
        <h2>付款方式</h2>
        <div class="cart__payment-methods">
          <img src="../assets/line.png" alt="LinePay" />
        </div>
        <p>您的信用卡資訊安全無虞。所有資訊皆受安全通訊端層(SSL)技術妥善防護。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import QuantitySelector from '../components/QuantitySelector.vue';
import Loading from '../components/Loading.vue';
import { fetchUpdateCart, fetchCartItems, fetchDeleteCartItem } from '@/api/index';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const shippingFee = ref(0);
const subTotal = ref(0);
const cartItems = ref([]);
const isInitialLoad = ref(true);
const isLoading = ref(true);

const computedSubTotal = computed(() => {
  const itemsTotal = cartItems.value.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  return itemsTotal + shippingFee.value;
});

const removeItem = async (id) => {
  try {
    const response = await fetchDeleteCartItem({ accountId: userStore.userInfo.accountId, cartId: id });
    userStore.updateCartItems(response.data);
  } catch (refreshError) {
    userStore.isAlertMessagesShow({ visible: true, message: '移除商品失敗', status: false });
  }
};

const proceedToCheckout = async () => {
  const response = await fetchCartItems(userStore.userInfo.accountId);
  if (response.data.cartTotal === computedSubTotal.value) {
    router.push('/cart/step2');
  } else {
    router.push('/');
  }
};

watch(
  () => userStore.cart,
  async (newCart) => {
    if (newCart) {
      if (newCart.cartItems !== undefined) {
        cartItems.value = JSON.parse(JSON.stringify(newCart.cartItems));
        cartItems.value.forEach(item => {
          item.selectedSpecName = item.specs[0]?.specName || '';
        });
      } else {
        cartItems.value = [];
      }

      shippingFee.value = userStore.cart.shippingFee;
      subTotal.value = userStore.cart.subTotal;
      isInitialLoad.value = false;
      isLoading.value = false;
    }
  },
  { deep: true }
);

const formatCurrency = (money) => {
  const number = Number(money);

  if (isNaN(number)) {
    return '0'
  }

  return number.toLocaleString('en-US');
}

const updateCartItem = (item) => {
  const specId = item.specs.find(spec => spec.specName === item.specName)?.specId;

  fetchUpdateCart({
    accountId: userStore.userInfo.accountId,
    cartId: item.cartId,
    specId: specId,
    quantity: item.quantity,
  }).then((res) => {
    userStore.updateCartItems(res.data);
    console.log('購物車已更新');
  }).catch(error => {
    console.error('更新購物車失敗', error);
  });
};

// 計算可選擇的最大數量
const computeMaxQuantity = (item) => {
  // 假設 item.stock 是總庫存，並且需要考慮當前購物車中的數量
  // 可用庫存 = item.stock
  // 用戶已經購買的數量 = item.quantity
  // 因此，最大可增加的數量 = item.stock - item.quantity
  // 如果 item.stock 是 0，則無法增加
  if (item.stock === null || item.stock === undefined) {
    return Infinity; // 無限制
  }
  return item.stock >= item.quantity ? item.stock : item.quantity;
};

// 當組件掛載時，載入購物車資料
onMounted(async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.location.replace('/?showLogin=true');
  } else {
    // 為了從 step2 返回上一頁而處理
    try {
      isLoading.value = true;
      if (userStore.userInfo) {
        const response = await fetchCartItems(userStore.userInfo.accountId);
        userStore.updateCartItems(response.data);
        isLoading.value = false;
      }
    } catch (error) {
      console.error('加載購物車失敗', error);
      isLoading.value = false;
    }
  }
});
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

.cart__item-content {
  display: flex;
  width: 100%;
}

.cart__item-all {
  flex: 1;
  margin-left: 20px;
  h2 {
    text-align: left;
    margin: 5px;
    font-size: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
    text-align: justify;
    &::after {
      content: '';
      display: block;
      width: 0;
      height: 2px;
      background: #888;
      transition: width 0.3s;
      margin-top: 5px;
    }
    &:hover::after {
      width: 100%;
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
    width: 20%;
  }
}

.products--none {
  margin-top: 40px;
  margin-bottom: 80px;
}

@media (max-width: 768px) {
  .cart__item-actions {
    flex-direction: column;
    padding: 5px;
  }
}

@media (max-width: 568px) {
  .cart__item-content {
    flex-direction: column;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 0;
    }
    .cart__item-quantity-select {
      flex-direction: row-reverse;
    }
  }
}
</style>
