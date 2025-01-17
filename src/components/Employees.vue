<template>
  <h1 class="mt-5 ml-3">Angajati</h1>
  <v-btn @click="modalIsOpen = true" color="primary">Adauga angajat</v-btn>
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
      employees: [],
      pb: new PocketBase("https://motzartiasi.pockethost.io/"),
      tableColumns: [
        { text: "Name", value: "name" },
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
    closeDialog() {
      this.modalIsOpen = false;
      this.getEmployees();
    },
  },
  mounted() {
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
</style>
