<template>
  <div class="bookings">
    <h1 class="mt-5 ml-3">Conturi de acces</h1>
    <v-btn @click="modalIsOpen = true" color="primary" class="mr-3 mt-5"
      >Adauga cont</v-btn
    >
  </div>
  <AddUser v-if="modalIsOpen" @close-and-refresh-empolyees="closeDialog()" />
  <v-table v-if="showTable">
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
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.email }}</td>
        <td>{{ getEmployeeName(user.employeeId) }}</td>
        <td>
          <v-icon @click="deleteUser(user)" color="error">mdi-delete</v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
<script>
import PocketBase from "pocketbase";
import AddUser from "./AddUser.vue";
export default {
  components: {
    AddUser,
  },
  data() {
    return {
      modalIsOpen: false,
      editModalIsOpen: false,
      selectedId: "",
      selectedEmployeeName: "",
      users: [],
      showTable: false,
      employees: [],
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
      tableColumns: [
        { text: "Email", value: "email" },
        { text: "Angajat asociat", value: "name" },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  methods: {
    async getUsers() {
      this.users = await this.pb.collection("users").getFullList({});
    },
    async getEmployees() {
      this.employees = await this.pb.collection("employees").getFullList({});
      this.showTable = true;
    },
    async deleteUser(user) {
      await this.pb.collection("users").delete(user.id);
      this.pb.collection("employees").update(user.employeeId, {
        hasAccessAccount: false,
      });
      this.getUsers();
    },
    openEditModal(id, name) {
      this.editModalIsOpen = true;
      this.selectedId = id;
      this.selectedEmployeeName = name;
    },
    closeDialog() {
      this.modalIsOpen = false;
      this.getUsers();
    },
    closeEditDialog() {
      this.editModalIsOpen = false;
      this.getUsers();
    },
    getEmployeeName(employeeId) {
      const employee = this.employees.find((emp) => emp.id === employeeId);
      return employee ? employee.name : "Unknown";
    },
  },
  mounted() {
    this.getEmployees();
    this.getUsers();
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
