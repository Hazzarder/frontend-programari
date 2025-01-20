<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title> Adauga cont de acces </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.email"
                label="Email"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.password"
                label="Parola"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.passwordConfirm"
                label="Verificare parola"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="formData.employeeId"
                :items="employees"
                item-title="name"
                :rules="[(v) => !!v || 'Stilist este obligatoriu']"
                item-value="id"
                label="Angajat asociat"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="AddUser()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import PocketBase from "pocketbase";
export default {
  data() {
    return {
      dialog: true,

      employees: [],
      formData: {
        email: "",
        password: "",
        passwordConfirm: "",
        employeeId: "",
        emailVisibility: true,
      },
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    async getEmployees() {
      this.employees = await this.pb.collection("employees").getFullList({
        filter: `hasAccessAccount = false`,
      });
    },
    async AddUser() {
      await this.pb
        .collection("users")
        .create(this.formData)
        .then(() => {
          this.pb.collection("employees").update(this.formData.employeeId, {
            hasAccessAccount: true,
          });
          this.pb.collection("users").requestVerification(this.formData.email);
        })
        .finally(() => {
          this.close();
        });
    },

    close() {
      this.$emit("close-and-refresh-empolyees");
    },
    async save() {
      this.$emit("close-and-refresh-empolyees");
    },
  },
  mounted() {
    this.getEmployees();
  },
};
</script>
