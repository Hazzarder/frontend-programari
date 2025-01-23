<template>
  <!-- App Bar -->
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon
      @click="toggleDrawer"
      class="d-md-none"
    ></v-app-bar-nav-icon>

    <!-- Logo -->
    <v-toolbar-title>
      <span class="font-weight-bold">MotzArt Programari</span>
    </v-toolbar-title>

    <!-- Desktop Navigation Links -->
    <v-spacer></v-spacer>
    <v-btn
      text
      class="d-none d-md-flex"
      v-for="link in links"
      :key="link.text"
      :to="link.route"
    >
      {{ link.text }}
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn text class="d-none d-md-flex" @click="logOut()"> Logout </v-btn>
  </v-app-bar>

  <!-- Navigation Drawer for Mobile -->
  <v-navigation-drawer v-model="drawer" app temporary class="d-md-none">
    <v-list>
      <v-list-item
        v-for="link in links"
        :key="link.text"
        :to="link.route"
        @click="toggleDrawer"
      >
        <v-list-item-title>{{ link.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-spacer></v-spacer>
    <v-list>
      <v-list-item @click="logOut()">
        <v-list-item-title class="logout-btn">Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <!-- Content -->
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      drawer: false,
      links: [
        { text: "Angajati", route: "/employees" },
        { text: "Programari", route: "/bookings" },
        { text: "Conturi de access", route: "/accounts" },
        { text: "Puncte de lucru", route: "/workPoints" },
      ],
    };
  },
  emits: ["logoutAction"],
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
    logOut() {
      this.$emit("logoutAction");
    },
  },
};
</script>

<style>
/**** Add any custom styles here ****/
.logout-btn {
  color: red;
}
</style>
