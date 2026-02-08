<script lang="ts">
import { defineComponent } from "vue";
import { event } from "vue-gtag";

import { isWsReady } from "../services/ws";
import { SessionStatus } from "../../../interfaces/api";

export default defineComponent({
  data: () => ({
    sessionStatus: undefined as SessionStatus | undefined,
    wsReady: false,
  }),
  mounted() {
    isWsReady.then((val) => {
      this.wsReady = val;
    });
    fetch("/api/status", { credentials: "include" }).then((res) => {
      res.json().then((data) => {
        this.sessionStatus = data;
      });
    });

    event(`host_${window.location.host}`, { method: "Google" });
  },
  methods: {},
});
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="max-w-lg text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-base-100 shadow-sm border border-base-300 mb-6">
        <img class="h-9 w-9" src="/logo.png" alt="Logo" />
      </div>

      <h1 class="text-2xl font-semibold tracking-tight text-base-content">
        PicSync
      </h1>

      <p class="mt-3 text-sm text-base-content/60 leading-relaxed max-w-sm mx-auto">
        Sync your contact photos from WhatsApp to Google Contacts.
        Authorize both accounts and let the app do the rest.
      </p>

      <div class="flex items-center justify-center gap-6 mt-6 text-xs text-base-content/40">
        <div class="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure
        </div>
        <div class="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          </svg>
          Open Source
        </div>
        <div class="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ~2 min
        </div>
      </div>

      <router-link
        to="/contribute"
        class="btn btn-primary btn-wide mt-8 gap-2"
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
