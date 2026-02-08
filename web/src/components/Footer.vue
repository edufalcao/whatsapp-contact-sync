<script lang="ts">
import { defineComponent } from "vue";
import { enforcePayments } from "../settings";

const steps = ["/contribute", "/whatsapp", "/gauth", "/options", "/sync"];

export default defineComponent({
  data: () => ({
    showSteps: false,
    showContribute: false,
    currentStep: 0,
  }),

  mounted() {
    enforcePayments.then((val) => {
      this.showContribute = val;
    });
  },

  computed: {
    stepLabels(): string[] {
      const labels = [];
      if (this.showContribute) labels.push("Contribute");
      labels.push("WhatsApp", "Google", "Sync");
      return labels;
    },
    adjustedStep(): number {
      if (this.showContribute) return this.currentStep;
      return Math.max(0, this.currentStep - 1);
    },
  },

  methods: {
    updateData() {
      this.showSteps = steps.includes(this.$route.path);
      this.currentStep = steps.indexOf(this.$route.path);
    },
  },

  watch: {
    $route(to, from) {
      this.updateData();
    },
  },
});
</script>

<template>
  <div class="mt-auto pt-4 pb-3">
    <!-- Step indicator -->
    <div v-if="showSteps" class="flex items-center justify-center gap-0 px-6 pb-4">
      <template v-for="(label, index) in stepLabels" :key="label">
        <div class="flex flex-col items-center gap-1">
          <div
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="index <= adjustedStep
              ? 'bg-primary scale-110'
              : 'bg-base-300'"
          ></div>
          <span
            class="text-[10px] transition-colors duration-300"
            :class="index <= adjustedStep
              ? 'text-primary font-medium'
              : 'text-base-content/40'"
          >{{ label }}</span>
        </div>
        <div
          v-if="index < stepLabels.length - 1"
          class="h-px w-10 mb-4 transition-colors duration-300"
          :class="index < adjustedStep ? 'bg-primary' : 'bg-base-300'"
        ></div>
      </template>
    </div>

    <!-- Footer links -->
    <div class="flex items-center justify-between max-w-3xl mx-auto px-4">
      <router-link to="/privacy" class="text-xs text-base-content/50 hover:text-base-content/70 transition-colors">
        Privacy Policy
      </router-link>
    </div>
  </div>
</template>

<style scoped></style>
