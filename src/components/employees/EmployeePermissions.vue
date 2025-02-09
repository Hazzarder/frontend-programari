<template>
  <v-container>
    <div v-for="permission in permissions" :key="permission.key">
      <div>
        <v-checkbox
          class="checkbox_style"
          v-model="permission.checked"
          :label="permission.name"
        ></v-checkbox>
      </div>
    </div>
    <v-btn @click="addPermissionsToEmployee">Add Permissions</v-btn>
  </v-container>
</template>
<script>
import permissions from "@/assets/permissions.json";
import PocketBase from "pocketbase";
export default {
  props: ["employee"],
  data() {
    return {
      permissions: permissions,
      pb: new PocketBase("https://motzartiasi.pockethost.io"),
    };
  },
  methods: {
    addPermissionsToEmployee() {
      const selectedPermissions = this.permissions
        .filter((permission) => permission.checked)
        .map((permission) => permission.key);
      const permissionsString = selectedPermissions.join(",");
      this.pb
        .collection("employees")
        .update(this.employee.id, { permissions: permissionsString });
      this.pb
        .collection("users")
        .update(this.employee.id, { permissions: permissionsString });
    },
    setPermissionsFromBackend() {
      const backendPermissions = this.employee.permissions.split(",");
      this.permissions.forEach((permission) => {
        permission.checked = backendPermissions.includes(permission.key);
      });
    },
  },
  mounted() {
    console.log(this.employee);
    this.setPermissionsFromBackend();
  },
};
</script>
<style>
.checkbox_style {
  margin: -20px;
}
</style>
