import Vue from 'vue'
import Vuex from 'vuex'
import login from "../modules/login"
import crud from "../modules/crud"
import files from "../modules/files"

Vue.use(Vuex);

export default new Vuex.Store({

  namespace: true,
  state: {
    drawer: true
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    }
  },
  actions: {
    TOGGLE_DRAWER({ commit }) {
      commit('toggleDrawer');
    }
  },
  getters: {
    DRAWER_STATE(state) {
      return state.drawer;
    }
  },
  modules: {
    login,
    crud,
    files
  }
});
