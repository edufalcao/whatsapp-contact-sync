<script setup lang="ts">
import { ref, onMounted } from "vue";
import { event } from "vue-gtag";

import { isWsReady } from "../services/ws";
import { SessionStatus } from "../../../interfaces/api";

const sessionStatus = ref<SessionStatus | undefined>(undefined);
const wsReady = ref(false);

onMounted(() => {
  isWsReady.then((val) => {
    wsReady.value = val;
  });
  fetch("/api/status", { credentials: "include" }).then((res) => {
    res.json().then((data) => {
      sessionStatus.value = data;
    });
  });

  event(`host_${window.location.host}`, { method: "Google" });
});
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="max-w-lg text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-base-100 border border-white/[0.06] shadow-xl shadow-black/20 mb-6 transition-shadow duration-300 hover:shadow-primary/20">
        <img class="h-10 w-10" src="/logo.png" alt="Logo" />
      </div>

      <h1 class="text-4xl font-bold tracking-tight gradient-text">
        PicSync
      </h1>

      <p class="mt-3 text-sm text-base-content/60 leading-relaxed max-w-sm mx-auto">
        Sync your contact photos from WhatsApp to Google Contacts.
        Authorize both accounts and let the app do the rest.
      </p>

      <div class="flex items-center justify-center gap-6 mt-6 text-xs text-base-content/40">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-base-100 border border-white/[0.06] flex items-center justify-center transition-colors duration-200 hover:border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          Secure
        </div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-base-100 border border-white/[0.06] flex items-center justify-center transition-colors duration-200 hover:border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          Open Source
        </div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-base-100 border border-white/[0.06] flex items-center justify-center transition-colors duration-200 hover:border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          ~2 min
        </div>
      </div>

      <router-link
        to="/contribute"
        class="btn btn-primary btn-lg btn-wide mt-8 gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow duration-300"
        :class="{ 'btn-disabled': !wsReady }"
      >
        {{
          sessionStatus?.whatsappConnected || sessionStatus?.googleConnected
            ? "Continue"
            : "Get Started"
        }}
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
