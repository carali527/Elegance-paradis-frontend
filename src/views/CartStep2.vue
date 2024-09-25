<template>
  <div class="cart">
    <h1>付款資訊</h1>
    <div class="shadow-cart">
      <div class="inner-container">
        <div class="text-container">
          <div class="image-container">
            <p class="text-title">使用 LINE Pay 付款</p>
            <img src="../assets/line.png" class="line-image" />
          </div>
          <p class="text-description">・確認付款後，畫面將跳轉至 LINE Pay 付款頁面</p>
          <p class="text-description">・可使用 LINE POINTS 折抵</p>
        </div>
      </div>
    </div>
    <h1>訂單細節</h1>
    <div class="shadow-cart">
      <div class="inner-container order">
        <div v-for="item in userStore.cart.cartItems" :key="item.cartId" class="cart__item">
          <img :src="item.productImage" :alt="item.title" />
          <div class="cart__item-all">
            <h2>{{ item.productName }}</h2>
            <div class="cart__item-details">
              <span>{{ item.specName }}</span>
            </div>
            <span class="cart__item-price">NT$ {{ formatCurrency(item.unitPrice) }}</span>
          </div>
        </div>
      </div>
      <p class="text-title">訂單總金額 <span>NT$ {{ formatCurrency(userStore.cart.subTotal) }}</span></p>
    </div>
    <h1>個人資訊</h1>
    <div class="info-container">
      <div class="form-section">
        <div class="input-group name">
          <label for="name" class="label">姓名</label>
          <div class="input-form">
            <input 
              type="text" 
              id="name" 
              v-model="purchaser" 
              placeholder="*請輸入姓名"
              class="input-field" 
              @blur="validateName(purchaser)"
              @input="clearError"
              :class="{ 'error': purchaserError }"
            />
            <span v-if="purchaserError" class="error">{{ purchaserError }}</span>
          </div>
        </div>
        <div class="input-group name">
          <label for="phone" class="label">電話</label>
          <div class="input-form">
            <input 
              type="text" 
              id="phone" 
              v-model="purchaserTel" 
              placeholder="*請輸入電話" 
              maxlength="18" 
              class="input-field" 
              @blur="validatePhone(purchaserTel)"
              @input="clearError"
              :class="{ 'error': purchaserTelError }"
            />
            <span v-if="purchaserTelError" class="error">{{ purchaserTelError }}</span>
          </div>
        </div>
        <div class="input-group name">
          <label for="email" class="label">電子信箱</label>
          <div class="input-form">
            <input 
              type="text" 
              id="email" 
              v-model="purchaserEmail" 
              placeholder="*請輸入電子信箱" 
              class="input-field" 
              @blur="validateEmail(purchaserEmail)"
              @input="clearError"
              :class="{ 'error': purchaserEmailError }"
            />
            <span v-if="purchaserEmailError" class="error">{{ purchaserEmailError }}</span>
          </div>
        </div>
        <div class="input-group">
          <label for="address" class="label">收件地址</label>
          <div class="input-form">
            <SelectComponent
              :citySelect="citySelect"
              :districtsSelect="districtsSelect"
              :addressError="addressError"
              :cityError="citySelectError" 
              :districtError="districtsSelectError"
              @changeCitySelect="changeCitySelect"
              @changeDistricts="changeDistricts"
              @updateCityDistrictName="handleUpdateCityDistrictName"
            >
              <template #address>
                <div class="input-group address">
                  <input 
                    type="text" 
                    v-model="address" 
                    placeholder="*請輸入地址" 
                    class="input-field address" 
                    @blur="validateAddress(address)"
                    @input="clearError"
                    :class="{ 'error': addressError }"
                  />
                  <span v-if="addressError" class="error">{{ addressError }}</span>
                </div>
              </template>
            </SelectComponent>
          </div>
        </div>
      </div>
    </div>
    <div class="cart__actions" :disabled="isCheckoutDisabled">
      <button @click="confirmPayment">確認付款</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';
import SelectComponent from '../components/SelectComponent.vue';
import { fetchCreateOrder, fetchGetPayOrder } from '@/api/index';

const userStore = useUserStore();

// 定義反應式狀態
const purchaser = ref('');
const purchaserTel = ref('');
const purchaserEmail = ref('');
const address = ref('');
const citySelect = ref('');
const districtsSelect = ref('');
const purchaserError = ref('');
const purchaserTelError = ref('');
const purchaserEmailError = ref('');
const addressError = ref('');
const citySelectError = ref('');
const districtsSelectError = ref('');

const selectedCityName = ref('');
const selectedDistrictName = ref('');

const isCheckoutDisabled = ref(false);

const formatCurrency = (money) => {
  const number = Number(money);

  if (isNaN(number)) {
    return '0'
  }

  return number.toLocaleString('en-US');
}

const validateName = (name) => {
  purchaserError.value = name.length > 0 ? '' : '姓名不能為空';
};

const validatePhone = (phone) => {
  const phonePattern = /^[0-9+\-]+$/;
  purchaserTelError.value = phonePattern.test(phone) ? '' : '無效的電話號碼';
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  purchaserEmailError.value = emailPattern.test(email) ? '' : '無效的電子郵件地址';
};

