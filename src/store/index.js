import { createStore } from "vuex";
import PocketBase from "pocketbase";

const pb = new PocketBase("https://motzartiasi.pockethost.io/");

export default createStore({
  state: {
    isLoggedIn: !!localStorage.getItem("pocketbase_auth"),
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const authData = await pb
          .collection("users")
          .authWithPassword(email, password);
        localStorage.setItem("pocketbase_auth", JSON.stringify(authData));
        commit("login");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    logout({ commit }) {
      pb.authStore.clear();
      localStorage.removeItem("pocketbase_auth");
      commit("logout");
    },
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
  },
});
