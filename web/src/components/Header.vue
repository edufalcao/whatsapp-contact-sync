<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data: () => ({}),
  mounted() {},
  methods: {},
});
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-base-100/80 border-b border-base-300">
    <div class="max-w-3xl mx-auto flex items-center justify-between h-14 px-4">
      <router-link
        to="/"
        tag="button"
        class="flex items-center gap-2 text-sm font-semibold text-base-content hover:opacity-80 transition-opacity"
      >
        <img class="h-6 w-6" src="/logo.png" alt="Logo" />
        PicSync
      </router-link>
    </div>
  </header>
</template>

<style scoped></style>
