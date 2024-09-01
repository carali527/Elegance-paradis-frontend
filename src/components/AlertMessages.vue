<template>
  <div class="popup-overlay" @click="closePopup">
    <div class="popup-content" @click.stop>
      <div :class="{
          'popup-success': status,
          'popup-error': !status
        }">
        <i v-if="status" class="fa-solid fa-check"></i>
        <i v-else class="fa-solid fa-xmark"></i>
      </div>
      <h2>{{ message }}</h2>
      <button class="close--btn" @click="closePopup">
        <svg class="close" viewBox="0 0 24 24">
          <g id="bg">
              <rect id="_7093" data-name="7093" class="cls-1" width="24" height="24" opacity="0"></rect>
          </g>
          <g id="_4897" data-name="4897">
              <g id="close-2">
                  <g id="_6076" data-name="6076">
                      <rect id="_7094" data-name="7094" class="cls-1" width="24" height="24" opacity="0"></rect>
                  </g>
                  <g id="_4062" data-name="4062">
                      <g id="_1994" data-name="1994">
                          <g id="_1995" data-name="1995">
                              <circle id="_2061" data-name="2061" class="cls-2" cx="12" cy="12" r="12"></circle>
                          </g>
                      </g>
                  </g>
              </g>
              <path id="cross" class="cls-3" d="M16.58,15,13.49,12l3.09-3.08a1.09,1.09,0,0,0-1.43-1.65.57.57,0,0,0-.11.11L12,10.42,8.87,7.33A1.09,1.09,0,0,0,7.33,8.87L10.42,12,7.33,15a1.09,1.09,0,1,0,1.43,1.64l.11-.1L12,13.49,15,16.58a1.09,1.09,0,1,0,1.65-1.43,1.14,1.14,0,0,0-.11-.11Z"></path>
          </g>
        </svg>
      </button>
    </div>
  </div>    
</template>
  
<script setup>
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  status: {
    type: Boolean,
    default: true
  }
});

const closePopup = () => {
  userStore.closeAllPopup();
  document.body.style.overflow = '';
};
</script>
  
<style lang="scss" scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-success {
  border-radius: 50%;
  border: 2px solid #28a745;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #28a745;
}
.popup-error {
  border-radius: 50%;
  border: 2px solid #de0f0f;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #de0f0f;
}
.popup-content {
  position: relative;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

button {
  margin-top: 10px;
  padding: 0px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.close--btn {
  position: absolute;
  top: 5px;
  right: 10px;
  path {
    fill: #1d1d1d;
  }
}

svg.close {
  opacity: 1;
  fill: rgba(0, 0, 0, 0.03);
  float: none;
  width: 24px;
  height: 24px;
  border: .5px solid #1d1d1d;
  border-radius: 50%;
}
</style>
