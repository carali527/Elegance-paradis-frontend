<template>
  <div :class="{ 'login-popup': memberStore.popupMemberVisible }">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
  <LoginPopup v-if="memberStore.popupMemberVisible" />
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import LoginPopup from './components/LoginPopup.vue'
import { ref, onMounted, onUnmounted } from 'vue';
import { useMemberStore } from './stores/member';

const memberStore = useMemberStore();
const isMobile = ref(false);
const isNavItemHidden = ref(false);
const showBackToTop = ref(false);
let lastScrollY = window.scrollY;

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  showBackToTop.value = currentScrollY > 200; // 顯示按鈕的滾動距離閾值
  if (!isMobile.value && currentScrollY > lastScrollY && currentScrollY > 100) {
    isNavItemHidden.value = true;
  } else {
    isNavItemHidden.value = false;
  }
  lastScrollY = currentScrollY;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
  window.removeEventListener('scroll', handleScroll);
});

</script>

<style lang="scss" scoped>
main {
  padding-top: 120px;
}
.login-popup {
  overflow: hidden;
}
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #1d1d1d;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.3s;
  opacity: 0.5;
  padding: 12px;
  border: 1px solid #ffffff;
  &:hover {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  main {
    padding-top: 70px;
  }
}
</style>
