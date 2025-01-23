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
                  v-model="formData.bookingRange"
                  :format="'hh:mm'"
                  :rules="[(v) => !!v || 'Data de inceput este obligatorie']"
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
import { format } from "date-fns";
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
        bookingDate: new Date(),
        bookingRange: [new Date(), new Date()],
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

    async addBooking() {
      const bookingDate = format(this.formData.bookingDate, "yyyy-MM-dd");
      const start = `${bookingDate} ${this.formData.bookingRange[0].hours}:${this.formData.bookingRange[0].minutes}:00`;
      const end = `${bookingDate} ${this.formData.bookingRange[1].hours}:${this.formData.bookingRange[1].minutes}:00`;
      const date = new Date(bookingDate);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const stylistBookings = await this.pb.collection("bookings").getFullList({
        filter: `resourceId = '${
          this.formData.resourceId
        }' && startTime >= '${startOfDay.toISOString()}' && startTime <= '${endOfDay.toISOString()}'`,
      });

      const newBookingStartTime = new Date(start).getTime();
      const newBookingEndTime = new Date(end).getTime();

      for (const booking of stylistBookings) {
        const bookingStart = new Date(booking.startTime).getTime() - 7200000;
        const bookingEnd = new Date(booking.endTime).getTime() - 7200000;

        if (
          newBookingStartTime < bookingEnd &&
          newBookingEndTime > bookingStart
        ) {
          alert("Stilistul este ocupat in aceasta perioada");
          return;
        }
      }
      const booking = {
        name: this.formData.name,
        typeOfActivity: this.formData.typeOfActivity,
        resourceId: this.formData.resourceId,
        resourceName: this.employees.find(
          (employee) => employee.id === this.formData.resourceId
        ).name,
        workPoint: this.employees.find(
          (employee) => employee.id === this.formData.resourceId
        ).workPoint,
        workPointName: this.employees.find(
          (employee) => employee.id === this.formData.resourceId
        ).workPointName,
        startTime: start,
        endTime: end,
      };

      await this.pb.collection("bookings").create(booking);
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
