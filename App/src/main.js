import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from './firebase_config.js';
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts'
import { firestorePlugin } from 'vuefire'


Vue.config.productionTip = false;

Vue.use(firestorePlugin);
Vue.use(VueApexCharts);
Vue.component('apexchart', VueApexCharts);
let app;

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('auth/fetchUser', user);
  if(!app) {
    new Vue({
      store,
      router,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }
});
