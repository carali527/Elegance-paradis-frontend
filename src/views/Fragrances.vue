<template>
  <div class="products__categories">
    <ul>
      <li v-for="category in matchedSubCategories" :key="category.name">
        <button @click="getCategoryItems(category.id)">
          <img :src="category.imageURL" :alt="category.name">
          <p>{{ category.name }}</p>
        </button>
      </li>
    </ul>
  </div>
  <Loading v-if="isLoading" />
  <div v-if="!isLoading && productItems.length > 0" class="products__list">
    <Item
        v-for="product in productItems" 
        :key="product.id"
        :product="product"
      />
  </div>
  <div v-else-if="!isLoading" class="products--none">
    <p>此分類沒有相關商品</p>
  </div>
</template>

<script setup>
import Item from '../components/Item.vue'
import Loading from '../components/Loading.vue';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRoute } from 'vue-router'
const isLoading = ref(true);

const userStore = useUserStore();
const productItems = ref(userStore.products);
const route = useRoute();
const fragranceId = route.params.id;
const subCategoryId = route.params.subCategoryId;

const getCategoryItems = (id) => {
  productItems.value = userStore.products.filter(product => product.categoryId == id);
};

const matchedSubCategories = computed(() => {
  const matchedItem = userStore.allCategories.find(item => {
    if (item.id == fragranceId){
      return item
    }
  });
  return matchedItem ? matchedItem.subCategory : [];
});

onMounted(async () => {
  await userStore.fetchAllProducts(fragranceId); 
  productItems.value = userStore.products;
  if (subCategoryId) {
    getCategoryItems(subCategoryId)
    if (route.params.subCategoryId) {
      const newUrl = `/fragrances/${route.params.id}`;
      history.replaceState(null, '', newUrl); 
    }
  }
  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.products__categories {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  ul {
    display: flex;
    justify-content: center;
    gap: 20px;
    li {
      text-align: center;
      flex: 1;
      button:hover {
        p {
          font-weight: 400;
        }
        img {
          transform: scale(1.1);
        }
      }
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      p {
        font-weight: 300;
      }
    }
  }
}

.products__list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 20px;
}

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

button.add-to-bag {
  margin-top: 10px;
  &:hover {
    span::after {
      animation: fadeIn 0.5s ease-out forwards;
      border-bottom: 2px solid #1d1d1d;
      filter: blur(0);
      opacity: 1;
      transform: scaleX(1);
      transition: all 0.5s ease-out;
    }
  }
  span {
    position: relative;
    &::after {
      bottom: 0;
      content: '';
      height: 1px;
      left: 0;
      position: absolute;
      top: calc(100% + 5px);
      transform: scaleX(0.98);
      transition: all 0.5s ease-out;
      width: 100%;
      border-bottom: 2px solid #ececec;
      height: auto;
    }
  }
}

.products--none {
  margin-top: 40px;
  margin-bottom: 80px;
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