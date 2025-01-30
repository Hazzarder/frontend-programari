<template>
  <v-container>
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
    <p>Verifying your email...</p>
  </v-container>
</template>
<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PocketBase from "pocketbase";
import { useSnackbar } from "vuetify";

const pb = new PocketBase("https://your-pocketbase-url.com"); // Replace with your PocketBase URL
const route = useRoute();
const router = useRouter();
const snackbar = useSnackbar();

onMounted(async () => {
  const token = route.params.token; // Get token from URL
  if (!token) {
    snackbar.add({ text: "Invalid verification link.", color: "error" });
    return;
  }

  try {
    await pb.collection("users").confirmVerification(token);
    snackbar.add({ text: "Email verified successfully!", color: "success" });
    router.push("/login"); // Redirect user to login page
  } catch (error) {
    console.error("Verification failed:", error);
    snackbar.add({
      text: "Verification failed. The link may be expired or invalid.",
      color: "error",
    });
  }
});
</script>
