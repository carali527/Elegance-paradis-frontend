<template>
  <div class="form-container">
    <section class="form-section form-section--personal">
      <h2>個人資料</h2>
      <form @submit.prevent="updatePersonalInfo">
        <div class="form-section__group">
          <label for="lastName">名字</label>
          <div class="form-section__group-input" :class="{ 'error': changeNameError }">
            <input v-model="personalInfo.name" type="text" id="name" placeholder="名字" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" @blur="validateName(personalInfo.name)" />
            <div>
              <span v-if="changeNameError" class="error">{{ changeNameError }}</span>
            </div>
          </div>
        </div>
        <div class="form-section__group">
          <label for="email">電子郵件</label>
          <div class="form-section__group-input" :class="{ 'error': changeEmailError }">
            <input v-model="personalInfo.email" type="email" id="email" placeholder="電子郵件" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" @blur="validateEmail(personalInfo.email)" />
            <div>
              <span v-if="changeEmailError" class="error">{{ changeEmailError }}</span>
            </div>
          </div>
        </div>
        <div class="form-section__group">
          <label for="mobile">手機號碼</label>
          <div class="form-section__group-input" :class="{ 'error': changePhoneError }">
            <input v-model="personalInfo.mobile" type="text" placeholder="電話號碼" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" @blur="validatePhone(personalInfo.mobile)" />
            <div>
              <span v-if="changePhoneError" class="error">{{ changePhoneError }}</span>
            </div>
          </div>
          </div>
        <button type="submit" class="form-section__button">更新個人資料</button>
      </form>
    </section>
    <section class="form-section form-section--password">
      <h2>密碼</h2>
      <p>您的密碼必須包含6-20個字符</p>
      <form @submit.prevent="updatePassword">
        <div class="form-section__group">
          <label for="currentPassword">目前的密碼</label>
          <div class="form-section__group-input">
            <input v-model="passwords.currentPassword" type="password" id="currentPassword" placeholder="目前的密碼" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')"/>
          </div>
        </div>
        <div class="form-section__group">
          <label for="newPassword">新的密碼</label>
          <div class="form-section__group-input">
            <input v-model="passwords.newPassword" type="password" id="newPassword" placeholder="新的密碼" @blur="validatePassword(registerPassword)" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" :class="{ 'error': changePasswordError }"/>
            <div>
              <span v-if="changePasswordError" class="error">{{ changePasswordError }}</span>
            </div>
          </div>
        </div>
        <button type="submit" class="form-section__button">更改密碼</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '../stores/userStore';
import { updateCustomerPassword } from '@/api/index';

const userStore = useUserStore();
const changeNameError = ref('');
const changePhoneError = ref('');
const changeEmailError = ref('');
const changePasswordError = ref('');

const personalInfo = ref({
  id:'',
  name: '',
  email: '',
  mobile: ''
});

watch(() => userStore.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    personalInfo.value.id = newUserInfo.accountId;
    personalInfo.value.name = newUserInfo.name;
    personalInfo.value.email = newUserInfo.email;
    personalInfo.value.mobile = newUserInfo.mobile;
  }
}, { immediate: true });

const passwords = ref({
  currentPassword: '',
  newPassword: ''
});

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  changeEmailError.value = emailPattern.test(email) ? '' : '無效的電子郵件地址';
};

const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,20}$/;
  changePasswordError.value = passwordPattern.test(password) ? '' : '密碼必須包含6-20個字符，且至少包含一個大寫字母、一個小寫字母和一個符號';
};

const validateName = (name) => {
  changeNameError.value = name.length > 0 ? '' : '姓名不能為空';
};

const validatePhone = (phone) => {
  const phonePattern = /^[0-9+\-]+$/;
  changePhoneError.value = phonePattern.test(phone) ? '' : '無效的電話號碼';
};

const updatePersonalInfo = async () => {
  validateName(personalInfo.value.name);
  validateEmail(personalInfo.value.email);
  validatePhone(personalInfo.value.mobile);

  if (!changeNameError.value && !changeEmailError.value && !changePhoneError.value) {
    try {
      await userStore.updateCustomerInfo(personalInfo.value.id, {
        accountId: personalInfo.value.id,
        name: personalInfo.value.name,
        email: personalInfo.value.email,
        mobile: personalInfo.value.mobile
      });
      userStore.isAlertMessagesShow({visible: true, message: '個人資料更新成功', status: true});
    } catch (error) {
      console.error('個人資料更新失敗', error);
    }
  }
};

const updatePassword = async () => {
  validatePassword(passwords.value.newPassword);
  if (!changePasswordError.value) {
    const updateData = {
      accountId: personalInfo.value.id,
      oldPassword: passwords.value.currentPassword,
      newPassword: passwords.value.newPassword
    };
    try {
      await updateCustomerPassword(personalInfo.value.id, updateData);
      userStore.isAlertMessagesShow({visible: true, message: '密碼更新成功', status: true});
    } catch (error) {
      console.error('密碼更新失敗', error.response?.data || error);
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 40px;
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 10px;
  }
}

.form-section__group {
  display: flex;
  justify-content: space-between;
  label {
    font-weight: 500;
    text-wrap: nowrap;
    width: 80px;
    display: inline-block;
  }
  span.error {
    margin: 3px 0;
    font-size: 12px;
    color: #ff5b74;
    text-align: left;
    font-weight: 500;
  }
}

.form-section__group-input {
  display: flex;
  margin-bottom: 20px;
  flex-direction: column;
  align-items: end;
  width: 85%;
  &.error {
    margin-bottom: 0px;
  }
  input {
    width: 95%;
    box-sizing: border-box;
    border: 1px solid transparent;
    background-color: rgba(0, 0, 0, 0.08);
    padding: 5px;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }
  }
  div {
    display: flex;
    width: 95%;
    text-align: left;
  }
}

.form-section__date-picker {
  display: flex;
  gap: 10px;
}

.form-section__button {
  width: 100%;
  padding: 15px;
  background-color: #000;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
</style>
