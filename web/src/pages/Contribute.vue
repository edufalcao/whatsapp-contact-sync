<script lang="ts">
import { defineComponent } from "vue";
import { event } from "vue-gtag";

export default defineComponent({
  data: () => ({
    email: "",
    checkingPurchase: false,
    defaultError: "Failed to verify purchase.",
    waValidationError: "Purchase is valid for a single WhatsApp device only.",
    errorMessage: null as string | null,
  }),

  mounted() {
    if (this.$route.query.show_error) {
      this.errorMessage = this.waValidationError;
      event("contribution_error_shown", { method: "Google" });
    }
  },

  methods: {
    coffeeClicked() {
      this.errorMessage = null;
      event("contribution_wa_validation_failed", { method: "Google" });
    },

    checkPurchase() {
      if (!this.email) return;
      this.checkingPurchase = true;

      fetch("/api/check_purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.purchased) {
            this.$router.push("/whatsapp");
          } else {
            this.errorMessage = this.defaultError;
            this.checkingPurchase = false;
            event("contribution_validation_failed", { method: "Google" });
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
        Servers Are Expensive
      </h1>
      <p class="mt-2 text-sm text-base-content/60 leading-relaxed">
        To use <a href="/">PicSync</a>, you'll need to help pay for the
        servers. Each contribution gives you
        <strong class="text-base-content/80">a month of access for a single WhatsApp device</strong>.
        The project is open source &mdash;
        you can always run it locally if you prefer.
      </p>

      <div class="mt-6 space-y-5">
        <!-- Step 1 -->
        <div class="flex gap-3">
          <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">1</div>
          <div>
            <div class="text-sm font-medium text-base-content mb-2">Contribute ($1)</div>
            <div @click="coffeeClicked">
              <button class="btn btn-sm btn-outline">
                Contribute
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex gap-3">
          <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">2</div>
          <div class="flex-1">
            <div class="text-sm font-medium text-base-content mb-2">Enter your email</div>
            <label class="input input-sm input-bordered flex items-center gap-2 w-full max-w-xs">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-50">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <input
                v-model="email"
                v-on:input="errorMessage = null"
                type="text"
                class="grow"
                placeholder="Email"
              />
            </label>
          </div>
        </div>

        <!-- Error message -->
        <Transition name="slide-up">
          <div
            v-if="errorMessage"
            class="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-error/10 border border-error/20 text-sm text-error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <!-- Step 3 -->
        <div class="flex gap-3">
          <div class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">3</div>
          <div class="flex-1">
            <button
              @click="checkPurchase()"
              @keydown.enter="checkPurchase()"
              class="btn btn-primary btn-sm"
              :disabled="!email || checkingPurchase"
            >
              <span v-if="checkingPurchase" class="loading loading-spinner loading-xs"></span>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
