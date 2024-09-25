<template>
    <div class="">
      <div class="tabs">
        <button :class="{ active: currentTab === 'Pending' }" @click="currentTab = 'Pending'">
          未付款訂單 ({{ pendingOrders.length }})
        </button>
        <button :class="{ active: currentTab === 'Paid' }" @click="currentTab = 'Paid'">
          已付款訂單 ({{ paidOrders.length }})
        </button>
        <button :class="{ active: currentTab === 'Failed' }" @click="currentTab = 'Failed'">
          已失效訂單 ({{ failedOrders.length }})
        </button>
      </div>
      <div v-if="currentTab === 'Pending'" class="container">
        <OrderList :orders="pendingOrders" />
      </div>
      <div v-else-if="currentTab === 'Paid'" class="container">
        <OrderList :orders="paidOrders" />
      </div>
      <div v-else class="container">
        <OrderList :orders="failedOrders" />
      </div>
    </div>
</template>
  
<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import { fetchAllOrders } from '@/api/index';
  import OrderList from '@/components/OrderList.vue';
  import { useRouter, useRoute } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const orderList = ref([]);
  
  watch(
    () => userStore.userInfo,
    async (newUserInfo) => {
      if (newUserInfo) {
        const response = await fetchAllOrders(userStore.userInfo.accountId);
        orderList.value = response.data;
      }
    },
    { immediate: true }
  );
  
  // 根據 orderStatus 過濾訂單
  const pendingOrders = computed(() => orderList.value.filter(order => order.orderStatus === 0));
  const paidOrders = computed(() => orderList.value.filter(order => order.orderStatus === 1));
  const failedOrders = computed(() => orderList.value.filter(order => order.orderStatus === 10));
  
  // 設定預設的當前選擇 tab
  const currentTab = ref('Pending');

  onMounted(() => {
    const status = route.query.status;
    if (status === '0') {
      currentTab.value = 'Pending';
    } else if (status === '1') {
      currentTab.value = 'Paid';
    } else if (status === '10') {
      currentTab.value = 'Failed';
    }

    // 移除 `status` 參數
    if (status !== undefined) {
      // 使用 router.replace 來更新 URL，不會觸發導航
      const { status, ...newQuery } = route.query;
      router.replace({ query: newQuery });
    }
  });
</script>
  
<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-left: 40px;
  margin-right: 40px;
  flex-wrap: wrap;

  @media (max-width: 420px) {
    flex-direction: column;
    margin-left: 20px;
    margin-right: 20px;
  }
}

.tabs button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 16px;
  border-radius: unset;
  position: relative;
  white-space: nowrap; 

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: #1d1d1d;
    transition: width 0.3s;
    margin-top: 5px;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 420px) {
    white-space: normal;
    text-align: center;
    padding: 10px;
  }
}
  
  .tabs button.active {
    font-weight: bold;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background: #1d1d1d;
      transition: width 0.3s;
      margin-top: 5px;
    }
  }
  
  .price-details {
    min-width: 150px;
    text-align: right;
  }
</style>
  