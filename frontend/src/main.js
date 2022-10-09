import { createApp } from 'vue'
import App from '@/App.vue'
import http from "@/store/axios";
import {store} from "@/store";

const app = createApp(App)
app.use(store).mount('#app')
app.config.globalProperties.$axios = http

