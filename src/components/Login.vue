<template>
  <v-main class="login">
    <v-container>
      <div>
        <h1 class="text-center">Login</h1>
        <v-form v-model="valid">
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="form-field"
                v-model="form.email"
                label="Email"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.password"
                class="form-field"
                label="Password"
                type="password"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn @click="login" color="primary">Login</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import PocketBase from "pocketbase";
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      pb: new PocketBase("http://127.0.0.1:8090"),
    };
  },
  methods: {
    async login() {
      try {
        const authData = await this.pb
          .collection("users")
          .authWithPassword(this.form.email, this.form.password);

        this.$router.push("/bookings");
        // Handle successful login, e.g., redirect to another page
      } catch (error) {
        // Handle login failure, e.g., show an error message
      }
    },
  },
};
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.form-field {
  width: 50%;
}
@media screen and (max-width: 600px) {
  .form-field {
    width: 100%;
  }
}
</style>
