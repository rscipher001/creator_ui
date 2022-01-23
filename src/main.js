import Vue from "vue";
import Buefy from "buefy";
import App from "@/App.vue";
import store from "./store";
import "buefy/dist/buefy.css";
import router from "./router";
import "./registerServiceWorker";
import { StripePlugin } from "@vue-stripe/vue-stripe";

Vue.use(Buefy);

Vue.config.productionTip = false;

const options = {
  pk: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
  apiVersion: process.env.VUE_APP_API_VERSION,
};

Vue.use(StripePlugin, options);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
