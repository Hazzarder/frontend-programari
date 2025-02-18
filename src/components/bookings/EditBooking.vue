<template>
  <v-dialog v-model="isOpen" max-width="600px">
    <v-card>
      <v-card-title class="text-center">Editeaza programare</v-card-title>
      <v-btn color="error" @click="deleteBooking()">Sterge Programare</v-btn>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col class="v-col-style">
              <label class="label-class">Nume client</label>
              <v-text-field
                variant="outlined"
                v-model="formData.name"
                :rules="[(v) => !!v || 'Name is required']"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="v-col-style">
              <label class="label-class">Serviciu</label>
              <v-text-field
                variant="outlined"
                v-model="formData.typeOfActivity"
                :rules="[(v) => !!v || 'Type of Activity is required']"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="this.canSeeAllBookings">
            <v-col class="v-col-style">
              <label class="label-class">Stilist</label>
              <v-select
                variant="outlined"
                v-model="formData.resourceId"
                :items="employees"
                item-title="name"
                item-value="id"
                :rules="[(v) => !!v || 'Resource is required']"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label class="label-class">Data programare</label>
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
            <v-col cols="12">
              <label class="label-class">Ora programare</label>
              <VueDatePicker
                required
                time-picker
                range
                auto-apply
                v-model="formData.bookingRange"
                :format="'HH:mm'"
                class="form-field"
              ></VueDatePicker>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" @click="close">Cancel</v-btn>
        <v-btn
          color="blue darken-1"
          @click="save"
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
  props: {
    event: Object,
  },
  data() {
    return {
      authData: authData ? JSON.parse(authData) : null,
      isOpen: true,
      valid: false,
      isLoading: false,
      employees: [],
      formData: {
        name: "",
        resourceId: "",
        typeOfActivity: "",
        bookingDate: "",
        bookingRange: [{}, {}],
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
            bookingDate: newVal.start,
            resourceId: newVal.extendedProps.resId,
            bookingRange: [
              {
                hours: newVal.start.getHours(),
                minutes: newVal.start.getMinutes(),
                seconds: newVal.start.getSeconds(),
              },
              {
                hours: newVal.end.getHours(),
                minutes: newVal.end.getMinutes(),
                seconds: newVal.end.getSeconds(),
              },
            ],
          };
          this.isOpen = true;
        }
      },
    },
  },
  methods: {
    formatBookingRange(range) {
      return range.map((time) => ({
        hours: String(time.hours).padStart(2, "0"),
        minutes: String(time.minutes).padStart(2, "0"),
      }));
    },
    async deleteBooking() {
      await this.pb.collection("bookings").delete(this.formData.id);
      this.$emit("close");
    },

    async save() {
      this.isLoading = true;
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
            filter: `resourceId = '${
              this.formData.resourceId
            }' && startTime >= '${startOfDay.toISOString()}' && startTime <= '${endOfDay.toISOString()}' && id != '${
              this.formData.id
            }'`,
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

        await this.pb.collection("bookings").update(this.formData.id, booking);
        this.$emit("close");
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getEmployees() {
      const records = await this.pb.collection("employees").getFullList({});
      this.employees = records;
    },
    close() {
      this.$emit("close");
    },
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
</style>
