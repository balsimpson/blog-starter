<template>
  <div>
    <div
      class="relative overflow-hidden transition rounded-full w-36 h-36 ring-4 ring-gray-600 hover:ring-brand-500"
    >
    <div v-if="!isUploading" class="absolute left-0 right-0 px-1 py-1 text-xs font-bold text-center text-gray-400 bg-gray-100 rounded shadow bottom-4">click to update</div>
      <div v-if="imgUrl">
        <img
        :src="imgUrl"
        alt="profile image"
        class="object-cover rounded-full w-36 h-36"
      />
      </div>
      <div class="absolute top-0 w-full">
        <label
          class="flex flex-col items-center w-full transition-colors rounded-full cursor-pointer h-36 "
          :class="[
            isUploading
              ? 'pointer-events-none bg-gray-700 animate-pulse text-white'
              : '',
          ]"
        >
          <input
            @change="uploadFiles"
            type="file"
            accept=".jpeg,.jpg,.png,.gif,image/gif,image/jpeg,image/png"
            class="sr-only"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
    const { $cloudinary } = useContext();

    const imgUrl = computed(() => {
      // console.log(props.user);
      return props.user?.photoURL || ""
    });

    const filesToUpload = ref([]);
    const filesUploaded = ref([]);

    const addImageBtnText = ref("Add an image");
    const isUploading = ref(false);
    const isFeatured = ref(false);

    /* create a reader */
    const readData = (f) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(f);
      });
    };

    const uploadFiles = async (val) => {
      isUploading.value = true;
      addImageBtnText.value = "Uploading...";
      let file = val.target.files[0];
      filesToUpload.value.push(URL.createObjectURL(file));

      const data = await readData(file);

      const instance = await $cloudinary.upload(data, {
        folder: props.folder,
        upload_preset: "custom-upload",
      });

      isUploading.value = false;
      addImageBtnText.value = "Add an image";

      instance["featured"] = false;
      filesUploaded.value.push(instance);
      filesToUpload.value = [];
      emit("updated", filesUploaded.value);
    };

    const removeFromList = async (ind) => {
      // filesToUpload.value.splice(ind, 1);
      filesUploaded.value.splice(ind, 1);
      // delete file on cloudinary
      // let res = await $cloudinary.delete(filesUploaded.value[ind]);
      // console.log($cloudinary);
    };

    const setFeaturedImage = async (item) => {
      isFeatured.value = !isFeatured.value;
      let files = [];
      // filesUploaded.value.forEach((file) => {
      //   file.featured = false;
      //   files.push(file);
      // });
      filesUploaded.value.forEach((file) => {
        if (file.public_id === item.public_id) {
          file.featured = !file.featured;
        } else {
          file.featured = false;
        }
        files.push(file);
      });

      // filesUploaded.value = files;
      // console.log("featured", filesUploaded.value);
      emit("updated", filesUploaded.value);
    };
</script>

<style>
</style>