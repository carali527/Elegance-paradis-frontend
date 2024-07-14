<template>
  <header class="header" :class="{ 'header__bottom': isNavItemHidden }">
    <div class="header__top-bar">
      <div class="header__icons">
        <span class="header__menu-icon" @click="toggleMenu"><i class="fas fa-bars"></i></span>
      </div>
      <a href="#" class="header__logo">
        <span>Elegance Paradis</span>
      </a>
      <div>
        <ul class="nav-right">
          <li @mouseover="activeMemberDropdown = true" @mouseleave="activeMemberDropdown = false">
            <span class="header__icon" @click="showMemberPopup"><i class="fa-regular fa-user"></i></span>
          </li>
          <li>
            <a href="#/cart" class="header__icon"><i class="fas fa-shopping-bag"></i></a>
            <span class="header__count" v-if="userStore.cart > 0">{{ userStore.cart }}</span>
          </li>
        </ul>
      </div>
    </div>
    <nav :class="{ 'nav__item--hidden': isNavItemHidden && !isMobile, 'nav__item--active': isMenuOpen }">
      <ul class="nav__links">
        <li v-for="category in userStore.allCategories" :key="category.id" class="nav__item" @mouseover="activeDropdown = category.id" @mouseleave="activeDropdown = null">
          <a class="nav__link" href="#">{{ category.name }}</a>
          <div class="nav__dropdown" v-if="activeDropdown === category.id || isMobile">
            <ul>
              <li v-for="subCategory in category.subCategory" :key="subCategory.id">
                <a href="#/perfume" @click="closeMenuOnMobile">{{ subCategory.name }}</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useMemberStore } from '../stores/member';

const userStore = useMemberStore();
const isMenuOpen = ref(false);
const activeDropdown = ref(null);
const activeMemberDropdown = ref(false);
const isMobile = ref(false);
const isNavItemHidden = ref(false);

let lastScrollY = window.scrollY;

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenuOnMobile = () => {
  if (isMobile.value) {
    isMenuOpen.value = false;
  }
};

const showMemberPopup = () => {
  userStore.isMemberPopupVisible(true);
  document.body.style.overflow = 'hidden';
};

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  if (!isMobile.value && currentScrollY > lastScrollY && currentScrollY > 100) {
    isNavItemHidden.value = true;
  } else {
    isNavItemHidden.value = false;
  }
  lastScrollY = currentScrollY;
};

onMounted(() => {
  updateIsMobile();
  userStore.fetchCategories();
  window.addEventListener('resize', updateIsMobile);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  z-index: 1000;
  box-sizing: border-box;
  &.header__bottom {
    border-bottom: 1px solid #ddd;
  }
}

.header__top-bar {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 83.875rem;
  padding: 10px;
}

.header__logo {
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header__icon {
  font-size: 1.25rem;
  cursor: pointer;
}

.header__menu-icon {
  font-size: 1.25rem;
  display: none;
}

nav {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
  &.nav__item--hidden {
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  &.nav__item--active {
    display: block;
  }
}

ul.nav-right {
  display: flex;
  gap: 15px;
  li {
    position: relative;
    .header__count {
      border-radius: 20px;
      background: #ff5b74;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      min-width: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -5px;
      right: -13px;
      line-height: 20px;
    }
  }
}

.nav__links {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 10px 0;
  margin: 0;
  gap: 20px;

  a {
    color: #1d1d1d;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    position: relative;

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

.nav__item {
  position: relative;

  &:hover .nav__dropdown {
    display: block;
  }
}

.nav__dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;

  ul {
    width: max-content;
    list-style: none;
    padding: 10px;
    margin: 0;

    li {
      margin: 0;
      padding: 5px 10px;

      a {
        color: #1d1d1d;
        text-decoration: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .header__menu-icon {
    display: block;
  }

  .header__top-bar {
    justify-content: space-between;
  }

  .header__logo {
    font-size: 1.25rem;
  }

  nav {
    display: none;
    flex-direction: column;
    align-items: center;

    &.nav__item--active {
      display: flex;
    }
  }

  .nav__links {
    flex-direction: column;
    align-items: center;

    .nav__item {
      width: 100%;
      text-align: center;
      .nav__link:hover::after {
        background: none;
        transition: unset;
      }
    }
  }

  .nav__dropdown {
    position: relative;
    box-shadow: none;
    display: block;

    ul {
      padding: 0;

      li {
        padding: 10px;

        a {
          display: block;
        }
      }
    }
  }

  .nav__item:hover .nav__dropdown {
    display: block;
  }
}
</style>
