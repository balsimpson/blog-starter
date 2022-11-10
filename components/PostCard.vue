<template>
  <div class="flex flex-wrap py-2 md:flex-nowrap">
    <!-- <pre>{{post}}</pre> -->
    <div class="flex flex-col flex-shrink-0 mb-6 md:w-64 md:mb-0">
      <span class="font-semibold uppercase text-stone-600 title-font">{{
          post.category
      }}</span>
      <!-- <span class="mt-1 text-sm text-gray-500">{{
          getReadableDate(post.publish_date)
      }}</span> -->
    </div>
    <div class="md:flex-grow">
      <h2 class="mb-2 text-2xl font-medium text-stone-600 title-font">
        {{ post.title }}
      </h2>
      <p class="leading-relaxed">
        {{ post.description }}
      </p>

      <NuxtLink :to="'/post/' + post.slug" class="inline-flex items-center mt-4 text-pink-400">
        Read More
        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>

      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["post"])
</script>