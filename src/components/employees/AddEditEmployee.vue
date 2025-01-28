<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <div class="d-flex justify-space-between">
        <v-card-title>
          {{ selectedEmployee ? "Editare" : "Adaugare" }} angajat
        </v-card-title>
        <v-icon @click="close()" class="mt-3 mr-3">mdi-close</v-icon>
      </div>
      <v-tabs v-model="tab">
        <v-tab value="one" @click="setCurrentTab(tab)">Date Angajat</v-tab>
        <v-tab
          value="two"
          :disabled="this.selectedEmployee === null"
          @click="setCurrentTab(tab)"
          >Cont de access</v-tab
        >
        <v-tab
          value="three"
          :disabled="this.selectedEmployee === null"
          @click="setCurrentTab(tab)"
          >Permisiuni</v-tab
        >
      </v-tabs>

      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one">
            <EmployeeDetails :employee="this.employeeData" />
          </v-tabs-window-item>
          <v-tabs-window-item value="two">
            <EmployeeAccessAccount :employee="this.employeeData" />
          </v-tabs-window-item>
          <v-tabs-window-item value="three">
            <EmployeePermissions :employee="this.employeeData" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import EmployeeDetails from "./EmployeeDetails.vue";
import EmployeePermissions from "./EmployeePermissions.vue";
import EmployeeAccessAccount from "./EmployeeAccessAccount.vue";
export default {
  props: ["selectedEmployee"],
  components: {
    EmployeeDetails,
    EmployeePermissions,
    EmployeeAccessAccount,
  },
  data() {
    return {
      employeeData: this.selectedEmployee,
      dialog: true,
      tab: "",
      workPoints: [],
      formData: {
        name: "",
        workPoint: "",
        workPointName: "",
      },
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    setCurrentTab(tab) {
      console.log(tab);
      this.tab = tab;
    },
  },
};
</script>
