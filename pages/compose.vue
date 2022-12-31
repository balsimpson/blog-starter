<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto sm:mt-0 sm:p-4">
    <div class="p-5">
      <textarea  class="w-full text-4xl font-bold bg-transparent focus:outline-none" placeholder="What is the title?"></textarea>
    <TagInput :suggestions="tagsuggestions.items" @updated="addTags" />
    </div>
    <!-- <AppAutocomplete :options="tagsuggestions.items"/> -->
    <div class="flex-grow w-full mx-auto overflow-y-auto">
      <Tiptap @update="docUpdated" />
    </div>
    <div class="flex justify-end p-2 sm:w-44">
      <button
      @click.prevent="saveDoc('published')"
      class="flex items-center justify-center w-full px-4 py-2 font-bold tracking-wide text-teal-800 transition bg-teal-500 border-2 border-teal-500 rounded cursor-pointer hover:bg-white hover:text-teal-500 sm:w-44"
      :class="[
        postDetails && postDetails.title
          ? ''
          : 'opacity-50 pointer-events-none',
      ]"
    >
      <IconCloudUpload />
      <span
        class="ml-3"
        :class="[
          publishBtnText == 'Publishing...' ? 'pointer-events-none' : '',
        ]"
        >{{ publishBtnText }}</span
      >
    </button>
    </div>
    <!-- <div class="py-2">
      
    </div> -->
    <div class="flex flex-col justify-center">
    </div>
  </div>
  
</template>

<script setup>
import { IconCloudUpload, IconArchiveIn } from "@iconify-prerendered/vue-bx";
import { serverTimestamp } from "firebase/firestore";
import { useToast } from "vue-toastification";
definePageMeta({
  layout: false,
  middleware: ["auth"],
  title: "Compose",
});

useHead({
  title: "Compose",
  meta: [
    {
      name: "description",
      content: "Compose a post",
    },
  ],
});

const userCookie = useCookie("userCookie");
const editorPost = ref({});
const postDetails = computed(() => getPostDetails(editorPost.value));
const postTags = ref([]);
const { data: tagsuggestions } = await useAsyncData("tags", () =>
  queryContent("/tags").findOne()
);
const toast = useToast();
const publishBtnText = ref("Publishkhk");
const draftBtnText = ref("Save Draft");

const docUpdated = (doc) => {
  editorPost.value = doc;
};

const saveDoc = async (status) => {
  // console.log(userCookie.value)
  const { title, description, image } = getPostDetails(editorPost.value);

  if (status == "draft") {
    draftBtnText.value = "saving...";
  } else {
    publishBtnText.value = "Publishing...";
  }

  if (title || image) {
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
      status,
      content: editorPost.value,
      tags: postTags.value,
      published_at: serverTimestamp(),
    };

    // console.log(data);
    let res = await addDocToFirestore("posts", data);
    // console.log(res);

    if (res.type == "document") {
      toast.success(data.title + " was published!");
      setTimeout(() => {
        navigateTo("/post/" + slug)
      }, 2000);
    } else {
      toast.error("Post failed to save! - " + res);
    }
    publishBtnText.value = "Publish";
    draftBtnText.value = "Save Draft";
  }
};

const addTags = (tags) => {
  postTags.value = tags;
  // console.log("tags", tags);
};
</script>

<style>
.Vue-Toastification__toast--success {
  background-color: #481586;
  color: #fff;
}
</style>
