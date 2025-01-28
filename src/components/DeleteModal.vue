<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text>{{ this.text }}</v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog('no')">Anulare</v-btn>
        <v-btn color="red" @click="closeDialog('yes')">Sterge</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "DeleteModal",
  props: ["text"],
  data() {
    return {
      dialog: true,
    };
  },
  methods: {
    closeDialog(answer) {
      if (answer === "yes") {
        this.$emit("yes");
      } else {
        this.$emit("no");
      }
    },
  },
};
</script>
