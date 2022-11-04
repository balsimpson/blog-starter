<template>
  <div v-if="post" class="flex flex-col h-full max-w-3xl p-5 mx-auto">

    <Head>
      <Title>{{ post.title }}</Title>
    </Head>
    <!-- <BreadCrumbs /> -->

    <div class="mb-4">

      <div class="flex justify-between">
        <div class="flex items-center space-x-2">
          <div to="/profile"
            class="flex items-center justify-center w-10 h-10 font-bold text-white bg-red-500 rounded-full">
            {{ post.author.name.substring(0, 1) }}
          </div>

          <div>
            <div v-if="post.author" class="font-bold">
              {{ post.author.name }}

              <div v-if="post.published_at" class="text-sm italic font-normal">
                {{ convertDate(post.published_at) }}
              </div>
            </div>
          </div>
        </div>

        <button v-if="userCookie.uid == post.author.uid" @click="isEditingPost = !isEditingPost"
          class="flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium text-center text-indigo-600 transition border-2 border-indigo-600 rounded-full cursor-pointer w-44 hover:bg-indigo-700 hover:text-white">
          <IconSave v-if="isEditingPost" />
          <IconPencil v-else />

          <span class="ml-3">{{ isEditingPost ? 'Save Changes' : 'Edit Post' }}</span>
        </button>
      </div>




      <div class="flex space-x-3">

        <div v-if="post.views" class="text-cyan-500">{{ post.views }} Views</div>
      </div>

      <div v-if="post.tags && !isEditingPost" class="space-x-1">
        <TypeChip @clicked="redirectToTag(tag)" v-for="tag in post.tags" :title="tag" />
      </div>

      <div v-if="isEditingPost" class="py-2">
        <TagInput :suggestions="tagsuggestions.items" :oldTags="post.tags" @updated="addTags" />
      </div>
    </div>
    <!-- <div v-if="post.lastUpdatedAt" class="text-cyan-600">
      {{ convertDate(post.lastPublishedAt) }}
    </div> -->



    <Tiptap v-if="isEditingPost" :content="post.content" />

    <article v-else v-html="postHtml" class="flex-grow prose font-arvo">

    </article>

    <!-- <AppFooter /> -->
  </div>
</template>

<script setup>

import { IconSave, IconPencil, IconBxPencil } from "@iconify-prerendered/vue-bx";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";

definePageMeta({
  layout: "default",
  middleware: ["auth"],
});

const route = useRoute();
const post = ref(null);
const postHtml = ref();
const postTags = ref([]);

const title = ref("");
const image = ref("");
const description = ref("")
const ogUrl = ref("https://pullonath.in")

const isEditingPost = ref(false);
const { data: tagsuggestions } = await useAsyncData("tags", () =>
  queryContent("/tags").findOne()
);
// useHead({
//   title,
//   meta: [
//     {
//       name: "description",
//       content: description,
//     },
//     {
//       property: "og:title",
//       content: title,
//     },
//     {
//       property: "og:description",
//       content: description,
//     },
//     {
//       property: "og:image",
//       content: image,
//     },
//     {
//       property: "og:url",
//       content: ogUrl,
//     },
//     {
//       name: "twitter:card",
//       content: "summary_large_image",
//     },
//     {
//       name: "twitter:title",
//       content: title,
//     },
//     {
//       name: "twitter:text:title",
//       content: title,
//     },
//     {
//       name: "twitter:description",
//       content: description,
//     },
//     {
//       name: "twitter:image",
//       content: image,
//     },
//   ],
// });

const user = ref("");
const userCookie = useCookie("userCookie");

const redirectToTag = (tag) => {
  navigateTo("/tag/" + tag)
}

const editPost = () => {
  isEditingPost.value = true;
}

const addTags = (tags) => {
  postTags.value = tags;
  // console.log("tags", tags);
};

onMounted(async () => {
  user.value = userCookie.value;
  console.log(userCookie.value)
  post.value = await getDocFromFirestoreWithSlug("posts", route.params.slug);

  title.value = post.value.title;
  description.value = post.value.description;
  image.value = post.value.image;

  postHtml.value = generateHTML(post.value.content, [
    StarterKit,
    Image,
    Youtube,
    Link,
  ]);
});
</script>

<style>
article img {
  border-radius: .25em;
}
</style>