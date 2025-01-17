<template>
  <v-app>
    <v-main>
      <v-app-bar app color="#00ca98">
        <p
          class="nav-bar-link mr-5 ml-4"
          @click="this.$router.push('/employees')"
        >
          Angajati
        </p>
        <p class="nav-bar-link" @click="this.$router.push('/bookings')">
          Programari
        </p>
        <v-spacer></v-spacer>
        <v-btn @click="logout">Logout</v-btn>
      </v-app-bar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    isLoggedIn() {
      if (localStorage["pocketbase_auth"]) {
      } else {
        this.$router.push("/login");
      }
    },
    logout() {
      localStorage.removeItem("pocketbase_auth");
      this.$router.push("/login");
    },
  },
  mounted() {
    this.isLoggedIn();
  },
};
</script>
<style lang="scss">
.nav-bar-link {
  color: black;
  font-size: 0.9rem;
}
</style>
