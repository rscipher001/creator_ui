<template>
  <section class="container">
    <b-loading is-full-page v-model="isLoading"></b-loading>
    <div class="section py-4">
      <div class="columns">
        <div class="column px-0">
          <div class="level">
            <div class="level-left is-size-3">Pay</div>
            <div class="level-right">
              <b-button tag="router-link" to="/project" type="is-white">
                Back
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section py-4">
      <div class="columns box">
        <div class="column">
          <div class="hero is-medium">
            <div class="hero-body container is-flex has-text-centered">
              <div class="is-flex-direction-colomn">
                <h1 class="is-size-2">Review your input</h1>
                <p class="is-size-4">
                  <stripe-element-payment
                    v-if="elementOptions.clientSecret"
                    ref="paymentRef"
                    :elements-options="elementOptions"
                    :confirm-params="confirmParams"
                    :pk="pk"
                  >
                  </stripe-element-payment>
                  <button @click="pay">Pay Now</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { StripeElementPayment } from "@vue-stripe/vue-stripe";

export default {
  name: "StripePay",

  components: {
    StripeElementPayment,
  },

  data() {
    return {
      projectId: null,
      pk: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
      confirmParams: {
        return_url: "http://localhost:8081/project/44/pay/stripe",
      },
      elementOptions: {
        clientSecret: null,
        appearance: {},
      },
    };
  },

  created() {
    this.projectId = this.$route.params.id;
    this.prepare();
  },

  methods: {
    ...mapActions("stripePayment", {
      prepareAction: "prepare",
    }),

    pay() {
      this.$refs.paymentRef.submit();
    },

    async prepare() {
      try {
        const paymentIntent = await this.prepareAction({
          id: this.projectId,
        });
        this.elementOptions.clientSecret = paymentIntent.clientSecret;
      } catch (e) {
        console.error(e);
        this.$buefy.toast.open({
          message: "Unable to prepare for payment",
          type: "is-danger",
          position: "is-bottom-right",
        });
      }
    },
  },

  computed: {
    ...mapState("auth", {
      user: (state) => state.user,
    }),
    ...mapState("stripePayment", {
      loading: (state) => state.loading,
    }),
    isLoading() {
      return this.loading.prepare;
    },
  },
};
</script>
