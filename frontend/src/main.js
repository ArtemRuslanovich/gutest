import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

import '@/assets/styles/main.scss'

const app = createApp(App)

app.use(router)
app.use(store)

app.component('VueSlider', VueSlider)

app.mount('#app')