<template>
  <div class="flex flex-col min-h-screen py-12 sm:px-4 ">
    <div class="flex-grow w-full max-w-4xl px-4 mx-auto text-center">
      <AppCarousel v-if="posts.length" :items="posts"/>
      <div class="grid gap-8 mt-6 text-left sm:grid-cols-2">
        <AppCard
          v-for="post in posts"
          :title="post.title"
          :description="post.description"
          :image="post.image"
          :tags="post.tags"

          :date="post.published_at"
          :slug="post.slug"
        />
      </div>

      <div class="text-left text-stone-600">
        <PostCard v-for="post in posts" :post="post"/>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  // middleware: ["auth"],
});
const { data: blog } = await useAsyncData("blog", () =>
  queryContent("/blog").findOne()
);

const { data: posts, pending, error } = await useAsyncData(
  'post',
  () => $fetch('/api/post')
)

const refresh = () => refreshNuxtData('posts')

onMounted(async () => {
  // refresh()
  // posts.value = await getDocsWithStatus("posts", "published");
});
</script>