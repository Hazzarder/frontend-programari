<template>
  <v-main class="login">
    <v-container>
      <div>
        <h1 class="text-center">Login</h1>
        <v-form v-model="valid" @submit.prevent="handleLogin">
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
              <v-btn type="submit" color="primary">Login</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-container>
  </v-main>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      valid: false,
    };
  },
  methods: {
    ...mapActions(["login"]),
    async handleLogin() {
      try {
        const resp = await this.login(this.form);
        if (resp === "error") {
          alert("Invalid credentials");
        } else {
          this.$router.push("/bookings");
        }
      } catch (e) {
        console.error(e);
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
