import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth.state";
import project from "./modules/project.state";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, project },
});
