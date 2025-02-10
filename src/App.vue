<template>
  <v-app>
    <v-main>
      <Header @logoutAction="this.logout()" v-if="isLoggedIn" />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  name: "App",
  components: {
    Header,
  },
  methods: {
    logout() {
      localStorage.removeItem("pocketbase_auth");
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
};
</script>
<style lang="scss">
.nav-bar-link {
  color: black;
  font-size: 0.9rem;
  margin-left: 12px;
}
</style>
