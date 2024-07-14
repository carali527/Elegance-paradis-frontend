import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'


createApp(App).use(router).use(createPinia()).mount('#app')
