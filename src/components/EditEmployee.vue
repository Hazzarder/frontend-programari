<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title> Editeaza angajat </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Name"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.email"
                label="Email"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.password"
                label="Password"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.passwordConfirm"
                label="Password Confirm"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="addEmployee()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import PocketBase from "pocketbase";
export default {
  props: ["employeeId", "name"],
  data() {
    return {
      dialog: true,
      selectedEmployee: this.employeeId,

      formData: {
        name: this.name ? this.name : "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    async addEmployee() {
      await this.pb
        .collection("employees")
        .update(this.selectedEmployee, this.formData)
        .then(() => {
          if (this.formData.email && this.formData.password) {
            const data = {
              email: this.formData.email,
              password: this.formData.password,
              passwordConfirm: this.formData.passwordConfirm,
              emailVisibility: true,
              name: this.formData.name,
            };

            this.pb.collection("users").create(data);
          }
        });
    },

    close() {
      this.$emit("close-and-refresh-empolyees-from-edit");
    },
    async save() {
      this.$emit("close-and-refresh-empolyees-from-edit");
    },
  },
};
</script>
