<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title class="text-center">Editeaza programare</v-card-title>
      <v-btn color="error" @click="deleteBooking()">Sterge Programare</v-btn>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col class="v-col-style">
              <label class="label-class">Nume client</label
              ><v-text-field
                variant="outlined"
                v-model="formData.name"
                :rules="[(v) => !!v || 'Name is required']"
                required
              ></v-text-field> </v-col
          ></v-row>
          <v-row>
            <v-col class="v-col-style">
              <label class="label-class">Serviciu</label>
              <v-text-field
                variant="outlined"
                v-model="formData.typeOfActivity"
                :rules="[(v) => !!v || 'Type of Activity is required']"
                required
              ></v-text-field> </v-col
          ></v-row>
          <v-row>
            <v-col class="v-col-style">
              <label class="label-class">Stilist</label
              ><v-select
                variant="outlined"
                v-model="formData.resourceId"
                :items="employees"
                item-title="name"
                item-value="id"
                :rules="[(v) => !!v || 'Resource is required']"
                required
              ></v-select> </v-col
          ></v-row>
          <v-row>
            <v-col cols="12"
              ><label class="label-class">Data programare</label>
              <VueDatePicker
                required
                :enable-time-picker="false"
                v-model="formData.bookingDate"
                :format="'dd/MM/yyyy'"
                :rules="[(v) => !!v || 'Data de inceput este obligatorie']"
                class="form-field"
              ></VueDatePicker>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12"
              ><label class="label-class">Ora programare</label>
              <VueDatePicker
                required
                time-picker
                range
                :min-time="{ hours: 7 }"
                :max-time="{ hours: 22 }"
                v-model="formData.bookingRange"
                :format="'hh:mm'"
                :rules="[(v) => !!v || 'Data de inceput este obligatorie']"
                class="form-field"
              ></VueDatePicker>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" @click="save" :disabled="!valid"
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
  props: {
    event: Object,
  },
  data() {
    return {
      isOpen: true,
      valid: false,
      employees: [],
      formData: {
        name: "",
        resourceId: "",
        typeOfActivity: "",
        bookingDate: new Date(),
        bookingRange: [new Date(), new Date()],
      },
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  watch: {
    event: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            id: newVal.extendedProps.bookingId,
            name: newVal.title,
            typeOfActivity: newVal.extendedProps.typeOfActivity,
            bookingRange: [new Date(newVal.start), new Date(newVal.end)],
            bookingDate: new Date(newVal.start).format("yyyy-MM-dd"),
            resourceId: newVal.extendedProps.resId,
          };
          this.isOpen = true;
        }
      },
    },
  },
  methods: {
    async deleteBooking() {
      await this.pb.collection("bookings").delete(this.formData.id);
      this.$emit("close");
    },
    async save() {
      await this.pb
        .collection("bookings")
        .update(this.formData.id, this.formData);
      this.$emit("close");
    },
    async getEmployees() {
      const records = await this.pb.collection("employees").getFullList({});
      this.employees = records;
    },
    close() {
      this.$emit("close");
    },
  },
  mounted() {
    this.getEmployees();
  },
};
</script>
<style>
.label-class {
  font-size: 13px;
  color: grey;
}
.v-col-style {
  margin-bottom: -30px;
}
</style>
