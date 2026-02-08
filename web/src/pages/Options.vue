<script lang="ts">
import { defineComponent } from "vue";

interface Option {
  title: string;
  description: string;
  target: string;
  value: boolean;
  onChange?: (options: Option[]) => (event: Event) => void;
}

const disableOtherOptionsOnChange = (target: string) => (options: Option[]) => (event: Event) => {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    options.filter((o) => o.target !== target).forEach((o) => (o.value = false));
  }
};

export default defineComponent({
  data: () => ({
    options: [
      {
        title: "Manual Sync",
        description: "Compare and select each photo manually before syncing.",
        target: "manual_sync",
        value: false,
        onChange: disableOtherOptionsOnChange("manual_sync"),
      },
      {
        title: "Overwrite existing images",
        description: "Replace existing contact images with WhatsApp photos.",
        target: "overwrite_photos",
        value: false,
        onChange: disableOtherOptionsOnChange("overwrite_photos"),
      },
    ],
  }),
  mounted() {},
  methods: {
    startSync() {
      const searchParams = new URLSearchParams();
      this.options.forEach((option) => {
        searchParams.set(option.target, String(option.value));
      });
      this.$router.push(`/sync?${searchParams.toString()}`);
    },
  },
});
</script>

<template>
  <div class="flex-1 flex items-center justify-center px-4 py-12">
    <div class="max-w-lg w-full bg-base-100 rounded-xl shadow-sm border border-base-300 p-6">
      <h1 class="text-2xl font-semibold tracking-tight text-base-content">
        Sync Options
      </h1>
      <p class="mt-2 text-sm text-base-content/60 leading-relaxed">
        Configure how your contacts will be synced.
      </p>

      <div class="mt-6 divide-y divide-base-200">
        <label
          v-for="option in options"
          :key="option.target"
          class="flex items-center justify-between py-4 cursor-pointer"
        >
          <div class="pr-4">
            <div class="text-sm font-medium text-base-content">{{ option.title }}</div>
            <div class="text-xs text-base-content/50 mt-0.5">{{ option.description }}</div>
          </div>
          <input
            type="checkbox"
            v-model="option.value"
            class="toggle toggle-sm toggle-primary"
            :onChange="option.onChange?.(options)"
          />
        </label>
      </div>

      <button class="btn btn-primary w-full mt-6" @click="startSync()">
        Start Sync
      </button>
    </div>
  </div>
</template>

<style scoped></style>
