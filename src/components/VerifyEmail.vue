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

const pb = new PocketBase("https://your-pocketbase-url.com"); // Replace with your PocketBase URL
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const token = route.params.token; // Get token from URL
  if (!token) {
    return;
  }
  try {
    await pb.collection("users").confirmVerification(token);
    router.push("/login"); // Redirect user to login page
  } catch (error) {
    console.error("Verification failed:", error);
  }
});
</script>
