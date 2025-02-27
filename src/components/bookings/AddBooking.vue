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
            <v-row v-if="this.canSeeAllBookings">
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
                  :rules="[(v) => !!v || 'Data este obligatorie']"
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
                  minutes-increment="15"
                  minutes-grid-increment="15"
                  auto-apply
                  v-model="formData.bookingRange"
                  :format="'HH:mm'"
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
          @click="addBooking()"
          :disabled="!valid || isLoading"
        >
          <template v-if="isLoading">
            <v-progress-circular
              indeterminate
              color="black"
              size="20"
            ></v-progress-circular>
          </template>
          <template v-else> Save </template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
const authData = localStorage["pocketbase_auth"];
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import PocketBase from "pocketbase";
import { format } from "date-fns";
export default {
  components: {
    VueDatePicker,
  },
  props: ["date"],
  data() {
    return {
      authData: authData ? JSON.parse(authData) : null,
      dialog: true,
      isLoading: false,
      valid: false,
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      employees: [],
      formData: {
        name: "",
        typeOfActivity: "",
        resourceId: "",
        bookingDate: this.date,
        bookingRange: [
          { hours: 8, minutes: 0 },
          { hours: 21, minutes: 0 },
        ],
      },
    };
  },
  computed: {
    canSeeAllBookings() {
      if (this.authData?.record.admin === true) {
        return true;
      }
      if (
        this.authData?.record.permissions
          .split(",")
          ?.includes("see_all_bookings")
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    formatBookingRange(range) {
      return range.map((time) => ({
        hours: String(time.hours).padStart(2, "0"),
        minutes: String(time.minutes).padStart(2, "0"),
      }));
    },
    async getEmployees() {
      const records = await this.pb.collection("employees").getFullList({});
      this.employees = records;
    },
    close() {
      this.$emit("close");
    },

    async addBooking() {
      this.isLoading = true;
      const resource = this.canSeeAllBookings
        ? this.formData.resourceId
        : this.authData?.record.id;
      try {
        const bookingDate = format(this.formData.bookingDate, "yyyy-MM-dd");
        const range = this.formatBookingRange(this.formData.bookingRange);
        const start = `${bookingDate} ${range[0].hours}:${range[0].minutes}:00`;
        const end = `${bookingDate} ${range[1].hours}:${range[1].minutes}:00`;
        const date = new Date(bookingDate);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const stylistBookings = await this.pb
          .collection("bookings")
          .getFullList({
            filter: `resourceId = '${resource}' && startTime >= '${startOfDay.toISOString()}' && startTime <= '${endOfDay.toISOString()}'`,
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
            this.isLoading = false;
            return;
          }
        }
        const booking = {
          name: this.formData.name,
          typeOfActivity: this.formData.typeOfActivity,
          resourceId: resource,
          resourceName: this.employees.find(
            (employee) => employee.id === resource
          ).name,
          workPoint: this.employees.find((employee) => employee.id === resource)
            .workPoint,
          workPointName: this.employees.find(
            (employee) => employee.id === resource
          ).workPointName,
          startTime: start,
          endTime: end,
        };
        await this.pb.collection("bookings").create(booking);
        this.close();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
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
