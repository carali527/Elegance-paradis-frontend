<template>
  <div class="popup">
    <div class="popup__content" @click.stop>
      <h2>帳戶</h2>
      <div>
        <button @click="setActiveTab('login')" :class="{ active: activeTab === 'login' }">登入</button>
        <button @click="setActiveTab('register')" :class="{ active: activeTab === 'register' }">註冊</button>
      </div>
      <div v-if="activeTab === 'login'">
        <h3>歡迎回來</h3>
        <div class="popup__form--login">
          <input type="text" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" placeholder="電子郵件或手機號碼" />
          <input type="password" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" placeholder="密碼" />
        </div>
        <p class="popup__form--remember">忘記密碼？</p>
        <!-- <input type="checkbox" id="remember" /> -->
        <!-- <label for="remember">記住我（可選項）</label> -->
        <div class="form--btn">
          <button @click="login">登入</button>
          <p>或</p>
          <button class="google-signin">
            <img src="../assets/google_signin.svg" alt="">
            Google
          </button>
        </div>
      </div>
      <div v-if="activeTab === 'register'">
        <!-- 註冊表單 -->
        <h3>註冊帳戶</h3>
        <div class="signin-form">
          <input v-model="registerName" type="text" placeholder="姓名" @blur="validateName(registerName)" :class="{ 'error': registerNameError }"/>
          <span v-if="registerNameError" class="error">{{ registerNameError }}</span>
          <input v-model="registerPhone" type="text" placeholder="電話號碼" @blur="validatePhone(registerPhone)" :class="{ 'error': registerPhoneError }"/>
          <span v-if="registerPhoneError" class="error">{{ registerPhoneError }}</span>
          <input v-model="registerEmail" type="text" placeholder="電子郵件" @blur="validateEmail(registerEmail)" :class="{ 'error': registerEmailError }"/>
          <span v-if="registerEmailError" class="error">{{ registerEmailError }}</span>
          <input v-model="registerPassword" type="password" placeholder="密碼" @blur="validatePassword(registerPassword)" :class="{ 'error': registerPasswordError }"/>
          <span v-if="registerPasswordError" class="error">{{ registerPasswordError }}</span>
          <input v-model="registerConfirmPassword" type="password" placeholder="確認密碼" @blur="validateConfirmPassword(registerPassword, registerConfirmPassword)" :class="{ 'error': registerConfirmPasswordError }"/>
          <span v-if="registerConfirmPasswordError" class="error">{{ registerConfirmPasswordError }}</span>
        </div>
        <div class="form--btn">
          <button @click="register">註冊</button>
          <p>或</p>
          <button class="google-signin">
            <img src="../assets/google_signin.svg" alt="">
            Google
          </button>
        </div>
      </div>
      <button class="close--btn" @click="hidePopup">
        <svg class="close" viewBox="0 0 24 24">
          <g id="bg">
            <rect id="_7093" data-name="7093" class="cls-1" width="24" height="24" opacity="0"></rect>
          </g>
          <g id="_4897" data-name="4897">
            <g id="close-2">
                <g id="_6076" data-name="6076">
                    <rect id="_7094" data-name="矩形 7094" class="cls-1" width="24" height="24" opacity="0"></rect>
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
import { ref } from 'vue';
import { useMemberStore } from '../stores/member';

const userStore = useMemberStore();
const activeTab = ref('login');

// 登入表單
const loginEmail = ref('');
const loginPassword = ref('');
const loginEmailError = ref('');
const loginPasswordError = ref('');

// 註冊表單
const registerName = ref('');
const registerPhone = ref('');
const registerEmail = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');
const registerNameError = ref('');
const registerPhoneError = ref('');
const registerEmailError = ref('');
const registerPasswordError = ref('');
const registerConfirmPasswordError = ref('');

const hidePopup = () => {
  userStore.isMemberPopupVisible(false);
  document.body.style.overflow = '';
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  loginEmailError.value = emailPattern.test(email) ? '' : '無效的電子郵件地址';
  registerEmailError.value = emailPattern.test(email) ? '' : '無效的電子郵件地址';
};

const validatePassword = (password) => {
  const passwordPattern = /^.{6,20}$/;
  loginPasswordError.value = passwordPattern.test(password) ? '' : '密碼必須包含6-20個字符';
  registerPasswordError.value = passwordPattern.test(password) ? '' : '密碼必須包含6-20個字符';
};

const validateConfirmPassword = (password, confirmPassword) => {
  registerConfirmPasswordError.value = password === confirmPassword ? '' : '密碼不匹配';
};

const validateName = (name) => {
  registerNameError.value = name.length > 0 ? '' : '姓名不能為空';
};

const validatePhone = (phone) => {
  const phonePattern = /^[0-9]{10,12}$/;
  registerPhoneError.value = phonePattern.test(phone) ? '' : '無效的電話號碼';
};

// 登入函數
const login = () => {
  validateEmail(loginEmail.value);
  validatePassword(loginPassword.value);

  if (!loginEmailError.value && !loginPasswordError.value) {
    // 處理登入邏輯
  }
};

const register = () => {
  // 處理註冊邏輯
};
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  h2 {
    margin-bottom: 0px;
  }
}

.popup__content {
  position: relative;
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  .close--btn {
    position: absolute;
    top: 5px;
    right: 10px;
    path {
      fill: #1d1d1d;
    }
  }
  .popup__form--remember {
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.8);
    &:hover {
      cursor: pointer;
      text-decoration: underline;
      font-weight: bold;
    }
  }
}

button {
  border-radius: inherit;
  color: #1d1d1d;
  &.active {
    border-bottom: 2px solid #1d1d1d;
  }
}

.popup__form--login, .signin-form {
  display: flex;
  flex-direction: column;
  width: 70%;
  margin: auto;
  input {
    border: 1px solid transparent;
    background-color: rgba(0, 0, 0, .08);
    margin-bottom: 20px;
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    &.error {
      margin-bottom: 0px;
    }
    &:focus {
      border: .5px solid;
    }
  }
  span.error {
    font-size: 12px;
    color: #ff5b74;
    text-align: left;
    font-weight: 500;
  }
}

.google-signin {
  padding: 6px;
  border-radius: 4px;
  border: solid 1px rgba(0, 0, 0, 0.16);
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 5px;
  img {
    height: 20px;
    width: 20px;
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

.form--btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 70%;
  margin: auto;
  button:first-child {
    border: 1px solid transparent;
    border-radius: 4px;
    background: #1d1d1d;
    color: #ffffff;
  }
  button {
    width: 100%;
    padding: 8px;
  }
  p {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    &::before, &::after {
      content: "";
      border-bottom: 1px solid #d8d8d8;
      flex: 1;
      margin-left: 1.75rem;
      margin-right: 1.75rem;
    }
  }
}
</style>
