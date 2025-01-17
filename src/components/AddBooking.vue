<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title> Adauga programare noua </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="form-field"
                v-model="formData.name"
                label="Name"
                required
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.typeOfActivity"
                class="form-field"
                required
                label="Serviciu"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="formData.resourceId"
                class="form-field"
                required
                :items="employees"
                item-title="name"
                item-value="id"
                label="Angajat"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <VueDatePicker
                required
                v-model="formData.startTime"
                :format="'dd/MM/yyyy - hh:mm'"
                :max-date="formData.endTime"
                v-bind:max-time="formData.endTime"
                class="form-field"
              ></VueDatePicker>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <VueDatePicker
                required
                v-model="formData.endTime"
                :format="'dd/MM/yyyy - hh:mm'"
                :min-date="formData.startTime"
                v-bind:min-time="formData.startTime"
                class="form-field"
              ></VueDatePicker>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="addBooking()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import PocketBase from "pocketbase";
export default {
  components: {
    VueDatePicker,
  },
  data() {
    return {
      dialog: true,
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      employees: [],
      formData: {
        name: "",
        typeOfActivity: "",
        resourceId: "",
        startTime: "",
        endTime: "",
      },
    };
  },
  methods: {
    async getEmployees() {
      const records = await this.pb.collection("employees").getFullList({});
      this.employees = records;
    },
    close() {
      this.$emit("close");
    },
    addBooking() {
      this.pb.collection("bookings").create(this.formData);
      this.close();
    },
  },
  mounted() {
    this.getEmployees();
  },
};
</script>
<style scoped>
@media (max-width: 600px) {
  .form-field {
    width: 100%;
  }
}
</style>
