<script setup lang="ts"></script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-base-100/60 border-b border-white/[0.06] shadow-lg shadow-black/5">
    <div class="max-w-3xl mx-auto flex items-center justify-between h-16 px-6">
      <router-link
        to="/"
        tag="button"
        class="flex items-center gap-2.5 text-sm font-semibold text-base-content hover:text-primary transition-colors duration-200"
      >
        <div class="relative">
          <img class="relative h-7 w-7" src="/logo.png" alt="Logo" />
        </div>
        PicSync
      </router-link>
    </div>
  </header>
</template>

<style scoped></style>
