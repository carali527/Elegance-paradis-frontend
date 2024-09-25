<template>
  <div class="dropdown">
    <div class="dropdown__options" @click="toggleDropdown">
      <div class="product__options-selected">
        <span>{{ selectedSpecName }}</span>
      </div>
      <span class="dropdown__options-icon" :class="{ open: dropdownOpen }">
        <svg class="svg-icon back" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <g id="4897" data-name="4897">
            <g id="close">
              <g id="4062" data-name="4062">
                <g id="1994" data-name="1994">
                  <g id="1995" data-name="1995">
                    <circle id="2060" data-name="2060" class="cls-2" cx="12" cy="12" r="12"></circle>
                  </g>
                </g>
              </g>
            </g>
            <g id="8819" data-name="8819">
              <path id="8465" data-name="8465" class="cls-3" d="M13.43,17.05a1.07,1.07,0,0,1-.74-.3l-4-4a1,1,0,0,1,0-1.45h0l4-4a1,1,0,0,1,1.45.28,1.06,1.06,0,0,1,0,1.19L10.88,12l3.25,3.26a1,1,0,0,1,0,1.48,1.06,1.06,0,0,1-.71.32Z"></path>
            </g>
          </g>
        </svg>
      </span>
    </div>
    <ul v-if="dropdownOpen" class="dropdown__options-menu">
      <li 
        v-for="(option, index) in computedOptions" 
        :key="index" 
        @click="handleClick(option)" 
        :class="{ disabled: isOptionDisabled(option) }"
      >
        {{ option.specName }} <span v-if="isOptionDisabled(option)">(缺貨)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [Object, Number, String], 
    default: () => ({})
  },
  options: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(['update:modelValue']);

const dropdownOpen = ref(false);
const selected = ref(props.modelValue);

const selectedSpecName = computed(() => {
  if (selected.value.specName) {
    return selected.value.specName;
  }
  return '請選擇規格';
});

const computedOptions = computed(() => {
  return props.options;
});

watch(() => props.modelValue, (newValue) => {
  selected.value = newValue;
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectItem = (item) => {
  selected.value = item;
  emits('update:modelValue', item);
  dropdownOpen.value = false;
};

const handleClick = (option) => {
  if (!isOptionDisabled(option)) {
    selectItem(option);
  }
};

const isOptionDisabled = (option) => {
  return option.availableStock === 0;
};
</script>

<style lang="scss" scoped>
.dropdown__options-menu li.disabled {
  color: gray;
  cursor: not-allowed;
}

.dropdown__options-menu li:hover:not(.disabled) {
  background-color: #f0f0f0;
}
.dropdown {
  position: relative;
}

.dropdown__options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 2px;
}

.product__options-selected {
  width: 100%;
}

.dropdown__options-icon {
  display: flex;
  align-items: center;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
  &.open {
    transform: rotate(-90deg);
  }
}

.dropdown__options-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ddd;
  background-color: #ffffff;
  z-index: 1000;
  margin: auto;
  border-top: unset;
  border-radius: 0 0 2px 2px;
  li {
    padding: 10px;
    cursor: pointer;
  }
}

.cls-2 {
  fill: #ffffff;
}

.cls-3 {
  fill: #1d1d1d;
}
</style>
