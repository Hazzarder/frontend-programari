<template>
  <div class="bookings">
    <h1 class="ml-3">Programari</h1>
    <v-btn class="mt-2 mr-6 btnn" @click="openAddBookingModal()"
      >Adauga programare</v-btn
    >
    <AddBooking v-if="isModalOpen" @close="closeModal()" :date="this.date" />
    <EditBooking
      v-if="isEditModalOpen"
      :event="selectedEvent"
      @close="closeEditModal()"
    />
  </div>
  <v-row class="mt-1 filters">
    <v-col cols="5">
      <v-btn
        @click="this.previousDate()"
        class="mdi mdi-arrow-left ml-3"
      ></v-btn>
      <v-btn
        @click="this.forwardDate()"
        class="mdi mdi-arrow-right ml-1"
      ></v-btn>
    </v-col>
    <v-col cols="6">
      <VueDatePicker
        required
        :enable-time-picker="false"
        v-model="date"
        :format="'dd/MM/yyyy'"
        class="ml-3"
        auto-apply
        @update:model-value="this.getBookings(this.date)"
      ></VueDatePicker>
    </v-col>
  </v-row>

  <FullCalendar
    ref="fullCalendar"
    v-if="this.canSeeAllBookings"
    :options="calendarOptions"
    class="full-calendar mt-5"
  />
  <FullCalendar
    ref="fullCalendar"
    v-if="!this.canSeeAllBookings"
    :options="employeeCalendarOptions"
    class="full-calendar mt-5"
  />
</template>

<script>
const authData = localStorage["pocketbase_auth"];
import AddBooking from "./AddBooking.vue";
import EditBooking from "./EditBooking.vue";
import PocketBase from "pocketbase";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  components: {
    AddBooking,
    EditBooking,
    FullCalendar,
    VueDatePicker,
  },
  data() {
    return {
      authData: authData ? JSON.parse(authData) : null,
      date: new Date(),
      bookings: [],
      resources: [],
      isModalOpen: false,
      isEditModalOpen: false,
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      calendarOptions: {
        headerToolbar: {
          left: "",
          center: "",
          right: "",
        },
        expandRows: true,
        initialView: "resourceTimelineDay",
        plugins: [resourceTimelinePlugin, interactionPlugin],
        resources: [],
        events: [],
        resourceGroupField: "workPointName",
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        slotMinTime: "08:00:00",
        slotMaxTime: "22:00:00",
        eventClick: this.handleEventClick,
        slotMinWidth: 40,
        eventMinHeight: 150,
        eventContent: function (arg) {
          return {
            html: `<div class="custom-event-content">
              <p><strong>${arg.event.title}</strong></p>
              <p>${arg.event.extendedProps.typeOfActivity}</p>
              <p>${arg.event.start.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })} - ${arg.event.end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}</p>
            </div>`,
          };
        },
      },
      employeeCalendarOptions: {
        initialView: "resourceTimeGridDay",
        contentHeight: "auto",
        height: "100",
        plugins: [resourceTimeGridPlugin, interactionPlugin],
        resources: [],
        events: [],
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        headerToolbar: {
          left: "",
          center: "",
          right: "",
        },
        slotMinTime: "08:00:00",
        slotMaxTime: "22:00:00",
        allDaySlot: false,
        eventClick: this.handleEventClick,
        eventContent: function (arg) {
          return {
            html: `<div class="custom-event-content">
              <p><strong>${arg.event.title}</strong> ${
              arg.event.extendedProps.typeOfActivity
            } ${arg.event.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })} - ${arg.event.end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}</p>
            </div>`,
          };
        },
      },
    };
  },
  computed: {
    userPermissions() {
      return this.authData?.record.permissions.split(",");
    },
    canSeeAllBookings() {
      if (this.authData?.record.admin === true) {
        return true;
      } else {
        return this.userPermissions?.includes("see_all_bookings");
      }
    },
  },
  methods: {
    async getBookings(date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      if (!this.canSeeAllBookings) {
        const records = await this.pb.collection("bookings").getFullList({
          filter: `startTime >= '${startOfDay.toISOString()}' && startTime <= '${endOfDay.toISOString()}' && resourceId = '${
            this.authData?.record.id
          }'`,
        });
        this.employeeCalendarOptions.resources = [
          {
            id: this.authData?.record.id,
            title: records[0]?.resourceName
              ? "Programari "
              : "Nu ai programari ",
          },
        ];
        this.employeeCalendarOptions.events = records.map((record) => {
          const startTime = new Date(record.startTime);
          const endTime = new Date(record.endTime);

          startTime.setHours(startTime.getHours() - 2);
          endTime.setHours(endTime.getHours() - 2);

          return {
            id: record.id,
            resourceId: record.resourceId,
            resId: record.resourceId,
            bookingId: record.id,
            title: record.name,
            typeOfActivity: record.typeOfActivity,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          };
        });
      } else {
        const records = await this.pb.collection("bookings").getFullList({
          filter: `startTime >= '${startOfDay.toISOString()}' && startTime <= '${endOfDay.toISOString()}'`,
        });
        const uniqueResources = new Set();
        records.forEach((record) =>
          uniqueResources.add({
            id: record.resourceId,
            title: record.resourceName,
            workPointName: record.workPointName,
          })
        );
        this.calendarOptions.resources = Array.from(uniqueResources).map(
          (resource) => ({
            id: resource.id,
            title: resource.title,
            workPointName: resource.workPointName,
          })
        );

        this.calendarOptions.events = records.map((record) => {
          const startTime = new Date(record.startTime);
          const endTime = new Date(record.endTime);

          startTime.setHours(startTime.getHours() - 2);
          endTime.setHours(endTime.getHours() - 2);

          return {
            id: record.id,
            resourceId: record.resourceId,
            resId: record.resourceId,
            bookingId: record.id,
            title: record.name,
            typeOfActivity: record.typeOfActivity,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          };
        });
      }
    },
    forwardDate() {
      this.date = new Date(this.date.setDate(this.date.getDate() + 1));
      this.getBookings(this.date);
      this.$refs.fullCalendar.getApi().gotoDate(this.date);
    },
    previousDate() {
      this.date = new Date(this.date.setDate(this.date.getDate() - 1));
      this.getBookings(this.date);
      this.$refs.fullCalendar.getApi().gotoDate(this.date);
    },
    openAddBookingModal() {
      this.isModalOpen = true;
    },
    handleEventClick(info) {
      this.selectedEvent = info.event;
      this.isEditModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.getBookings(this.date);
    },
    closeEditModal() {
      this.isEditModalOpen = false;
      this.getBookings(this.date);
    },
  },
  mounted() {
    this.getBookings(this.date);
  },
};
</script>
<style scoped>
.full-calendar {
  height: 600px;
}
.btnn {
  width: 12rem;
}
.filters {
  margin-bottom: -40px;
}
.bookings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-event-content {
  padding: 5px;
  white-space: normal;
  word-wrap: break-word;
}
@media screen and (min-width: 600px) {
  .full-calendar {
    height: 700px;
  }
}
</style>
