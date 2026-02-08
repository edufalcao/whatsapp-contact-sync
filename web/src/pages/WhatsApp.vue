<script setup lang="ts">
import { ref, onMounted } from "vue";
import QrcodeVue from "qrcode.vue";
import { event } from "vue-gtag";
import { isbot } from "isbot";

import { EventType } from "../../../interfaces/api";
import { addHandler } from "../services/ws";

const qrData = ref("");
const qrColorBlack = "#e8e8ee";
const qrColorGray = "oklch(0.3 0.01 260)";
const waCon = ref(false);

function initWhatsApp() {
  fetch("/api/init_whatsapp", { credentials: "include" });
}

function onQR(data: string): void {
  if (!qrData.value) event("qr_loaded", { method: "Google" });
  qrData.value = data;
}

function onConnecting(): void {
  // Just in case the event is triggered multiple times
  if (!waCon.value) event("whatsapp_connecting", { method: "Google" });
  waCon.value = true;
}

onMounted(() => {
  addHandler(EventType.WhatsAppQR, onQR);
  addHandler(EventType.WhatsAppConnecting, onConnecting);
  // Make sure we don't load the QR code for bots (this uses resources on the server)
  if (!isbot(navigator.userAgent)) initWhatsApp();
});
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="max-w-lg w-full bg-base-100 rounded-2xl border border-white/[0.06] shadow-xl shadow-black/20 p-8">
      <h1 class="text-2xl font-semibold tracking-tight text-base-content">
        Authorize WhatsApp
      </h1>
      <p class="mt-2 text-sm text-base-content/60 leading-relaxed">
        Scan the QR code below with your WhatsApp app.
        <a href="https://faq.whatsapp.com/539218963354346/?locale=en_US">Need help?</a>
      </p>

      <div class="flex justify-center mt-6">
        <Transition name="fade" mode="out-in">
          <div
            v-if="!qrData"
            class="qr-placeholder inline-flex items-center justify-center w-72 h-72"
          >
            <span class="loading loading-spinner loading-lg text-primary/40"></span>
          </div>

          <div v-else class="relative">
            <qrcode-vue
              class="qr-code"
              :value="qrData"
              :size="288"
              :foreground="waCon ? qrColorGray : qrColorBlack"
              background="transparent"
            />
            <Transition name="fade">
              <div
                v-if="waCon"
                class="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-xl bg-base-100/80"
              >
                <div class="flex flex-col items-center gap-2">
                  <span class="loading loading-spinner loading-md text-primary"></span>
                  <span class="text-sm font-medium text-base-content/70">Connecting...</span>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>

      <p class="mt-4 text-xs text-base-content/40 text-center">
        Authorization may take a few seconds after scanning.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
