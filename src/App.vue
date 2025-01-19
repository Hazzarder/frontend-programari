<template>
  <v-app>
    <v-main>
      <v-app-bar app color="#00ca98" v-if="isLoggedIn">
        <p class="nav-bar-link" @click="this.$router.push('/employees')">
          Angajati
        </p>
        <p class="nav-bar-link" @click="this.$router.push('/bookings')">
          Programari
        </p>
        <p class="nav-bar-link" @click="this.$router.push('/accounts')">
          Conturi de access
        </p>
        <v-spacer></v-spacer>
        <v-btn @click="logout">Logout</v-btn>
      </v-app-bar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { is } from "date-fns/locale";

export default {
  name: "App",
  methods: {
    logout() {
      localStorage.removeItem("pocketbase_auth");
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
  computed: {
    isLoggedIn() {
      console.log(this.$store.getters.isLoggedIn);
      return this.$store.getters.isLoggedIn;
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
