<template>
  <div class="quantity-selector">
    <button @click="decrement" :disabled="quantity <= 1">-</button>
    <input 
      type="number" 
      v-model="quantity" 
      @input="onInput" 
      min="1" 
      :max="maxQuantity" 
      class="quantity-input" 
      readonly 
    />
    <button 
      @click="increment" 
      :disabled="quantity >= maxQuantity"
    >
      +
    </button>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  maxQuantity: {
    type: Number,
    default: Infinity
  }
});

const emits = defineEmits(['update:modelValue']);

const quantity = ref(props.modelValue);

watch(quantity, (newQuantity) => {
  emits('update:modelValue', newQuantity);
});

watch(() => props.modelValue, (newValue) => {
  quantity.value = newValue;
});

const increment = () => {
  if (quantity.value < props.maxQuantity) {
    quantity.value++;
  }
};

const decrement = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// 處理直接輸入數量（雖然 input 設置為 readonly，但為了防範意外）
const onInput = (event) => {
  const value = parseInt(event.target.value, 10);
  if (!isNaN(value) && value > 0) {
    quantity.value = Math.min(value, props.maxQuantity);
  } else {
    quantity.value = 1;
  }
};
</script>
  
<style scoped>
.quantity-selector {
  display: flex;
  align-items: center;
}

.quantity-input {
  width: 50px;
  text-align: center;
  margin: 0 5px;
}

button {
  padding: 8px;
}
</style>  