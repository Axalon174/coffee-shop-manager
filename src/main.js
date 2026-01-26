import { createApp } from 'vue'
import { createPinia } from 'pinia' // <--- Importar
import './style.css' // (Si usas Tailwind)
import App from './App.vue'

const pinia = createPinia() 
const app = createApp(App)

app.use(pinia) // <--- Usar Pinia
app.mount('#app')