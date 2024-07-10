import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css'
import './App.css'
import './assets/less/common.less'
import moment from 'moment';
import lang from './lang/index.js'
moment.locale('zh-cn',lang['zh-cn'])
const pinia = createPinia();
const app = createApp(App)
app.config.globalProperties.$moment = moment
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  locale: zhCn,
}).use(router).use(pinia).mount('#app')
