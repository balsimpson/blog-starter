<template>
  <div>
    <!-- <div>{{ user }}</div> -->

    <div class="max-w-3xl px-3 mx-auto space-y-3 sm:px-6">

      <div class="relative mt-12 bg-white rounded shadow-md">
        <div class="absolute flex justify-center w-full -mt-20">
          <div class="w-32 h-32">
          </div>
        </div>
        <div class="relative">
          <div class="flex flex-col items-center px-6 mt-16">
            <!-- <pre>{{ user }}</pre> -->
            <div class="flex items-center justify-center w-44">
              <CloudinaryUploadJs v-if="userCookie" @uploaded="updateProfileImage($event)" :image="userCookie.photoURL"
                alt="Display Picture of Silene Tokyo" role="img"
                class="object-cover rounded-full shadow-md h-44 w-44" />
            </div>
            <h1 class="mt-6 mb-1 text-3xl font-bold text-center ">{{ user.displayName }}</h1>
            <p class="text-sm text-center text-gray-800 ">{{ user.email }}</p>
            <button @click="signOut"
              class="px-3 py-1 mt-2 mb-6 text-sm text-white capitalize bg-indigo-600 rounded-lg">sign
              out</button>
            <!-- <p class="pt-3 text-base font-normal text-center text-gray-600 sm:px-6">The emphasis on innovation
              and technology in our companies has resulted in a few of them establishing global benchmarks in product
              design and development.</p> -->
            <!-- <div class="flex justify-center w-full pt-5 pb-5">
              <a href="javascript:void(0)" class="mx-5">
                <div aria-label="Twitter" role="img">
                  <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg2.svg"
                    alt="twitter" />
                </div>
              </a>
              <a href="javascript:void(0)" class="mx-5">
                <div aria-label="Instagram" role="img">
                  <img src="https://tuk-cdn.s3.amazonaws.com/can-uploader/gray-bg-with-description-svg3.svg"
                    alt="instagram" />
                </div>
              </a>
            </div> -->
          </div>
        </div>
      </div>

      <!-- <pre>{{
          invitedList
      }}</pre> -->

      <div class="flex items-center justify-center p-6 mt-6 border rounded">
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

            <button @click="sendInvite"
              class="px-3 py-2 mt-2 text-sm font-semibold tracking-wide text-white capitalize bg-indigo-600 rounded"
              :class="[isRequestingInvite ? 'pointer-events-none opacity-50' : '', inviteName && inviteEmail ? '' : 'pointer-events-none opacity-50']">
              {{ inviteBtnText }}
            </button>
            <span class="ml-3 text-sm text-red-500">{{ inviteErrorMsg }}</span>
          </div>
        </div>

        <div v-else class="flex items-center justify-center h-44">
          <p class="px-6 text-xl text-center text-teal-600">
            An invite has been sent to <span class="font-bold">{{ inviteEmail
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
          <div v-for="item in inviteRequests"
            class="flex flex-col items-center justify-between p-3 border rounded sm:flex-row">
            <div class="font-semibold">{{ item.email }}</div>
            <div class="mt-2 space-x-4 text-sm sm:mt-0">
              <button @click.prevent="approveRequest(item.email)"
                class="px-2 py-1 text-teal-600 transition border border-teal-600 rounded hover:bg-teal-600 hover:text-white">Approve</button>
              <!-- <button
                class="px-2 py-1 text-red-600 transition border border-red-600 rounded hover:bg-red-600 hover:text-white">Decline</button> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Invites -->
      <div>
        <div class="pt-6 text-xl font-bold">Invited</div>
        <p class="text-sm">Status of invited people.</p>

        <div class="mt-3 space-y-1">
          <div v-for="item in invitedList" class="flex items-center justify-between p-3 border rounded">
            <div>
              <div class="font-semibold">{{ item.email }}</div>
              <div class="text-sm text-gray-500">Invite sent on {{ convertDate(item.invited_at || item.created_at) }}
              </div>
            </div>
            <div class="px-3 py-1 text-indigo-600 capitalize transition border rounded">{{ item.status }}</div>
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
const config = useRuntimeConfig();
const user = ref("");
const name = ref("");
const userCookie = useCookie("userCookie")

const inviteName = ref("");
const inviteEmail = ref("");
const inviteBtnText = ref("Send An Invite");
const inviteErrorMsg = ref("");

const isRequestingInvite = ref(false);
const inviteRequestSuccess = ref(false);

const invitedList = ref([]);
const inviteRequests = ref([])

const signOut = async () => {
  // console.log("signing out");
  await signOutUser();
  router.push("/signin");
};

const sendInvite = async () => {
  // change status to sending
  isRequestingInvite.value = true;
  inviteBtnText.value = "Sending..";

  // check if user exists
  let resUser = await getDocFromFirestore("invites", inviteEmail.value);

  if (resUser) {
    isRequestingInvite.value = false;
    inviteErrorMsg.value = "Already invited!"
    inviteBtnText.value = "Send An Invite";
    setTimeout(() => {
      inviteErrorMsg.value = ""
    }, 3000);
  } else {
    // // create user
    let user = await createUser(inviteEmail.value, config.TEMP_PASSWORD)
    // console.log('user', user)
    // // add record to firestore
    let res = await setDocToFirestore("invites", inviteEmail.value, {
      name: inviteName.value,
      email: inviteEmail.value,
      status: "invited",
      invited_by: name.value,
      invited_at: serverTimestamp()
    })

    // send email through autocode
    let response = await useFetch(`/api/sendgrid?email=${inviteEmail.value}&name=${inviteName.value}`);


    // change status to sent
    inviteRequestSuccess.value = true;
    inviteBtnText.value = "Send An Invite";

    setTimeout(() => {
      inviteRequestSuccess.value = false;
      inviteName.value = ""
      inviteEmail.value = ""
    }, 4000);

    // reset values
    isRequestingInvite.value = false;
  }

}

const approveRequest = async (email) => {
  // if approved, send invite mail
  // create user
  let user = await createUser(email, config.TEMP_PASSWORD)
  console.log('user', user)
  // add record to firestore
  let res = await setDocToFirestore("invites", email, {
    name: inviteName.value,
    email: email,
    status: "invited",
    invited_by: name.value,
    invited_at: serverTimestamp()
  })

  // send email through autocode
  let response = await useFetch(`/api/sendgrid?email=${inviteEmail.value}&name=${inviteName.value}`);

  // refresh the list
  let list = await getDocsFromFirestore("invites");
  inviteRequests.value = list.filter(
    (item) => item.status == "request"
  );
  invitedList.value = list.filter(
    (item) => item.status == "invited"
  );
  
  
  // if rejected, send regret mail

}

const updateProfileImage = async (imgUrl) => {
  console.log(imgUrl)
  let res = await updateUserProfile(user.displayName, imgUrl)

  console.log(res)
}

onMounted(async () => {
  user.value = userCookie.value.providerData[0];
  name.value = user.value.displayName;

  let list = await getDocsFromFirestore("invites");
  inviteRequests.value = list.filter(
    (item) => item.status == "request"
  );
  invitedList.value = list.filter(
    (item) => item.status == "invited" || item.status == "joined"
  );
  // console.log(userCookie.value)
})

</script>

<style>

</style>