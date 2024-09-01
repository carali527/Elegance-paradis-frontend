<template>
  <div class="product__container">
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
      <p>{{ product.description }}</p>
      <span>編號 {{ product.code }}</span>
      <div class="product__price-info">
        <span class="product__price">NT$ {{ selectedSpec.unitPrice }}</span>
        <i class="fa-regular fa-star"></i>
        <!-- <i class="fa-solid fa-star"></i> -->
      </div>
      <Dropdown v-model="selectedSize" :options="sizes" :id="'quantity-' + product.id" class="product__options" />
      <button class="add-to-cart" @click="addToCart(product.id)">新增到購物車</button>
    </div>
  </div>
  <div class="product__info-section">
    <h1>商品資訊</h1>
    <div>
      <div class="product__info-accordion" v-for="(item, index) in accordionItems" :key="index">
        <div class="product__accordion-header" @click="toggleAccordion(index)">
          <span>{{ item.title }}</span>
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
        </div>
        <div class="product__accordion-content" v-if="item.open">
          <p>{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Dropdown from '../components/Dropdown.vue';
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination } from 'swiper/modules';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const product = ref({});
const productImages = ref([]);
const sizes = ref([]);
const selectedSize = ref('');
const selectedSpec = ref({});
const accordionItems = ref([]);

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

const loadProductData = async (categoryId) => {
  try {
    // userStore.fetchProduct(categoryId); // 替換為實際的產品 ID
    userStore.fetchProduct();
    const data = userStore.product;
    product.value = {
      id: data.productId,
      name: data.productName,
      description: data.description,
      code: data.spu,
      price: data.specs[0].unitPrice,
    };
    productImages.value = data.productImages;
    sizes.value = data.specs.map((spec) => spec.specName);
    selectedSize.value = sizes.value[0];
    selectedSpec.value = data.specs[0];
    accordionItems.value = [
      { title: '詳情', content: data.description || '暫無描述', open: false },
      { title: '更多資訊', content: '更多資訊的內容。', open: false },
      { title: '配送及退貨', content: '配送及退貨的內容。', open: false },
    ];
  } catch (error) {
    console.error('Error loading product data:', error);
  }
};

const selectSize = (size) => {
  const spec = product.value.specs.find(spec => spec.specName === size);
  selectedSpec.value = spec;
  selectedSize.value = size;
};

const toggleAccordion = (index) => {
  accordionItems.value[index].open = !accordionItems.value[index].open;
};

const addToCart = (productId) => {
  // userStore.addToCart(productId);
  userStore.addToCart(1);
};

onMounted(() => {
  // 要帶商品id
  loadProductData();
});
</script>

<style lang="scss" scoped>
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
.add-to-cart {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #1d1d1d;
  color: white;
  border-radius: 4px;
}

.product__options {
  width: 100px;
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
