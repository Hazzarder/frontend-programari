<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title> Adauga angajat nou </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.name"
                label="Name"
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
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="addEmployee()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import PocketBase from "pocketbase";
export default {
  data() {
    return {
      dialog: true,
      workPoints: [],
      formData: {
        name: "",
        workPoint: "",
        workPointName: "",
      },
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    async getWorkPoints() {
      this.workPoints = await this.pb.collection("workPoints").getFullList({});
    },
    async addEmployee() {
      this.formData.workPointName = this.workPoints.find(
        (wp) => wp.id === this.formData.workPoint
      ).name;
      await this.pb
        .collection("employees")
        .create(this.formData)
        .then(() => {
          this.close();
        });
    },

    close() {
      this.$emit("close-and-refresh-empolyees");
    },
    async save() {
      this.$emit("close-and-refresh-empolyees");
    },
  },
  mounted() {
    this.getWorkPoints();
  },
};
</script>
