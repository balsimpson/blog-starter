
<template>
  <button @click="emitTag(title)" class="inline-flex items-center justify-center text-indigo-500 transition hover:text-indigo-700 group">
    <IconHash class="w-4 h-4 text-gray-400 transition group-hover:text-indigo-600" />
    <span class="font-semibold uppercase">{{ title }}</span>
  </button>
</template>

<script setup>
import { IconHash } from "@iconify-prerendered/vue-bx";
const props = defineProps(["title"]);
const emit = defineEmits();

const emitTag = (tag) => {
  emit("clicked", tag);
}
</script>

<style>

</style>