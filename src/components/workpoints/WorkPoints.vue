<template>
  <div class="bookings">
    <h1 class="mt-5 ml-3">Puncte de lucru</h1>
    <v-btn @click="modalIsOpen = true" color="primary" class="mr-3 mt-5"
      >Adauga punct de lucru</v-btn
    >
  </div>
  <v-table>
    <thead>
      <tr>
        <th
          v-for="column in tableColumns"
          :key="column.value"
          class="table-header"
        >
          {{ column.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="workPoint in this.workPoints" :key="workPoint.id">
        <td>{{ workPoint.name }}</td>

        <td>
          <v-icon @click="deleteWorkPoint(workPoint)" color="error"
            >mdi-delete</v-icon
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import PocketBase from "pocketbase";

export default {
  data() {
    return {
      modalIsOpen: false,
      editModalIsOpen: false,
      selectedId: "",
      selectedEmployeeName: "",
      workPoints: [],
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      tableColumns: [
        { text: "Email", value: "email" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  methods: {
    async getWorkPoints() {
      this.workPoints = await this.pb.collection("workPoints").getFullList({});
    },
    async deleteWorkPoint(user) {
      await this.pb.collection("users").delete(user.id);
      this.pb.collection("employees").update(user.employeeId, {
        hasAccessAccount: false,
      });
      this.getWorkPoints();
    },
    openEditModal(id, name) {
      this.editModalIsOpen = true;
      this.selectedId = id;
      this.selectedEmployeeName = name;
    },
    closeDialog() {
      this.modalIsOpen = false;
      this.getWorkPoints();
    },
    closeEditDialog() {
      this.editModalIsOpen = false;
      this.getWorkPoints();
    },
  },
  mounted() {
    this.getWorkPoints();
  },
};
</script>
<style scoped>
.table-header {
  font-weight: bold;
  color: #00ca98;
  background-color: #fafafa;
}
.bookings {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
