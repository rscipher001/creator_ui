import Vue from "vue";
import Buefy from "buefy";
import App from "@/App.vue";
import store from "./store";
import "buefy/dist/buefy.css";
import router from "./router";
import "./registerServiceWorker";

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
