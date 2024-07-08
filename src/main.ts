import { createApp } from 'vue'
import App from './App.vue'
import './App.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/less/common.less'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn,
}).use(router).use(pinia).mount('#app')
