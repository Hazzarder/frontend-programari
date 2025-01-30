<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="formData.name"
          label="Nume"
          variant="outlined"
        ></v-text-field>
      </v-col> </v-row
    ><v-row>
      <v-col cols="12">
        <v-select
          v-model="formData.workPoint"
          :items="workPoints"
          item-title="name"
          item-value="id"
          label="Punct de lucru"
          variant="outlined"
        >
        </v-select
      ></v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="addEmployee()"
          >{{ this.employee !== null ? "Editeaza" : "Adauga" }} angajat</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import PocketBase from "pocketbase";
export default {
  props: ["employee"],
  data() {
    return {
      employeeData: this.employee ? { ...this.employee } : {},
      formData: {
        name: "",
        workPoint: "",
        workPointName: "",
      },
      workPoints: [],
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    async getWorkPoints() {
      this.workPoints = await this.pb.collection("workPoints").getFullList({});
    },
    async addEmployee() {
      if (this.employee !== null) {
        await this.pb
          .collection("employees")
          .update(this.employee.id, this.formData);
      } else {
        this.formData.workPointName = this.workPoints.find(
          (wp) => wp.id === this.formData.workPoint
        ).name;
        await this.pb
          .collection("employees")
          .create(this.formData)
          .then(() => {
            this.close();
          });
      }
    },
    close() {
      this.$emit("close");
    },
  },
  mounted() {
    if (this.employee) {
      this.formData = { ...this.employee };
    }
    this.getWorkPoints();
  },
};
</script>
