<template>
  <Particlesa />
  <section class="section__img" v-bg-parallax="[25, 75]">
    <p class="section__title section__title--headline">EleganceParadis</p>
  </section>
  <section>
    <p class="section__title">EleganceParadis Fragrance, Elevate Your Elegance</p>
  </section>
  <section v-for="category in userStore.allCategories" :key="category.id" class="section__img" v-bg-parallax="[45, 100]" :style="{ backgroundImage: `url(${category.imageURL})` }">
    <div class="section__title--bg">
      <p class="section__title section__title--headline">{{ category.name }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import Particlesa from '../components/Particles.vue';
import { useUserStore } from '../stores/userStore';

const requestAnimFrame = window.requestAnimationFrame;
const userStore = useUserStore();
const categories = ref([]);

const globals = {
  latestScrollY: 0
};

function bind(el, binding) {
  if (!window._parallax) {
    window._parallax = {
      targets: [],
      callback: requestUpdate,
      animate: true
    };

    requestUpdate();
    window.addEventListener("scroll", requestUpdate);
    window.addEventListener("resize", forceUpdate);
  }

  const targets = window._parallax.targets;
  window._parallax.targets = targets.concat(el);

  el._parallax = applyParallax;
  el._bounds = binding.value || [0, 100];
  forceUpdate();
}

function forceUpdate() {
  requestUpdate(true);
}

function unbind(el) {
  const { targets } = window._parallax;

  const index = targets.indexOf(el);
  if (index === -1) return;
  targets.splice(index, 1);

  delete el._parallax;

  if (targets.length === 0) {
    window.removeEventListener("scroll", requestUpdate);
    window.removeEventListener("resize", forceUpdate);
    delete window._parallax;
  } else {
    requestUpdate(true);
  }
}

function requestUpdate(strict = false) {
  if (!window._parallax) return;

  if (globals.latestScrollY !== window.pageYOffset || strict) {
    if (!window._parallax.animate) return;
    window._parallax.animate = false;

    globals.latestScrollY = window.pageYOffset;
    
    const body = document.body,
      html = document.documentElement,
      scrollPos = window.pageYOffset || document.documentElement.scrollTop,
      screenHeight = window.innerHeight,
      windowHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

    const targets = window._parallax.targets;
    requestAnimFrame(function() {
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        target._parallax(windowHeight, screenHeight, scrollPos);
      }
      window._parallax.animate = true;
    });
  }
}

function applyParallax(windowHeight, screenHeight, scrollPos) {
  const el = this;
  const elFromTop = el.getBoundingClientRect().top + window.pageYOffset;
  const elHeight = el.offsetHeight;
  const minAvaliable = el._bounds[0];
  const maxAvaliable = el._bounds[1];

  // 計算元素中間的位置
  const elMiddle = elFromTop + elHeight / 2;

  // 計算螢幕中間的位置
  const screenMiddle = scrollPos + screenHeight / 2;

  // 計算元素中間與螢幕中間的距離
  const distanceFromMiddle = screenMiddle - elMiddle;

  // 計算背景位置的百分比
  const percentagePos = maxAvaliable - (distanceFromMiddle / screenHeight) * (maxAvaliable - minAvaliable);
  // 限制百分比在 minAvaliable 到 maxAvaliable 之間
  const clampedPercentagePos = Math.min(Math.max(percentagePos, minAvaliable), maxAvaliable);

  el.style.backgroundPositionY = `${clampedPercentagePos}%`;
}

function update(el, binding) {
  el._bounds = binding.value || [0, 100];
}

// 定義自定義指令 bgParallax
const bgParallaxDirective = {
  mounted: bind,
  updated: update,
  unmounted: unbind
};

// 獲取當前組件實例並註冊指令
const instance = getCurrentInstance();
instance.appContext.app.directive('bg-parallax', bgParallaxDirective);

// const loadCategories = async () => {
//   await userStore.fetchCategories();
//   categories.value = userStore.allCategories;
// };

onMounted(() => {
  if (typeof window._parallax === 'undefined') {
    window._parallax = {
      targets: [],
      callback: requestUpdate,
      animate: true
    };
  }
  forceUpdate();
  // loadCategories();
});

onUnmounted(() => {
  window.removeEventListener('scroll', requestUpdate);
  window.removeEventListener('resize', forceUpdate);
});
</script>

<style lang="scss" scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
}

section {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.section__title {
  text-transform: uppercase;
  font-size: 1.875rem;
  font-weight: 900;
}

.section__title--bg {
  background: rgba(245, 245, 245, 0.6);
  padding: 5px 30px;
  border-radius: 10px;
}

.section__title--headline::before {
  display: block;
  font-size: 1.125rem;
  content: 'perfume';
}

.section__img {
  background-repeat: no-repeat;
  &:first-of-type {
    color: #ffffff;
    background-position: center;
    background-image: url('https://eleganceparadisapp.azurewebsites.net/images/perfume_kv.webp');
    p {
      color: #ffffff;
    }
  }
  // &:not(:first-of-type) {
  //   color: #1d1d1d;
  // }
}

@media (max-width: 1200px) {
  .section__img {
    background-position: center;
  }
  .section__title {
    font-size: 1.25rem;
  }
  .section__title--headline::before {
    font-size: 1rem;
  }
}
</style>
