<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { enforcePayments } from "../settings";

const route = useRoute();

const steps = ["/contribute", "/whatsapp", "/gauth", "/options", "/sync"];

const showSteps = ref(false);
const showContribute = ref(false);
const currentStep = ref(0);

const stepLabels = computed(() => {
  const labels = [];
  if (showContribute.value) labels.push("Contribute");
  labels.push("WhatsApp", "Google", "Sync");
  return labels;
});

const adjustedStep = computed(() => {
  if (showContribute.value) return currentStep.value;
  return Math.max(0, currentStep.value - 1);
});

function updateData() {
  showSteps.value = steps.includes(route.path);
  currentStep.value = steps.indexOf(route.path);
}

onMounted(() => {
  enforcePayments.then((val) => {
    showContribute.value = val;
  });
});

watch(() => route.path, () => {
  updateData();
});
</script>

<template>
  <div class="mt-auto pt-4 pb-3">
    <!-- Step indicator -->
    <div v-if="showSteps" class="flex items-center justify-center gap-0 px-6 pb-4">
      <template v-for="(label, index) in stepLabels" :key="label">
        <div class="flex flex-col items-center gap-1">
          <div
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="index <= adjustedStep
              ? 'bg-primary shadow-[0_0_8px] shadow-primary/50'
              : 'bg-neutral/50 border border-white/[0.06]'"
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
          class="h-px w-12 mb-4 transition-colors duration-300"
          :class="index < adjustedStep ? 'bg-primary' : 'bg-white/[0.06]'"
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
