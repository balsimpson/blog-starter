<template>
    <div class="flex items-center justify-center w-full">
        <label v-if="imageUrl" class="relative w-full rounded-lg cursor-pointer">
            <img :src="imageUrl" alt="" class="object-cover w-full h-full rounded-lg">
            <input @change="uploadImage" type="file" accept=".jpeg,.jpg,.png,image/jpeg,image/png" class="sr-only" />
            <div class="absolute w-full px-2 py-1 text-xs text-center text-white -translate-x-1/2 rounded bg-black/70 left-1/2 bottom-2">click to change</div>
        </label>
        <label v-else
            class="flex flex-col items-center justify-center w-full h-full transition-colors border-2 border-gray-300 border-dashed rounded cursor-pointer hover:bg-gray-200 "
            :class="[
              isUploading
                ? 'pointer-events-none bg-gray-700 animate-pulse text-white'
                : '',
            ]">
            <div class="flex flex-col items-center justify-center h-44">

                <svg class="w-12 h-12 mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"
                    aria-hidden="true">
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600 ">
                    {{ addImageBtnText }}
                </p>
            </div>
            <input @change="uploadImage" type="file" accept=".jpeg,.jpg,.png,image/jpeg,image/png" class="sr-only" />
        </label>
    </div>
</template>

<script setup>
const emit = defineEmits(['uploaded'])
const props = defineProps(["image"])
const addImageBtnText = ref("Add Image")
const isUploading = ref(false)

const imageUrl = ref(props.image)

const runtimeConfig = useRuntimeConfig();

const uploadImage = async (event) => {

    isUploading.value = true;
    addImageBtnText.value = "Uploading...";

    let file = event.target.files[0];

    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", runtimeConfig.CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "pullonath");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/tinkrshop/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const res = await response.json();
    // console.log("res", res)
    isUploading.value = false;

    if (res.secure_url) {
        // console.log("Success", res.secure_url)
        imageUrl.value = res.secure_url;
        emit("uploaded", res.secure_url)
    }
};

onMounted(() => {
    
})
</script>