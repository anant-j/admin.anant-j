import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "./firebase_config.js";
import vuetify from "./plugins/vuetify";
import VueApexCharts from "vue-apexcharts";
import * as VueGoogleMaps from "gmap-vue";

Vue.config.productionTip = false;

Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    libraries: "places",
  },
  installComponents: true,
});
let app;

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch("auth/fetchUser", user);
  if (!app) {
    new Vue({
      store,
      router,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
