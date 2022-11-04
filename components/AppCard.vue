<template>
  <div class="flex flex-col h-full border rounded-lg border-cyan-500 ">
    <NuxtImg
      v-if="image"
      :src="image"
      :alt="title"
      class="object-cover border-b rounded-t-lg h-44"
    />
    <div class="flex-grow p-2 sm:p-4">
      <NuxtLink :to="'/post/' + slug">
        <div class="text-xl font-bold leading-5 text-cyan-700 ">{{ title }}</div>
      </NuxtLink>
      <div class="mt-4 ">{{ description }}</div>
    </div>
    <div class="flex flex-col items-start justify-start p-2 border-t sm:p-4 ">
      <div class="text-xs text-stone-400">{{ date }}</div>
      <div v-if="tags && tags.length > 0" class="flex flex-wrap gap-1 mt-2 text-xs text-stone-400">
        <TypeChip @clicked="redirectToTag(tag)" v-for="tag in tags" :title="tag" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  "title",
  "description",
  "date",
  "tags",
  "image",
  "slug",
]);
const redirectToTag = (tag) => {
  navigateTo("/tag/" + tag)
}
</script>