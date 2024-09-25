<template>
  <div :class="{ 'showPopup': userStore.memberPopupVisible || userStore.validateEmailPopupVisible }">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    <button v-if="showBackToTop" class="back-to-top" @click="scrollToTop">
      <i class="fas fa-chevron-up"></i>
    </button>
  </div>
  <LoginPopup v-if="userStore.memberPopupVisible" />
  <ValidateTheEmail v-if="userStore.validateEmailPopupVisible" />
  <ForgetPasswordPopup v-if="userStore.forgetPasswordPopupVisible" />
  <AlertMessages v-if="userStore.alertMessagesVisible" :message="userStore.alertMessages" :status="userStore.alertMessagesStatus"/>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import LoginPopup from './components/LoginPopup.vue'
import ValidateTheEmail from './components/ValidateTheEmail.vue'
import ForgetPasswordPopup from './components/ForgetPasswordPopup.vue'
import AlertMessages from './components/AlertMessages.vue'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useUserStore } from './stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
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

const isPopupVisible = computed(() => userStore.validateEmailPopupVisible)

watch(isPopupVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(async() => {
  updateIsMobile();
  window.addEventListener('resize', updateIsMobile);
  window.addEventListener('scroll', handleScroll);
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    userStore.setAccessToken(accessToken);  // 確保 accessToken 是最新的
    userStore.fetchUserInfo();
  }
  if (userStore.validateEmailPopupVisible) {
    document.body.style.overflow = 'hidden'
  } 
  const currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.has('showLogin')) {
    document.querySelector('#loginButton').click();

    // 移除 'showLogin' 查詢參數並更新 URL
    const currentRoute = router.currentRoute.value;
    const query = { ...currentRoute.query }; // 複製當前查詢參數

    // 刪除 `showLogin` 查詢參數
    delete query.showLogin;

    // 使用 router.replace 替換當前 URL，而不會重新載入頁面
    router.replace({ query });
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
  window.removeEventListener('scroll', handleScroll);
});

</script>

<style lang="scss" scoped>
main {
  padding-top: 145px;
}
.showPopup {
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
    padding-top: 92px;
  }
}
</style>
