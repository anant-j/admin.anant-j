import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import config from "./modules/config";
import { getCurrentMonth } from "../utilities";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    visitors: [],
    blacklist: {},
    whitelist: {},
    selectedDate: getCurrentMonth(),
  },
  modules: {
    auth,
    config,
  },
});
