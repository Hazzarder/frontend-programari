import PocketBase from "pocketbase";

const pb = new PocketBase("https://motzartiasi.pockethost.io/");
const state = {
  user: null,
  token: null,
};
const getters = {
  isAuthenticated: (state) => !!state.user,
  StateUser: (state) => state.user,
  StateToken: (state) => state.token,
};
const actions = {
  async login({ commit }, { email, password }) {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      if (authData.token) {
        localStorage.setItem("pocketbase_auth", JSON.stringify(authData));
        await commit("setToken", authData.token);
        await commit("setUser", authData?.record);
        return authData;
      }
    } catch (error) {
      return "error";
    }
  },
  async logout({ commit }) {
    localStorage.removeItem("pocketbase_auth");
    commit("logout");
    await commit("setToken", null);
    await commit("setUser", null);
  },
};
const mutations = {
  logout: (state) => {
    state.user = null;
    state.token = null;
  },
  setUser: (state, user) => {
    console.log(user);
    state.user = user;
  },
  setToken: (state, token) => {
    console.log(token);
    state.token = token;
  },
};
export default {
  state,
  getters,
  actions,
  mutations,
};
