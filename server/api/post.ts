import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getDocsFromFirestore, getDocFromFirestore, getDocFromFirestoreWithSlug } from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig()
  // const body = await readBody(event)
  const query = getQuery(event)

  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.FIREBASE_API_KEY,
    projectId: config.FIREBASE_PROJECT_ID,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log(query.slug)
  // get post
  // @ts-ignore
  return await getDocFromFirestoreWithSlug("posts", query.slug)

  // return post
})