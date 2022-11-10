<template>
  <div class="flex flex-col w-full h-screen font-lato">
    <div class="relative px-4 py-6 sm:px-6 lg:px-8">
      <nav class="relative flex items-center justify-between max-w-4xl mx-auto sm:flex-row "
        aria-label="Global">
        <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
          <div class="flex items-center justify-between w-full md:w-auto">
            <NuxtLink to="/">
              <span class="sr-only">Pullonath</span>
              <img alt="Pullonath" class="w-24 h-8 sm:h-10 sm:w-44" src="/logo.svg" />
              <!-- <img alt="Pullonath" class="w-auto h-8 sm:h-10 sm:hidden" src="/favicon.png" /> -->
            </NuxtLink>
          </div>
        </div>
        <div class="flex flex-wrap items-center mt-3 space-x-2 sm:mt-0 md:ml-10">

          <NuxtLink to="/compose"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-rose-900 hover:bg-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <span class="hidden ml-2 tracking-wide">Create Post</span>
          </NuxtLink>

          <div v-if="user">
            <NuxtLink v-if="user.photoURL" to="/profile"
            class="flex items-center justify-center w-10 h-10 font-bold text-white bg-white border-2 rounded-full border-rose-500">
            <img :src="user.photoURL" alt="">
          </NuxtLink>
          <NuxtLink v-else to="/profile"
            class="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-rose-500">
            <span v-if="name">
              {{ name.substring(0, 1) }}
            </span>
            <span v-else><IconUser /></span>
          </NuxtLink>
          </div>
        </div>
        <!-- <pre>{{userCookie}}</pre> -->
        <!-- <pre>{{user}}</pre> -->
      </nav>
    </div>
    <div class="flex-grow">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { IconUser } from "@iconify-prerendered/vue-bx";
const user = ref("");
const name = ref("");
const userCookie = useCookie("userCookie")


onMounted(async() => {
  user.value = userCookie.value?.providerData[0];
  name.value = user.value?.displayName;
})
</script>