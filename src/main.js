import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import router from './router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import VueCookies from 'vue-cookies';


createApp(App).use(router).use(createPinia()).use(VueCookies, { expire: '7d' }).mount('#app')
