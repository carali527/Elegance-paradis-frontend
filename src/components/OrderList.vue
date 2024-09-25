<template>
  <div>
    <div v-for="order in orders" :key="order.orderNo" class="order-card">
      <div class="order-header">
        <p>訂單編號: {{ order.orderNo }}</p>
        <p>訂單日期: {{ formatDate(order.createAt) }}</p>
        <p>付款方式: {{ getPaymentStatus(order.paymentType) }}</p>
      </div>
      <div class="order-details">
        <div v-for="detail in order.orderDetails" :key="detail.sku" class="product-detail">
          <p>{{ detail.productName }} - {{ detail.quantity }} x NT$ {{ formatCurrency(detail.unitPrice) }}</p>
        </div>
      </div>
      <div class="order-footer">
          <div class="order-footerDetails">
            <p>運費: <span>NT$ {{ formatCurrency(order.shippingFee) }}</span></p>
            <p>總金額: <span>NT$ {{ formatCurrency(order.totalAmount) }}</span></p>
          </div>
          <button v-if="order.orderStatus === 0" @click="continuePayment(order.orderId)" class="order-continuePayment"><span>繼續付款</span></button>
      </div>
    </div>
    <div v-if="orders.length == 0" class="order--none">
      <p>尚無相關訂單</p>
    </div>
  </div>
</template>
  
<script setup>
  import { fetchGetPayOrder } from '@/api/index';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const props = defineProps({
    orders: {
      type: Array,
      required: true
    }
  });
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);

    // 使用 padStart 為單位數添加前導零
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從0開始，所以要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };
  
  const getPaymentStatus = (paymentType) => {
    return paymentType === 0 ? 'LinePay' : '';
  };

  const formatCurrency = (money) => {
    const number = Number(money);

    if (isNaN(number)) {
      return '0'
    }

    return number.toLocaleString('en-US');
  }

  const continuePayment = async(id) => {
    const response = await fetchGetPayOrder(id);
    window.location.href = response.data.webPaymentURL;
  };
</script>
  
<style lang="scss" scoped>
.order-card {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #ddd;
  padding: 20px;
  margin-bottom: 10px;
  align-items: center;
  background-color: #f9f9f9;
}

.order-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #d8d8d8;

  p {
    margin: 0;
    flex: 1 1 50%; 
  }
}

.order-footer {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
  width: 100%;

  .order-footerDetails {
    display: flex;
    justify-content: end;
    p:first-child {
      margin-right: 10px;
    }
  }
}

.order-details {
  width: 100%;
  padding-top: 10px;
}

.product-detail {
  display: flex;
  margin-top: 5px;
  flex-direction: column; 
  p {
    text-align: left;
  }
}

.order--none {
  margin-top: 40px;
  margin-bottom: 80px;
  text-align: center; 
}

.order-continuePayment {
  padding: 5px;
  margin-left: 10px;
  background: unset;
  span {
    color: #888;
  }
  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: #888;
    transition: width 0.3s;
    margin-top: 5px;
  }
}

@media (max-width: 768px) {
  .order-card {
    padding: 15px; 
  }

  .order-header {
    flex-direction: column; 
    align-items: flex-start;
  }

  .order-header p {
    margin-bottom: 5px;
    flex: unset; 
  }

  .order-footerDetails {
    justify-content: flex-start; 
  }

  .product-detail {
    flex-direction: row;
  }
}
</style>