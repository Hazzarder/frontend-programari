<template>
  <v-app>
    <v-main>
      <Header @logoutAction="this.logout()" v-if="isLoggedIn" />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import PocketBase from "pocketbase";
import Header from "./components/Header.vue";
export default {
  name: "App",
  components: {
    Header,
  },
  data() {
    return {
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("pocketbase_auth");
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    async checkIfLoggedIn() {
      try {
        const loggedIn = await this.pb.collection("testlogin").getFullList({});
        if (loggedIn.length === 0) {
          this.logout();
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        this.logout();
      }
    },
  },
  mounted() {
    this.checkIfLoggedIn();
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
