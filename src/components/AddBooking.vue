<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-center"> Adauga programare noua </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col class="v-col-style"
                ><label class="label-class">Nume client</label>
                <v-text-field
                  v-model="formData.name"
                  required
                  :rules="[(v) => !!v || 'Nume client este obligatoriu']"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="v-col-style"
                ><label class="label-class">Serviciu</label>
                <v-text-field
                  v-model="formData.typeOfActivity"
                  required
                  :rules="[(v) => !!v || 'Serviciu este obligatoriu']"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="v-col-style"
                ><label class="label-class">Stilist</label>
                <v-select
                  v-model="formData.resourceId"
                  required
                  :items="employees"
                  item-title="name"
                  :rules="[(v) => !!v || 'Stilist este obligatoriu']"
                  item-value="id"
                  variant="outlined"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12"
                ><label class="label-class">Data start</label>
                <VueDatePicker
                  required
                  v-model="formData.startTime"
                  :format="'dd/MM/yyyy - hh:mm'"
                  :rules="[(v) => !!v || 'Data de inceput este obligatorie']"
                  class="form-field"
                ></VueDatePicker>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12"
                ><label class="label-class">Data final</label>
                <VueDatePicker
                  required
                  v-model="formData.endTime"
                  :format="'dd/MM/yyyy - hh:mm'"
                  :rules="[(v) => !!v || 'Data de sfarsit este obligatorie']"
                  class="form-field"
                ></VueDatePicker>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="addBooking()"
          :disabled="!valid"
          >Save</v-btn
        >
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
      valid: false,
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
.label-class {
  font-size: 13px;
  color: grey;
}
.v-col-style {
  margin-bottom: -30px;
}
@media (max-width: 600px) {
  .form-field {
    width: 100%;
  }
}
</style>
