<template>
  <div class="bookings">
    <h1 class="mt-5 ml-3">Angajati</h1>
    <v-btn @click="modalIsOpen = true" color="primary" class="mr-3 mt-5"
      >Adauga angajat</v-btn
    >
  </div>
  <AddEditEmployee
    v-if="modalIsOpen"
    @close-and-refresh-empolyees="closeDialog()"
  />
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
      <tr v-for="employee in employees" :key="employee.id">
        <td>{{ employee.name }}</td>
        <td>{{ employee.hasAccessAccount ? "Da" : "Nu" }}</td>
        <td>{{ getWorkPointName(employee.workPoint) }}</td>
        <td>
          <v-icon @click="deleteEmployee(employee.id)" color="error"
            >mdi-delete</v-icon
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import PocketBase from "pocketbase";
import AddEditEmployee from "./AddEditEmployee.vue";
export default {
  components: {
    AddEditEmployee,
  },
  data() {
    return {
      modalIsOpen: false,
      editModalIsOpen: false,
      selectedId: "",
      selectedEmployeeName: "",
      workPoints: [],
      employees: [],
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      tableColumns: [
        { text: "Name", value: "name" },
        { text: "Cont acces", value: "accessAccount" },
        { text: "Punct de lucru", value: "workPoint" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  methods: {
    async getEmployees() {
      this.employees = await this.pb.collection("employees").getFullList({});
    },
    async deleteEmployee(id) {
      await this.pb.collection("employees").delete(id);
      this.getEmployees();
    },
    async getWorkPoints() {
      this.workPoints = await this.pb.collection("workPoints").getFullList({});
    },
    getWorkPointName(id) {
      const workPoint = this.workPoints.find((wp) => wp.id === id);
      return workPoint ? workPoint.name : "N/A";
    },
    openEditModal(id, name) {
      this.editModalIsOpen = true;
      this.selectedId = id;
      this.selectedEmployeeName = name;
    },
    closeDialog() {
      this.modalIsOpen = false;
      this.getEmployees();
    },
    closeEditDialog() {
      this.editModalIsOpen = false;
      this.getEmployees();
    },
  },
  mounted() {
    this.getWorkPoints();
    this.getEmployees();
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
