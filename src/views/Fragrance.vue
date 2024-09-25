<template>
  <div class="product__container" v-if="!isLoading">
    <div class="swiper-container">
      <swiper v-bind="swiperOptions" class="swiper">
        <swiper-slide v-for="image in productImages" :key="image.productImageId">
          <img :src="image.productImageUrl" alt="Perfume Image" />
        </swiper-slide>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </swiper>
    </div>

    <div class="product__info">
      <h1>{{ product.name }}</h1>
      <button @click="scrollToDetails" class="more-details-button">更多詳情</button>
      <p>編號 {{ product.code }}</p>
      <div class="product__price-info">
        <span class="product__price">NT$ {{ formatCurrency(selectedSpec.unitPrice) }}</span>
        <!-- <i class="fa-regular fa-star"></i> -->
        <!-- <i class="fa-solid fa-star"></i> -->
        <span class="product__stock">
          <span v-if="selectedSpec.availableStock === null">庫存無限制</span>
          <span v-else-if="selectedSpec.availableStock > 0">剩餘庫存：{{ selectedSpec.availableStock }}</span>
          <span v-else>庫存不足</span>
        </span>
      </div>
      <Dropdown 
        v-model="selectedSize" 
        :options="specs" 
        :id="'quantity-' + product.id" 
        class="product__options" 
      />
      <button 
        class="add-to-cart" 
        @click="addToCart()" 
        :disabled="!isAddToCartEnabled"
      >
        新增到購物車
      </button>
    </div>
  </div>

  <div v-if="!isLoading" class="product__info-section" ref="detailsSection">
    <h1>商品資訊</h1>
    <div>
      <div class="product__info-accordion" v-for="(item, index) in accordionItems" :key="index">
        <div class="product__accordion-header" @click="toggleAccordion(index)">
          <span>{{ item.title }}</span>
          <span class="product__accordion-icon" :class="{ open: item.open }">
            <span class="product__accordion-icon" :class="{ open: item.open }">
              <svg class="svg-icon back" viewBox="0 0 24 24">
                <g id="bg">
                  <rect id="7091" data-name="7091" class="cls-1" width="24" height="24" opacity="0"></rect>
                </g>
                <g id="4897" data-name="4897">
                  <g id="close">
                    <g id="6076" data-name="6076">
                      <rect id="7092" data-name="7092" class="cls-1" width="24" height="24" opacity="0"></rect>
                    </g>
                    <g id="4062" data-name="4062">
                      <g id="1994" data-name="1994">
                        <g id="1995" data-name="1995">
                          <circle id="2060" data-name="2060" class="cls-2" cx="12" cy="12" r="12"></circle>
                        </g>
                      </g>
                    </g>
                  </g>
                  <g id="8819" data-name="8819">
                    <path id="8465" data-name="8465" class="cls-3" d="M13.43,17.05a1.07,1.07,0,0,1-.74-.3l-4-4a1,1,0,0,1,0-1.45h0l4-4a1,1,0,0,1,1.45.28,1.06,1.06,0,0,1,0,1.19L10.88,12l3.25,3.26a1,1,0,0,1,0,1.48,1.06,1.06,0,0,1-.71.32Z"></path>
                  </g>
                </g>
              </svg>
            </span>
          </span>
        </div>
        <div class="product__accordion-content" v-if="item.open">
          <p>{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>

  <Loading v-if="isLoading" />
</template>

<script setup>
import Dropdown from '../components/Dropdown.vue';
import Loading from '../components/Loading.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import { useUserStore } from '../stores/userStore';
import { useRoute } from 'vue-router';
import { fetchAddToCart } from '@/api/index';

const route = useRoute();
const userStore = useUserStore();
const productId = route.params.id;
const product = ref({});
const productImages = ref([]);
const specs = ref([]);
const selectedSize = ref({});
const selectedSpec = ref({});
const accordionItems = ref([]);
const detailsSection = ref(null);
const isLoading = ref(true);
const addToCartDisabled = ref(false);

const swiperOptions = {
  autoplay: {
    delay: 5000
  },
  speed: 500,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  },
  spaceBetween: 28,
  breakpoints: {
    slidesPerView: 4,
    slidesOffsetBefore: 45,
    slidesOffsetAfter: 45,
    spaceBetween: 0
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  modules: [Navigation, Pagination]
};

// 計算每個 spec 的可用庫存
const calculateAvailableStock = (specsList, cartItems) => {
  const safeCartItems = cartItems || [];
  return specsList.map(spec => {
    const cartItemsForSpec = safeCartItems.filter(item => item.selectedSpecId === spec.specId);
    const cartQuantity = cartItemsForSpec.reduce((sum, item) => sum + item.quantity, 0);
    return {
      ...spec,
      availableStock: spec.stockQuantity !== null ? spec.stockQuantity - cartQuantity : null
    };
  });
};

const loadProductData = async (productId) => {
  try {
    await userStore.fetchProduct(productId);
    const data = userStore.product;
    product.value = {
      id: data.productId,
      name: data.productName,
      description: data.description,
      code: data.spu,
      price: data.specs[0].unitPrice,
    };
    productImages.value = data.productImages;

    // 設置監聽器來監聽購物車的變化
    watch(
      () => userStore.cart.cartItems,
      (newCartItems) => {
        specs.value = calculateAvailableStock(data.specs, newCartItems);

        // 選擇第一個有庫存的規格作為預設
        const firstAvailableSpec = specs.value.find(spec => spec.availableStock === null || spec.availableStock > 0) || specs.value.find(spec => spec.availableStock === 0) || {};
        if (Object.keys(firstAvailableSpec).length > 0) {
          selectedSize.value = firstAvailableSpec;
          selectedSpec.value = firstAvailableSpec;
        }

        // 設置 isLoading 為 false 只有在庫存計算完成後
        isLoading.value = false;
      },
      { immediate: true, deep: true } // 確保立即執行一次，並深度監聽
    );

    // 初始化 accordionItems
    accordionItems.value = [
      { title: '詳情', content: data.description, open: false },
      { title: '配送及退貨', content: '我們提供全台灣地區的配送服務，並致力於在下單後 2-5 個工作日內將您的香水安全送達到指定地址（偏遠地區可能需要額外時間）。', open: false },
    ];
  } catch (error) {
    console.error('Error loading product data:', error);
    isLoading.value = false;
  }
};

// 計算是否允許加入購物車
const isAddToCartEnabled = computed(() => {
  if (!selectedSpec.value) {
    return false; // 如果沒有選擇規格，則不允許加入購物車
  }
  if (selectedSpec.value.availableStock === null) {
    return true; // 沒有限制數量，允許加入購物車
  }
  return selectedSpec.value.availableStock > 0;
});

watch(selectedSize, (newSize) => {
  selectSize(newSize);
});

const selectSize = (spec) => {
  if (spec) {
    selectedSpec.value = spec;
  }
};

const toggleAccordion = (index) => {
  accordionItems.value[index].open = !accordionItems.value[index].open;
};

// 加入購物車的函數
const addToCart = async () => {
  if (!selectedSpec.value) {
    userStore.isAlertMessagesShow({ visible: true, message: '請選擇規格', status: false });
    return;
  }

  if (selectedSpec.value.availableStock !== null && selectedSpec.value.availableStock <= 0) {
    userStore.isAlertMessagesShow({ visible: true, message: '該規格已售罄', status: false });
    return;
  }

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    try {
      addToCartDisabled.value = true;
      await fetchAddToCart({
        accountId: userStore.userInfo.accountId,
        specId: selectedSpec.value.specId,
        quantity: 1
      });

      userStore.isAlertMessagesShow({ visible: true, message: '加入購物車成功', status: true });
      userStore.addToCart(userStore.cartItems + 1);

      // 更新可用庫存
      if (selectedSpec.value.availableStock !== null) {
        selectedSpec.value.availableStock -= 1;
      }
    } catch (error) {
      userStore.isAlertMessagesShow({ visible: true, message: '加入購物車失敗', status: false });
    } finally {
      addToCartDisabled.value = false;
    }
  } else {
    document.querySelector('#loginButton').click();
  }
};

