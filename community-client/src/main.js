import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

Vue.config.productionTip = false

//完整引入 MuseUI
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
Vue.use(MuseUI);

//全局使用 MuseUI的Message插件
import "muse-ui-message/dist/muse-ui-message.css";
import Message from "muse-ui-message";
Vue.use(Message);

//使用fastclick
import FastClick from 'fastclick';
FastClick.attach(document.body);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
