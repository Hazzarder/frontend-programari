<template>
  <div class="bookings">
    <h1 class="ml-3">Programari</h1>
    <v-btn class="ml-3 mt-2 mr-3" @click="openAddBookingModal()"
      >Adauga programare</v-btn
    >
    <AddBooking v-if="isModalOpen" @close="closeModal()" />
    <EditBooking
      v-if="isEditModalOpen"
      :event="selectedEvent"
      @close="closeEditModal()"
    />
  </div>
  <FullCalendar :options="calendarOptions" class="full-calendar mt-5" />
</template>

<script>
import AddBooking from "./AddBooking.vue";
import EditBooking from "./EditBooking.vue";
import PocketBase from "pocketbase";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  components: {
    AddBooking,
    EditBooking,
    FullCalendar,
  },
  data() {
    return {
      date: new Date(),
      bookings: [],
      resources: [],
      isModalOpen: false,
      isEditModalOpen: false,
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      calendarOptions: {
        initialView: "resourceTimeGridDay",
        plugins: [resourceTimeGridPlugin, interactionPlugin],
        resources: [],
        events: [],
        schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        slotMinTime: "08:00:00",
        slotMaxTime: "22:00:00",
        allDaySlot: false,
        eventClick: this.handleEventClick,
        datesSet: this.handleDatesSet,
        stickyHeaderDates: true,
        stickyFooterScrollbar: true,
        scrollTime: "00:00", // Ensure the calendar starts at the beginning of the day
        resourceAreaWidth: 600, // Set a fixed width for the resource columns
      },
    };
  },

  methods: {
    async getBookings(date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      const records = await this.pb.collection("bookings").getFullList({
        filter: `startTime >= '${startOfDay.toISOString()}' && startTime <= '${endOfDay.toISOString()}'`,
      });
      this.calendarOptions.events = records.map((record) => ({
        id: record.id,
        resourceId: record.resourceId,
        resId: record.resourceId,
        bookingId: record.id,
        title: record.name,
        typeOfActivity: record.typeOfActivity,
        start: record.startTime,
        end: record.endTime,
      }));
    },
    async getResources() {
      const records = await this.pb.collection("employees").getFullList({});

      this.calendarOptions.resources = records.map((record) => ({
        id: record.id,
        title: record.name,
      }));
    },
    handleDatesSet(info) {
      this.date = info.start;
      this.getBookings(this.date);
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
    this.getResources();
  },
};
</script>
<style scoped>
.full-calendar {
  height: 600px; /* Default height for larger screens */
}
.bookings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 600px) {
}
</style>
