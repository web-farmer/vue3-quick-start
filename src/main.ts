import './assets/style/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// primevue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from '@/App.vue'
import router from '@/router'
import { appInfo } from '@/libs'
import plugins from '@/plugins'
appInfo()

const app = createApp(App)
const pinia = createPinia()
app.use(router)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(pinia)
    .use(plugins)
    .mount('#app')
