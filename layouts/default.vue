<template>
  <div class="flex flex-col w-full h-screen">
    <div class="relative px-4 py-6 sm:px-6 lg:px-8">
      <nav class="relative flex flex-col items-center justify-between max-w-3xl mx-auto sm:flex-row "
        aria-label="Global">
        <div class="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
          <div class="flex items-center justify-between w-full md:w-auto">
            <NuxtLink to="/">
              <span class="sr-only">Pullonath</span>
              <img alt="Pullonath" class="w-auto h-8 sm:h-10" src="logo.svg" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex flex-wrap items-center mt-3 space-x-2 sm:mt-0 md:ml-10">

          <!-- <ToggleDarkmode /> -->
          <!-- <button
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-emerald-600 hover:bg-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>


            <span class="ml-2 tracking-wide">Create Post</span>
          </button> -->

          <!-- <NuxtLink to="/blog"
            class="block px-1 text-base font-bold transition rounded-md text-cyan-600 hover:underline decoration-wavy ">
            Blog</NuxtLink> -->

          <NuxtLink to="/compose"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md bg-emerald-600 hover:bg-emerald-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <span class="ml-2 tracking-wide">Create Post</span>
          </NuxtLink>

          <NuxtLink v-if="user" to="/profile" class="flex items-center justify-center w-10 h-10 font-bold text-white bg-red-500 rounded-full">
            {{name.substring(0, 1)}}
          </NuxtLink>
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
import { IconGithub } from "@iconify-prerendered/vue-bxl";
const user = ref("");
const name = ref("");
const userCookie = useCookie("userCookie")

onMounted(() => {
  user.value = userCookie.value.providerData[0];
  name.value = user.value.displayName;
  console.log(userCookie.value)
})
</script>