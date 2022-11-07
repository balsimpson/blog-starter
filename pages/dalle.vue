<template>
  <div>
    <div>Dall-E</div>
    <input v-model="prompt" type="text">
    <button @click.prevent="getImage">generate</button>

    <div>
      <img :src="generatedImg" alt="">
    </div>
  </div>
</template>

<script setup>
import { Configuration, OpenAIApi } from "openai"
const config = useRuntimeConfig();
const prompt = ref("")
const configuration = new Configuration({
  apiKey: config.OPENAI_KEY,
});
let generatedImg = ref();
const openai = new OpenAIApi(configuration);

const getImage = async () => {


  try {
    const response = await openai.createImage({
      prompt: prompt.value,
      n: 1,
      size: "256x256",
    });
    // console.log(openai, configuration, config.OPENAI_KEY)
    // const response = await openai.listFiles();
    generatedImg.value = response.data.data[0].url;
    console.log(response.data.data[0].url)
  } catch (error) {
    console.log(error)
  }
  // const openai_key = config.OPENAI_KEY
  // try {
  //   let res = await fetch("https://api.openai.com/v1/images/generations", {
  //     method: "POST",
  //     headers: {
  //       'Authorization': `Bearer ${openai_key}`,
  //       'Content-Type': `application/json`
  //     },
  //     body: {
  //       "prompt": "a photo of a happy corgi puppy sitting and facing forward, studio light, longshot",
  //       "n": 1,
  //       "size": "1024x1024"
  //     },
  //   })
  //   console.log(res);
  // } catch (error) {
  //   console.log(error)
  // }


}

</script>