const formatCurrency = (money) => {
  const number = Number(money);

  if (isNaN(number)) {
    return '0'
  }

  return number.toLocaleString('en-US');
}

const scrollToDetails = () => {
  detailsSection.value.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  loadProductData(productId);
});
</script>

<style lang="scss" scoped>
.add-to-cart:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.product__container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.swiper-container {
  width: 40%;
  margin: 0 30px;
}

.product__info {
  width: 33.3333333333%;
  margin: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0px;
  }
  p, span {
    font-size: .875rem;
    font-weight: 300;
  }
  p {
    margin-bottom: 5px;
    margin-top: 0px;
  }
}

.product__price-info {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  margin: 10px 0;
}
.product__price {
  font-size: 1.5rem;
}

img {
  width: inherit;
}

.more-details-button {
  color: #888;
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
.add-to-cart {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1d1d1d;
  color: white;
  border-radius: 4px;
}

.product__options {
  width: 150px;
}

.swiper-button-prev, .swiper-button-next {
  color: #1d1d1d;
}

.swiper-button-prev:after, .swiper-button-next:after {
  font-size: 2rem;
}

i.fa-star {
  cursor: pointer;
}

.product__info-section {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.product__info-accordion:not(:last-child) {
  border-bottom: 1px solid #ddd;
}

.product__accordion-header {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  cursor: pointer;
}

.product__accordion-icon {
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
  &.open {
    transform: rotate(-90deg);
  }
}

.product__accordion-content {
  padding: 15px;
  background-color: #f9f9f9;
}

.cls-1 {
  fill: none;
}

.cls-2 {
  fill: #ffffff;
}

.cls-3 {
  fill: #1d1d1d;
}

@media (max-width: 1024px) {
  .product__info-section {
    max-width: 90%;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .swiper-container, .product__info {
    width: 100%;
  }
  .product__container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
