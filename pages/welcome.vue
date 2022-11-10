<template>
  <div class="flex items-center justify-center w-full h-screen">
    <div class="w-full text-center">
      <div>Welcome To</div>
      <div class="text-2xl font-bold font-arvo text-emerald-600">Pullonath</div>
      <div class="w-[260px] mx-auto mt-6">
        <div>
          <label for="name" class="block mt-5 text-sm font-bold text-center text-gray-500">
            Your email ID
          </label>
          <div class="text-xl italic text-emerald-600">{{ email }}</div>
        </div>
        <form>
          <label for="name" class="block mt-5 text-sm font-bold text-center text-gray-500">
            What's your name?
          </label>
          <div class="mt-2">
            <input v-model="name" type="text" autocomplete="name" required="true" placeholder="Gopal"
              class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-emerald-500 focus:border-emerald-500 " />
          </div>
          <label for="email" class="block mt-4 text-sm font-bold text-center text-gray-500">
            Choose a strong password
          </label>
          <div class="mt-2">
            <input v-model="password" type="password" autocomplete="password" required="true" placeholder="password"
              class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-emerald-500 focus:border-emerald-500 " />
          </div>
        </form>
        <button @click.prevent="completeRegistration"
          class="flex items-center justify-center w-full px-4 py-2 mt-6 font-bold text-white rounded focus:outline-none focus:ring-emerald-800 focus:ring-2 focus:ring-offset-0"
          :class="[
            email && password
              ? 'bg-emerald-600'
              : 'bg-emerald-600 opacity-50 text-emerald-200 pointer-events-none',

            isRegistering ? 'animate-pulse pointer-events-none opacity-70' : ''
          ]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-4">
            <path fill-rule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              clip-rule="evenodd" />
          </svg>
          Enter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getDocFromServer } from '@firebase/firestore';


definePageMeta({
  layout: false
})

const route = useRoute();
const config = useRuntimeConfig();

const user = ref();

const name = ref("");
const email = ref("")
const password = ref("")

const isRegistering = ref(false);

const completeRegistration = async () => {
  try {

    isRegistering.value = true;
    // get record details from invites collection
    // let invitedUser = await getDocFromFirestore("invites", email.value)
    // console.log('invited', invitedUser)
    // login user
    // console.log(name.value, email.value)
    let res = await signInUser(email.value, config.TEMP_PASSWORD)
    // console.log('user', res);
    // // update display name
    let res1 = await updateUserProfile({ displayName: name.value })

    // // update password
    let res2 = await updateUserPassword(password.value)

    // // update invites record
    let resUpdate = await updateDocInFirestore("invites", email.value, {status: "joined"})

    isRegistering.value = false;
    
    navigateTo("/")
  } catch (error) {
    console.log(error)
  }
  // create user record
  // let res = await addDocToFirestore("users", user)
}

onMounted(async() => {
  email.value = route.query.email;
  name.value = route.query.name;
  
  // check if invited
  user.value = await getDocFromFirestore("invites", email.value);

  // if (user.value) {
  //   let res = await signInUser(email.value, config.TEMP_PASSWORD)
  //   console.log(res)
  // } else {
  //   navigateTo("/signin")
  // }
  
  // if (!email.value) {
  //   navigateTo("/signin")
  // }
})
</script>