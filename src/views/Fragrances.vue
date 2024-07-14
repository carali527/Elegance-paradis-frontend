<template>
  <div class="products__categories">
    <ul>
      <li v-for="category in userStore.allCategories[0].subCategory" :key="category.name">
        <button>
          <img :src="category.imageURL" :alt="category.name">
          <p>{{ category.name }}</p>
        </button>
      </li>
    </ul>
  </div>
  <div class="products__list" ref="productList">
    <Item
        v-for="product in userStore.products" 
        :key="product.id"
        :product="product"
      />
  </div>
</template>

<script setup>
import Item from '../components/Item.vue'
import { ref, onMounted, onUnmounted } from 'vue';
import { useMemberStore } from '../stores/member';

const userStore = useMemberStore();
const productList = ref(null);
const productItems = ref([]);

const handleScroll = () => {
  const windowHeight = window.innerHeight;
  const scrollPosition = window.scrollY;

  productItems.value.forEach(item => {
    const itemTop = item.getBoundingClientRect().top + scrollPosition;
    const itemBottom = itemTop + item.offsetHeight;
    const itemCenter = (itemTop + itemBottom) / 2;

    if (itemCenter >= scrollPosition + windowHeight / 3 && itemCenter <= scrollPosition + windowHeight) {
      item.style.opacity = 1;
    } else {
      item.style.opacity = 0.5;
    }
  });
};

onMounted(() => {
  userStore.fetchAllProducts();
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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
      }
      img {
        width: 50px;
        height: 50px;
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