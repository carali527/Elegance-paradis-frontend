<template>
  <div class="address-container">
    <div class="input-group">
      <select
        @change="changeCity"
        :class="['select-field', cityError ? 'border-red' : 'border-gray-light']"
        v-model="props.citySelect"
      >
        <option selected value="" disabled>*請選擇城市</option>
        <option v-for="(city, index) in post" :value="index" :key="city">{{ city }}</option>
      </select>
      <span v-if="props.cityError" class="error">{{ props.cityError }}</span>
    </div>

    <div class="input-group">
      <select
        @change="changeDistrict"
        :class="['select-field', districtError ? 'border-red' : 'border-gray-light']"
        v-model="props.districtsSelect"
      >
        <option selected value="" disabled>*請選擇鄉鎮市區</option>
        <option v-for="(district, index) in districts" :value="index" :key="district.name">{{ district.name }}</option>
      </select>
      <span v-if="props.districtError" class="error">{{ props.districtError }}</span>
    </div>
    <slot name="address"></slot>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import cities from '../../cities.json';

const props = defineProps(['citySelect', 'districtsSelect', 'addressError', 'cityError', 'districtError']);
const emit = defineEmits(['changeCitySelect', 'changeDistricts', 'updateCityDistrictName']);

const cityError = ref(false);
const districtError = ref(false);

const post = computed(() => {
  return cities.map(item => item.name);
});

const districts = computed(() => {
  if (props.citySelect !== null && cities[props.citySelect]) {
    return cities[props.citySelect].districts;
  }
  return [];
});

const changeCity = (event) => {
  const selectedCityIndex = event.target.value;
  emit('changeCitySelect', selectedCityIndex);
  
  // 傳遞所選城市名稱
  const cityName = cities[selectedCityIndex].name;
  emit('updateCityDistrictName', { cityName });

  if (props.districtsSelect >= cities[selectedCityIndex]?.districts.length) {
    emit('changeDistricts', 0);
  }
  cityError.value = false;
};

const changeDistrict = (event) => {
  const selectedDistrictIndex = event.target.value;
  emit('changeDistricts', selectedDistrictIndex);

  // 傳遞所選城市和區域名稱
  const districtName = cities[props.citySelect].districts[selectedDistrictIndex].name;
  emit('updateCityDistrictName', {
    cityName: cities[props.citySelect].name,
    districtName
  });

  districtError.value = false;
};

watch(
  () => props.citySelect,
  () => {
    cityError.value = false;
  }
);

watch(
  () => props.districtsSelect,
  () => {
    districtError.value = false;
  }
);
</script>

<style lang="scss" scoped>
.address-container {
  display: flex;
  gap: 10px;
  .input-group {
    display: flex;
    flex-direction: column;
    span.error {
      font-size: 12px;
      color: #ff5b74;
      text-align: left;
      font-weight: 500;
    }
  }
  .input-field {
    flex-grow: 1;
  }
  .address-warning,
  .errmsg {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #e53e3e;
    margin-bottom: 8px;

    .icon {
      margin-right: 5px;
    }

    svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
  }

  .select-field {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    outline: none;
    border: 1px solid #d1d1d1;
    margin-bottom: 8px;

    &:focus {
      border-color: #1a73e8;
    }

    &.border-red {
      border-color: #e53e3e;
    }

    &.border-gray-light {
      border-color: #d1d1d1;
    }
  }
}

@media (max-width: 768px) {
  .address-container {
    flex-direction: column;
  }
}

</style>