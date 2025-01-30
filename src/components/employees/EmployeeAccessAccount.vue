<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          :disabled="this.employee.accessAccountId !== ''"
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="this.employee.accessAccountId !== ''">
      <v-col cols="12">
        <v-text-field
          v-model="formData.oldPassword"
          label="Parola veche"
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
      <v-col cols="8">
        <v-btn @click="addAccessAccount()"
          >{{
            this.employee.accessAccountId !== ""
              ? "Editeaza cont"
              : "Adauga cont"
          }}
          angajat</v-btn
        >
      </v-col>
      <v-col cols="4">
        <v-btn @click="this.close()">Cancel</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import PocketBase from "pocketbase";
export default {
  props: ["employee"],
  data() {
    return {
      formData: {
        email: "",
        password: "",
        passwordConfirm: "",
        oldPassword: "",
        employeeId: this.employee ? this.employee.id : null,
      },

      employees: [],
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    async addAccessAccount() {
      if (this.employee.accessAccountId !== "") {
        await this.pb
          .collection("users")
          .update(this.employee.id, this.formData);
      } else {
        this.pb
          .collection("users")
          .create(this.formData)
          .then(() => {
            return this.pb.collection("employees").update(this.employee.id, {
              accessAccountId: this.employee.id,
              accessAccountEmail: this.formData.email,
            });
          })
          .finally(() => {
            return this.pb
              .collection("users")
              .requestVerification(this.formData.email);
          });
      }
    },
    close() {
      this.$emit("close");
    },
  },
  created() {
    if (this.accessAccount !== null) {
      this.formData = {
        email: this.employee.accessAccountEmail,
        ...this.employee,
      };
    }
  },
};
</script>
