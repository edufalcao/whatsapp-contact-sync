<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { EventType } from "../../interfaces/api";
import { addHandler } from "./services/ws";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

const router = useRouter();

onMounted(() => {
  addHandler(EventType.Redirect, (url: string) => {
    router.push(url);
  });
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-200">
    <Header />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <Footer />
  </div>
</template>

<style scoped></style>
