<script lang="ts">
import { defineComponent } from "vue";
import { EventType } from "../../interfaces/api";
import { addHandler } from "./services/ws";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default defineComponent({
  data: () => ({}),
  mounted() {
    addHandler(EventType.Redirect, this.onRedirect);
  },
  methods: {
    onRedirect(url: string): void {
      this.$router.push(url);
    },
  },
  components: {
    Header,
    Footer,
  },
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-base-200">
    <Header />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <Footer />
  </div>
</template>

<style scoped></style>
