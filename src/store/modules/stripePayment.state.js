import camelCase from "lodash/camelCase";
import transform from "lodash/transform";
import isObject from "lodash/isObject";
import HttpService from "@/services/http.service";
import ValidationException from "@/exceptions/ValidationException";

const camelize = (obj) =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = Array.isArray(target) ? key : camelCase(key);
    acc[camelKey] = isObject(value) ? camelize(value) : value;
  });

export default {
  namespaced: true,

  state: () => ({
    loading: {
      prepare: false,
    },
    meta: {},
    items: [],
  }),

  getters: {},

  actions: {
    bootstrap({ state, commit }) {
      for (const key in state.loading) {
        commit("setLoading", { key: key, value: false });
      }
    },

    async prepare({ commit }, { id }) {
      commit("setLoading", { key: "prepare", value: true });
      try {
        const pi = await HttpService.authGet(
          `/project/${id}/payment/prepare/stripe`
        );
        commit("setLoading", { key: "prepare", value: false });
        return camelize(pi);
      } catch (e) {
        commit("setLoading", { key: "store", value: false });
        if (e.response && e.response.status === 422) {
          throw new ValidationException(e.message, e.response.data.errors);
        }
        throw e;
      }
    },
  },

  mutations: {
    setLoading(state, { key, value }) {
      state.loading[key] = value;
    },
  },
};
