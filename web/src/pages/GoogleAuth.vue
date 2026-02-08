<script lang="ts">
// @ts-nocheck
// This is indeed a bad solution, but the Google imports just don't play nice with Typesciprt...
import { defineComponent } from "vue";
import { event } from "vue-gtag";

export default defineComponent({
  data: () => ({
    CLIENT_ID: "",
    API_KEY: "",
    gisLoaded: false,
    gapiLoaded: false,
    configLoaded: false,
    tokenClient: undefined as any, // Another Google typing workaround
  }),
  mounted() {
    this.loadConfig();
    this.addJSSrc("https://accounts.google.com/gsi/client", () => { this.gisLoaded = true; this.tryInit(); });
    this.addJSSrc("https://apis.google.com/js/api.js", () => { this.gapiLoaded = true; this.tryInit(); });
  },
  methods: {
    // Most code here is based on https://developers.google.com/people/quickstart/js
    async loadConfig() {
      const res = await fetch("/api/config", { credentials: "include" });
      const data = await res.json();
      this.CLIENT_ID = data.clientId;
      this.API_KEY = data.apiKey;
      this.configLoaded = true;
      this.tryInit();
    },
    tryInit() {
      if (this.configLoaded && this.gisLoaded) this.initGis();
      if (this.configLoaded && this.gapiLoaded) this.initGapi();
    },
    addJSSrc(url: string, onLoad: () => void = () => {}) {
      const authScriptElement = document.createElement("script");
      authScriptElement.src = url;
      if (onLoad) {
        authScriptElement.onload = onLoad;
      }
      authScriptElement.setAttribute("async", "");
      authScriptElement.setAttribute("defer", "");
      document.head.appendChild(authScriptElement);
    },
    initGis() {
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: "https://www.googleapis.com/auth/contacts",
        callback: this.onSignIn,
      });
    },
    initGapi() {
      gapi.load("client", this.initGapiClient);
    },
    async initGapiClient() {
      await gapi.client.init({
        apiKey: this.API_KEY,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/people/v1/rest",
        ],
      });
    },
    handleAuthClick() {
      // if (!this.tokenClient) return;
      this.tokenClient.requestAccessToken({ prompt: "consent" });
    },
    async onSignIn(resp: any) {
      if (resp.error !== undefined) {
        throw resp;
      }
      event("google_authorized", { method: "Google" });
      const token = gapi.client.getToken();
      fetch("/api/init_gapi", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ token: token }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          const url = new URL(res.url);
          this.$router.push(url.pathname);
        } else {
          throw res;
        }
      });
    },
  },
});
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="max-w-lg w-full bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
      <h1 class="text-2xl font-semibold tracking-tight text-base-content">
        Authorize Google
      </h1>
      <p class="mt-2 text-sm text-base-content/60 leading-relaxed">
        Connect your Google account to allow syncing contact photos.
        We only request access to your contacts.
      </p>
      <div class="mt-6">
        <button
          @click="handleAuthClick"
          :disabled="!configLoaded || !gapiLoaded || !gisLoaded"
          id="signin-button"
          class="btn btn-outline border-base-300 gap-3 w-full"
        >
          <img class="w-5" alt="Google login" src="/google_logo.svg" />
          Sign in with Google
        </button>
      </div>
      <p class="mt-4 text-xs text-base-content/40 text-center">
        Your credentials are never stored on our servers.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
