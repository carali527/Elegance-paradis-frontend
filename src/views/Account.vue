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
            <input v-model="contactInfo.email" type="email" id="email" placeholder="電子郵件" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" @blur="validateEmail(contactInfo.email)" />
            <div>
              <span v-if="changeEmailError" class="error">{{ changeEmailError }}</span>
            </div>
          </div>
        </div>
        <div class="form-section__group">
          <label for="phoneNumber">手機號碼</label>
          <div class="form-section__group-input" :class="{ 'error': changePhoneError }">
            <input v-model="contactInfo.phoneNumber" type="text" placeholder="電話號碼" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')" @blur="validatePhone(contactInfo.phoneNumber)" />
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
            <input v-model="passwords.newPassword" type="password" id="newPassword" placeholder="新的密碼" @blur="validatePassword(registerPassword)" oninput="value=value.replace(/[-<>;\\'&quot;]/g,'')"/>
          </div>
        </div>
        <button type="submit" class="form-section__button">更改密碼</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const changeNameError = ref('');
const changePhoneError = ref('');
const changeEmailError = ref('');
const personalInfo = ref({
  name: 'cc',
  birthYear: '2004',
  birthMonth: '3',
  birthDay: '5'
});

const contactInfo = ref({
  email: '34342435ddw@gmail.com',
  phoneNumber: '987864643',
});

const passwords = ref({
  currentPassword: '',
  newPassword: ''
});

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  changeEmailError.value = emailPattern.test(email) ? '' : '無效的電子郵件地址';
};

const validatePassword = (password) => {
  const passwordPattern = /^.{6,20}$/;
  changePasswordError.value = passwordPattern.test(password) ? '' : '密碼必須包含6-20個字符';
};

const validateName = (name) => {
  changeNameError.value = name.length > 0 ? '' : '姓名不能為空';
};

const validatePhone = (phone) => {
  const phonePattern = /^[0-9]{10,12}$/;
  changePhoneError.value = phonePattern.test(phone) ? '' : '無效的電話號碼';
};

const updatePersonalInfo = () => {
  console.log('Updating personal info:', personalInfo.value);
};

const updatePassword = () => {
  console.log('Updating password:', passwords.value);
};
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
