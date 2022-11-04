<template>
  <div>
    <!-- <div>{{ user }}</div> -->

    <div class="max-w-3xl px-3 mx-auto space-y-3 sm:px-6">
      <div class="my-6 text-center">
        <div class="text-xs">You are logged in as</div>
        <div>{{ user.email }}</div>
        <button @click="signOut" class="px-3 py-1 mt-2 text-sm text-white capitalize bg-indigo-600 rounded-lg">sign out</button>
      </div>

      <div class="flex items-center justify-center px-4 py-3 mt-6 border rounded">
        <div v-if="!inviteRequestSuccess">
          <div class="text-xl font-bold">Send an invite</div>
          <p class="text-sm text-gray-500">
            You can send an invitation by entering a name and email address below. An invite email will be sent to them
            automatically from admin@pullonath.in
          </p>
          <div>
            <div class="mt-2">
              <label for="name" class="block text-sm font-bold text-left text-gray-500">
                Name
              </label>
              <input v-model="inviteName" type="text" autocomplete="name" required="true" placeholder="Keshav"
                class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-teal-500 focus:border-teal-500 " />
              <label for="email" class="block mt-2 text-sm font-bold text-left text-gray-500">
                Email
              </label>
              <input v-model="inviteEmail" type="email" autocomplete="email" required="true"
                placeholder="keshav@das.com"
                class="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out border rounded outline-none text-stone-600 bg-stone-600 border-stone-600 bg-opacity-20 focus:bg-transparent focus:ring-1 placeholder-stone-400 focus:ring-teal-500 focus:border-teal-500 " />
            </div>

            <button @click="sendInvite" class="px-3 py-1 mt-2 text-sm text-white capitalize bg-indigo-600 rounded-lg"
              :class="[isRequestingInvite ? 'pointer-events-none opacity-50' : '', inviteName && inviteEmail ? '' : 'pointer-events-none opacity-50']">send
              an invite</button>
          </div>
        </div>

        <div v-else>
          <p class="px-6 text-xl text-center text-teal-600">
            We have received your request and will get back to you soon at <span class="font-bold">{{ inviteEmail
            }}</span>
          </p>
        </div>
      </div>


      <!-- Requests -->
      <div>
        <div class="pt-6 text-xl font-bold">Requests</div>
        <p class="text-sm">Approve or decline requests to enter Pullonath. When you approve, an email invite will be
          sent
          to them. If you decline the request, a regret email will be sent.</p>

        <div class="mt-3 space-y-1">
          <div class="flex flex-col items-center justify-between p-3 border rounded sm:flex-row">
            <div>some@email.com</div>
            <div class="mt-2 space-x-4 text-sm sm:mt-0">
              <button
                class="px-2 py-1 text-teal-600 transition border border-teal-600 rounded hover:bg-teal-600 hover:text-white">Approve</button>
              <button
                class="px-2 py-1 text-red-600 transition border border-red-600 rounded hover:bg-red-600 hover:text-white">Decline</button>
            </div>
          </div>
          <div class="flex flex-col items-center justify-between p-3 border rounded sm:flex-row">
            <div>some@email.com</div>
            <div class="mt-2 space-x-4 text-sm sm:mt-0">
              <button
                class="px-2 py-1 text-teal-600 transition border border-teal-600 rounded hover:bg-teal-600 hover:text-white">Approve</button>
              <button
                class="px-2 py-1 text-red-600 transition border border-red-600 rounded hover:bg-red-600 hover:text-white">Decline</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Invites -->
      <div>
        <div class="pt-6 text-xl font-bold">Invited</div>
        <p class="text-sm">Status of invited people.</p>

        <div class="space-y-1">
          <div class="flex items-center justify-between p-3 border rounded">
            <div>
              <div class="font-semibold">some@email.com</div>
              <div class="text-sm text-gray-500">Invite sent on 21 Nov 2022</div>
            </div>
            <div class="px-3 py-1 text-indigo-600 transition border rounded">Invited</div>
          </div>

          <div class="flex items-center justify-between p-3 border rounded">
            <div>
              <div class="font-semibold">some@email.com</div>
              <div class="text-sm text-gray-500">Joined on 21 Nov 2022</div>
            </div>
            <div class="space-x-4 text-sm">
              <div class="px-3 py-1 text-teal-600 transition border rounded">Joined</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { serverTimestamp } from "@firebase/firestore";
import { IconCheckCircle, IconSend } from "@iconify-prerendered/vue-bx";
const router = useRouter();
const user = ref("");
const name = ref("");
const userCookie = useCookie("userCookie")

const inviteName = ref("");
const inviteEmail = ref("");

const isRequestingInvite = ref(false);
const inviteRequestSuccess = ref(false);

const signOut = async () => {
  // console.log("signing out");
  await signOutUser();
  router.push("/signin");
};

const sendInvite = async () => {
  // change status to sending
  isRequestingInvite.value = true;
  
  // add record to firestore
  let res = await addDocToFirestore("invites", {
    name: inviteName.value,
    email: inviteEmail.value,
    status: "invited",
    invited_by: name.value,
    invited_at: serverTimestamp()
  })

  // send email through autocode
  let response = await useFetch(`https://amused.autocode.dev/pullonath@dev/invite?email=${inviteEmail.value}&name=${inviteName.value}`);
  // change status to sent

  isRequestingInvite.value = false;
}

onMounted(() => {
  user.value = userCookie.value.providerData[0];
  name.value = user.value.displayName;
  // console.log(userCookie.value)
})

</script>

<style>

</style>