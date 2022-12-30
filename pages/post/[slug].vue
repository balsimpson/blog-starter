<template>
  <div>
    <div v-if="post.author" class="flex flex-col h-full max-w-3xl p-5 mx-auto sm:px-12">

      <!-- <Head>
        <Title>{{ post.title }}</Title>
      </Head> -->
      <!-- <BreadCrumbs /> -->

      <div class="mb-4">

        <div class="flex flex-col items-center justify-between sm:flex-row">
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

          <div v-if="userCookie?.uid == post.author.uid" class="mt-3 sm:mt-0">
            <button v-if="isEditingPost" @click="publishChanges"
              class="flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium text-center text-indigo-600 transition border-2 border-indigo-600 rounded-full cursor-pointer w-44 hover:bg-indigo-700 hover:text-white">
              <IconSave />

              <span class="ml-3">Save Changes</span>
            </button>
            <button v-else @click="isEditingPost = !isEditingPost"
              class="flex items-center justify-center px-4 py-2 mb-6 text-sm font-medium text-center text-indigo-600 transition border-2 border-indigo-600 rounded-full cursor-pointer w-44 hover:bg-indigo-700 hover:text-white">
              <IconPencil />

              <span class="ml-3">Edit Post</span>
            </button>

          </div>

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



      <Tiptap v-if="isEditingPost" :content="post.content" @update="docUpdated" />

      <article v-else v-html="postHtml" class="flex-grow prose font-lato">

      </article>

      <!-- <AppFooter /> -->
    </div>
  </div>
</template>

<script setup>

import { IconSave, IconPencil, IconBxPencil } from "@iconify-prerendered/vue-bx";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { serverTimestamp } from "firebase/firestore";

definePageMeta({
  layout: "default",
  // middleware: ["auth"],
});

const route = useRoute();
// const post = ref(null);
const postHtml = ref();
const postTags = ref([]);

// const { data: post, pending, error, refresh } = await useAsyncData(
//   'post',
//   () => $fetch('/api/post?slug=' + route.params.slug)
// )

const { data: post } = await useFetch(`/api/post/?slug=${route.params.slug}`, { initialCache: false })


const isEditingPost = ref(false);
const { data: tagsuggestions } = await useAsyncData("tags", () =>
  queryContent("/tags").findOne()
);
useHead({
  title: () => post.value?.title,
  meta: [
    {
      name: "description",
      content: () => post.value?.description,
    },
    {
      property: "og:title",
      content: () => post.value?.title,
    },
    {
      property: "og:description",
      content: () => post.value?.description,
    },
    {
      property: "og:image",
      content: () => post.value?.image,
    },
    {
      property: "og:url",
      content: "https://pullonath.in/",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: () => post.value?.title,
    },
    {
      name: "twitter:description",
      content: () => post.value?.description,
    },
    {
      name: "twitter:image",
      content: () => post.value?.image,
    },
  ],
});

const user = ref("");
const userCookie = useCookie("userCookie");

const editorPost = ref({});

const redirectToTag = (tag) => {
  navigateTo("/tag/" + tag)
}

const docUpdated = (doc) => {
  editorPost.value = doc;
};

const editPost = () => {
  isEditingPost.value = true;
}

const addTags = (tags) => {
  postTags.value = tags;
  // console.log("tags", tags);
};

const publishChanges = async () => {

  // console.log(post.value)

  const { title, description, image } = getPostDetails(editorPost.value);

  const slug = createSlug(title);

  const data = {
    author: {
      name: userCookie.value.providerData[0].displayName,
      email: userCookie.value.providerData[0].email,
      photo: userCookie.value.providerData[0].photoURL,
      uid: userCookie.value.uid,
    },
    title,
    description,
    image,
    slug,
    content: editorPost.value,
    tags: postTags.value,
    updated_at: serverTimestamp(),
  };

  // update record in posts with new content
  let res = await updateDocInFirestore("posts", post.value.id, data)

  let pubDate = post.value.published_at;
  post.value = data;
  post.value.published_at = pubDate;

  postHtml.value = generateHTML(post.value.content, [
    StarterKit,
    Image,
    Youtube,
    Link,
  ]);

  isEditingPost.value = !isEditingPost.value
}


// watchEffect(() => {
//   console.log(route.params.slug)
//   refresh()


// })

onMounted(async () => {
  // refresh()
  // user.value = userCookie.value;
  // console.log(userCookie.value)
  // post.value = await getDocFromFirestoreWithSlug("posts", route.params.slug);

  if (post.value) {
    editorPost.value = post.value.content;
    postTags.value = post.value.tags;

    postHtml.value = generateHTML(post.value.content, [
      StarterKit,
      Image,
      Youtube,
      Link,
    ]);
  } else {
    console.log("else")
  }
});
</script>

<style>
article img {
  border-radius: .25em;
}
</style>