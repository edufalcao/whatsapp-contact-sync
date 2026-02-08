<script lang="ts">
import { defineComponent } from "vue";
import QrcodeVue from "qrcode.vue";
import { event } from "vue-gtag";
import { isbot } from "isbot";

import { EventType } from "../../../interfaces/api";
import { addHandler } from "../services/ws";

export default defineComponent({
  data: () => ({
    qrData: "",
    qrColorBlack: "#000000",
    qrColorGray: "oklch(0.961151 0 0)",
    waCon: false,
  }),
  mounted() {
    addHandler(EventType.WhatsAppQR, this.onQR);
    addHandler(EventType.WhatsAppConnecting, this.onConnecting);
    // Make sure we don't load the QR code for bots (this uses resources on the server)
    if (!isbot(navigator.userAgent)) this.initWhatsApp();
  },
  methods: {
    async initWhatsApp() {
      fetch("/api/init_whatsapp", { credentials: "include" });
    },
    onQR(data: string): void {
      if (!this.qrData) event("qr_loaded", { method: "Google" });
      this.qrData = data;
    },
    onConnecting(): void {
      // Just in case the event is triggered multiple times
      if (!this.waCon) event("whatsapp_connecting", { method: "Google" });
      this.waCon = true;
    },
  },
  components: {
    QrcodeVue,
  },
});
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="max-w-lg w-full bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
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
            <span class="loading loading-spinner loading-lg text-base-content/30"></span>
          </div>

          <div v-else class="relative">
            <qrcode-vue
              class="qr-code"
              :value="qrData"
              :size="288"
              :foreground="waCon ? qrColorGray : qrColorBlack"
            />
            <Transition name="fade">
              <div
                v-if="waCon"
                class="absolute inset-0 flex items-center justify-center rounded-xl backdrop-blur-sm bg-base-100/60"
              >
                <div class="flex flex-col items-center gap-2">
                  <span class="loading loading-spinner loading-md"></span>
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