const validateCityAndDistricts = () => {
  citySelectError.value = citySelect.value ? '' : '請選擇城市';
  districtsSelectError.value = districtsSelect.value ? '' : '請選擇區域';
};

const changeCitySelect = (val) => {
  citySelect.value = val;
  clearError();
};

const changeDistricts = (val) => {
  districtsSelect.value = val;
  clearError();
};

const validateAddress = (address) => {
  addressError.value = address.length > 0 ? '' : '地址不能為空';
};

// 處理城市和區域名稱更新事件
const handleUpdateCityDistrictName = ({ cityName, districtName }) => {
  if (cityName) {
    selectedCityName.value = cityName;
  }
  if (districtName) {
    selectedDistrictName.value = districtName;
  }
};

const clearError = () => {
  purchaserError.value = '';
  purchaserTelError.value = '';
  addressError.value = '';
  purchaserEmailError.value = '';
  citySelectError.value = '';
  districtsSelectError.value = '';
};


const confirmPayment = async () => {
  validateName(purchaser.value);
  validatePhone(purchaserTel.value);
  validateEmail(purchaserEmail.value);
  validateAddress(address.value);
  validateCityAndDistricts();
  try {
    if(isCheckoutDisabled.value == true) return;

    if (!purchaserError.value && !purchaserTelError.value && !purchaserEmailError.value && 
        !addressError.value && !citySelectError.value && !districtsSelectError.value) {
          isCheckoutDisabled.value = true;
          const response = await fetchCreateOrder({
            accountId: userStore.userInfo.accountId,
            purchaser: purchaser.value,
            purchaserTel: purchaserTel.value,
            purchaserEmail: purchaserEmail.value,
            paymentType: 0,
            city: selectedCityName.value,
            district: selectedDistrictName.value,
            address: address.value
          });
          const getLink = await fetchGetPayOrder(response.data.orderId)
          window.location.href = getLink.data.webPaymentURL;
    }
  } catch (error) {
    userStore.isAlertMessagesShow({visible: true, message: error.response.data, status: false});

    // if (error.response.data == '目前購物車沒有商品') {
    //   window.location.href = '/';
    // }
  } finally {
    isCheckoutDisabled.value = false;
  }
};
</script>

<style lang="scss" scoped>
.cart {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    display: flex;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 20px;
  }

  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    max-width: 600px;
    width: 100%;

    img {
      max-width: 100px;
    }

    &-all {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 20px;

      h2 {
        text-align: left;
        margin: 5px;
        font-size: 18px;
      }
    }

    &-details {
      text-align: left;
      color: #888;

      span:first-of-type {
        color: #888;
        margin: 5px;
      }
    }

    &-price {
      font-size: 18px;
    }
  }

  &__actions {
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
  }

  &__summary {
    h2 {
      margin-bottom: 10px;
    }

    &-item,
    &-total {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      span {
        font-size: 16px;
      }
    }
  }
}

.shadow-cart,
.info-container {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.16);
  margin: 20px 0 50px;
  border-radius: 8px;
  padding: 20px;
}

.info-container {
  background-color: #ffffff;

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.address {
        flex-grow: 1;
      }

      &.name {
        flex-direction: row;
      }

      .label {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        white-space: nowrap;
        display: flex;
        width: 60px;
      }

      .input-field {
        padding: 8px;
        border: 1px solid #d1d1d1;
        border-radius: 4px;
        outline: none;
        max-width: 400px;

        &.address {
          max-width: none;
          width: 90%;
        }

        &:focus {
          border-color: #1a73e8;
        }
      }

      .select-group {
        display: flex;
        gap: 10px;

        .select-field {
          width: 100%;
          padding: 8px;
          border: 1px solid #d1d1d1;
          border-radius: 4px;
          appearance: none;
          background-color: #f7f7f7;
          background-image: url('data:image/svg+xml;utf8,<svg fill="%231a73e8" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 12px 12px;
          outline: none;

          &:focus {
            border-color: #1a73e8;
          }
        }
      }

      .error-message {
        display: flex;
        align-items: center;
        color: #e53e3e;
        font-size: 12px;

        .icon {
          width: 16px;
          height: 16px;
          margin-right: 5px;

          svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
          }
        }
      }
    }
  }
}

.inner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;

  &.order {
    max-height: 300px;
    overflow-y: auto;
  }
}

.text-title {
  text-align: center;
  margin-bottom: 5px;
  margin-right: 10px;
}

.text-description {
  font-size: 14px;
  color: #4a4a4a;
  text-align: left;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.line-image {
  height: 24px;
  width: 84px;
  margin-top: 10px;
}

.input-group {
  input {
    border: 1px solid transparent;
    background-color: rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;

    &.error {
      margin-bottom: 0;
      border: 1px solid #ff5b74;
    }

    &:focus {
      border: 0.5px solid;
    }
  }

  span.error {
    font-size: 12px;
    color: #ff5b74;
    text-align: left;
    font-weight: 500;
  }
}

.input-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

@media (max-width: 1280px) {
  .inner-container {
    flex-direction: row;

    &.order {
      flex-direction: column;
    }
  }

  .text-container {
    margin-right: 40px;
    margin-bottom: 0;
  }
}
</style>