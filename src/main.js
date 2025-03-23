import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'
import VueLazyload from 'vue-lazyload'
// Importa todos os estoçps da aplicação
import "vue3-toastify/dist/index.css"
//import "vue-multiselect/dist/vue-multiselect.css";
import "./assets/styles/tailwind.css";


const app = createApp(App)
app.use(router)
app.use(store)
app.use(VueLazyload)
app.mount('#app')