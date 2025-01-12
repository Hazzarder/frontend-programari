<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title>Editeaza programare</v-card-title>
      <v-btn color="error" @click="deleteBooking()">Sterge Programare</v-btn>
      <v-card-text>
        <v-form>
          <v-row
            ><v-col
              ><v-text-field
                v-model="formData.name"
                label="Name"
                variant="outlined"
              ></v-text-field></v-col
          ></v-row>
          <v-row
            ><v-col
              ><v-text-field
                v-model="formData.typeOfActivity"
                label="Type of Activity"
                variant="outlined"
              ></v-text-field></v-col
          ></v-row>
          <v-row
            ><v-col
              ><v-select
                v-model="formData.resourceId"
                :items="employees"
                item-title="name"
                item-value="id"
                label="Resource"
                variant="outlined"
              ></v-select></v-col
          ></v-row>
          <v-row
            ><v-col
              ><VueDatePicker
                v-model="formData.startTime"
                :format="'dd/MM/yyyy - hh:mm'"
              ></VueDatePicker></v-col
          ></v-row>
          <v-row
            ><v-col
              ><VueDatePicker
                v-model="formData.endTime"
                :format="'dd/MM/yyyy - hh:mm'"
              ></VueDatePicker></v-col
          ></v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="save">Save</v-btn>
        <v-btn @click="close">Cancel</v-btn>
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
      employees: [],
      formData: {
        name: "",
        resourceId: "",
        typeOfActivity: "",
        startTime: null,
        endTime: null,
      },
      pb: new PocketBase("http://127.0.0.1:8090"),
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
            startTime: newVal.start,
            endTime: newVal.end,
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
