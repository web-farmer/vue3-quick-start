import './assets/style/main.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// primevue
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import App from '@/App.vue'
import router from '@/router'
import { appInfo } from '@/libs'
import plugins from '@/plugins'
appInfo()

const ComfyUIPreset = definePreset(Aura, {
    semantic: {
        primary: (Aura as any)['primitive'].gray
    }
})

const app = createApp(App)
const pinia = createPinia()
app.use(router)
    .use(PrimeVue, {
        theme: {
            preset: ComfyUIPreset,
            options: {
                prefix: 'p',
                // This is a workaround for the issue with the dark mode selector
                // https://github.com/primefaces/primevue/issues/5515
                darkModeSelector: '.dark-theme, :root:has(.dark-theme)'
            }
        }
    })
    .use(pinia)
    .use(plugins)
    .mount('#app')
