import {
  getAuth,
  updateProfile,
  updatePassword,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { addDoc, setDoc, collection, getFirestore, getDocs, getDoc, doc, query, onSnapshot, writeBatch, deleteDoc, updateDoc, orderBy, where, limit, DocumentData, Query, increment } from "firebase/firestore"

export const createUser = async (email: string, password: string) => {
  const auth = getAuth();
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  return credentials;
};

export const signInUser = async (email: string, password: string) => {
  const auth = getAuth();
  const credentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    const config = useRuntimeConfig()
    console.log(config)
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);

    if (errorCode === "auth/user-not-found") {
      // return `No user found.<br> Add new user in <a href="https://console.firebase.google.com/u/0/project/${config.PRIVATE_FIREBASE_PROJECT_ID}/authentication/users" target="_blank" class="underline">Firebase Authentication</a> to sign in.`;
    }
    if (errorCode === "auth/wrong-password") {
      return "Wrong password";
    }
    if (errorCode === "auth/too-many-requests") {
      return "Too many requests";
    }
    if (errorCode === "auth/user-disabled") {
      return "User disabled";
    }
    if (errorCode === "auth/invalid-email") {
      return "Invalid email";
    }
    if (errorCode === "auth/email-already-in-use") {
      return "Email already in use";
    }
    if (errorCode === "auth/invalid-credential") {
      return "Invalid credential";
    }
  });
  return credentials;
};

/**
 * update user profile
 * @param {string} displayName - display name to update
 * @param {string} photoURL - display picture to update
 * @example updateUserProfile("name", "someurl")
 */
export const updateUserProfile = async (displayName: string, photoURL: string) => {
  try {
    const auth = getAuth();
    // @ts-ignore
    let res = await updateProfile(auth.currentUser, { displayName, photoURL });
    return res;
  } catch (error) {
    console.log('updateUserProfile-error', error);
    return error;
  }
}

/**
 * update user profile
 * @param {string} newPassword - the new password
 * @example updateUserPassword(newPassword)
 */
export const updateUserPassword = async (newPassword: string) => {
  try {
    const auth = getAuth();
    // @ts-ignore
    let res = await updatePassword(auth.currentUser, newPassword);
    return res;
  } catch (error) {
    console.log('updateUserPassword-error', error);
    return error;
  }
}

export const initUser = async () => {
  const auth = getAuth();
  const db = getFirestore();
  // @ts-ignore
  const firebaseUser = useFirebaseUser();
  // @ts-ignore
  const firebaseItems = useFirebaseItems();
  firebaseUser.value = auth.currentUser;

  // @ts-ignore
  const userCookie = useCookie("userCookie");

  // @ts-ignore
  const router = useRouter();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
    } else {
      //if signed out
      // router.push("/");
    }

    firebaseUser.value = user;

    // @ts-ignore
    userCookie.value = user; //ignore error because nuxt will serialize to json

    $fetch("/api/auth", {
      method: "POST",
      body: { user },
    });
  });

  // listen to posts

};

export const signOutUser = async () => {
  const auth = getAuth();
  const result = await auth.signOut();
  return result;
};

/**
* Add a document to a collection
* @param {string} collectionName - collection name
* @param {object} doc - document to add
* @example addDocToFirestore('products', { title: "test", body: "test" })
*/
export const addDocToFirestore = async (collectionName: string, doc: any) => {
  const db = getFirestore();
  try {
    let docRef = collection(db, collectionName);
    let res = await addDoc(docRef, doc);
    return res;
  } catch (error) {
    console.log('firebase-error', error);
    return error;
  }
}

/**
* Set a document to a collection
* @param {string} collectionName - collection name
* @param {string} id - unique id
* @param {object} data - document to add
* @example setDocToFirestore('products', 'new-id', { title: "test", body: "test" })
*/
export const setDocToFirestore = async (collectionName: string, id: string, data: any) => {
  const db = getFirestore();
  try {
    let res = await setDoc(doc(db, collectionName, id), data,
    // { merge: false }
    );
    return res;
  } catch (error) {
    console.log('firebase-error', error);
    return error;
  }
}

/**
* Get documents from a collection
* @param {String} collectionName - name of the collection
* @returns {Array} array of items
* @example getDocsFromFirestore('products', 'published_at')
*/
export const getDocsFromFirestore = async (collectionName: string) => {
  try {
    const db = getFirestore();
    // const q = query(collection(db, collectionName), orderBy("release_date", "desc"));
    let items = [];
    let q = query(collection(db, collectionName));

    let res = await getDocs(q);
    res.forEach((doc) => {
      let newdoc = doc.data();
      newdoc.uid = doc.id;
      // @ts-ignore
      items.push(newdoc);
    });
    return items;
  } catch (error) {
    console.log('firebase-error', error);
    return error;
  }
}

/**
* Get documents ordered from a collection
* @param {String} collectionName - name of the collection
* @param {String} order - the property to order by
* @param {String} count - limit number of items to fetch
* @returns {Array} array of items
* @example getOrderedDocsFromFirestore('posts', 'published_at', 3)
*/
export const getOrderedDocsFromFirestore = async (collectionName: string, order: string = "published_at", count: number) => {
  try {
    const db = getFirestore();
    let items = [];
    let q: Query<DocumentData>;

    if (count) {
      q = query(collection(db, collectionName), orderBy(order, "desc"), limit(count));
    } else {
      q = query(collection(db, collectionName), orderBy(order, "desc"));
    }

    let res = await getDocs(q);
    res.forEach((doc) => {
      let newdoc = doc.data();
      newdoc.uid = doc.id;
      // @ts-ignore
      items.push(newdoc);
    });
    return items;
  } catch (error) {
    console.log('firebase-error', error);
    return error;
  }
}

/**
* Get documents ordered matching status from a collection
* @param {String} collectionName - name of the collection
* @param {String} status - status of doc - all | draft | published
* @param {String} count - limit number of items to fetch
* @param {String} order - the property to order by
* @returns {Array} array of items
* @example getDocsWithStatus('posts', 'published', 3, 'published_at')
*/
export const getDocsWithStatus = async (collectionName: string, status: string, count: number = 0, order: string = "published_at") => {
  try {
    const db = getFirestore();
    let items = [];
    let q: Query<DocumentData>;

    if (status == "published") {
      if (count) {
        q = query(collection(db, collectionName), orderBy(order, "desc"), where("status", "==", status), limit(count));
      } else {
        q = query(collection(db, collectionName), orderBy(order, "desc"), where("status", "==", status));
      }
    }

    if (status == "draft") {
      if (count) {
        q = query(collection(db, collectionName), orderBy(order, "desc"), where("status", "==", status), limit(count));
      } else {
        q = query(collection(db, collectionName), orderBy(order, "desc"), where("status", "==", status));
      }
    }

    if (status == "all") {
      if (count) {
        q = query(collection(db, collectionName), orderBy(order, "desc"), limit(count));
      } else {
        q = query(collection(db, collectionName), orderBy(order, "desc"));
      }
    }
    // @ts-ignore
    let res = await getDocs(q);
    res.forEach((doc) => {
      let newdoc = doc.data();
      newdoc.uid = doc.id;
      // @ts-ignore
      items.push(newdoc);
    });
    return items;
  } catch (error) {
    console.log('getDocsWithStatus', error);
    return error;
  }
}

/**
* Get a single document from a collection
* @param {String} collectionName - collection name
* @param {String} docId - document id
* @example getDocFromFirestore('products', '123')
*/
export const getDocFromFirestore = async (collectionName: string, docId: string) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);
    let res = await getDoc(docRef);
    // console.log("getDocFromFirestore", res.data());
    return res.data();
  } catch (error) {
    console.log('getDocFromFirestore-error', error);
    return error;
  }
}

/**
* Get a single document from a collection where slug
* @param {String} collectionName - collection name
* @param {String} slug - document id
* @example getDocFromFirestoreWithSlug('posts', 'title-slug')
*/
export const getDocFromFirestoreWithSlug = async (collectionName: string, slug: string) => {
  try {
    const db = getFirestore();
    const q = query(collection(db, collectionName), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    let item: DocumentData;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      item = doc.data();
      item.id = doc.id;
    });


    // @ts-ignore
    return item
  } catch (error) {
    console.log('getDocFromFirestore-error', error);
    return error;
  }
}

/**
* Get a single document from a collection where slug
* @param {String} collectionName - collection name
* @param {String} tag - tag name
* @example getDocsMatchingTag('posts', 'nuxt-3')
*/
export const getDocsMatchingTag = async (collectionName: string, tag: string) => {
  try {
    const db = getFirestore();
    const q = query(collection(db, collectionName), where("tags", "array-contains", tag));
    const querySnapshot = await getDocs(q);
    let items = [];
    querySnapshot.forEach((doc) => {
      let item = doc.data();
      item.id = doc.id;
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      // @ts-ignore
      items.push(item)
    });
    return items
  } catch (error) {
    console.log('getDocFromFirestore-error', error);
    return error;
  }
}

/**
 * Delete a document in a collection
 * @param  {string} collectionName - the name of the collection
 * @param  {string} docId - document id
 */
export const deleteDocFromFirestore = async (collectionName: string, docId: string) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);
    let res = await deleteDoc(docRef);
    return res;
  } catch (error) {
    console.log('firebase-error', error);
    return error;
  }
}

/**
 * Update a document in a collection
 * @param {string} collectionName - the collection name
 * @param {string} uid - the document id
 * @param {object} data - the data to update
 * @example updateDocInFirestore('products', '123', { title: "test", body: "test" })
 */
export const updateDocInFirestore = async (collectionName: string, uid: string, data: any) => {
  try {
    const db = getFirestore();
    let res = await updateDoc(doc(db, collectionName, uid), data);
    return res;
  } catch (error) {
    console.log('updateDocInFirestore-error', error);
    return error;
  }
}

export const batchWrite = async (collectionName: string, items: any[]) => {
  console.log('batchWrite', items);
  const db = getFirestore();
  const batch = writeBatch(db);
  items.forEach((item: any) => {
    const docRef = doc(collection(db, collectionName));
    batch.set(docRef, item);
  });
  await batch.commit();
};

export const incrementPageView = async (collectionName: string, slug: string) => {
  const db = getFirestore();

  const q = query(collection(db, collectionName), where("slug", "==", slug));
  let item: DocumentData;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    item = doc.data();
    item.id = doc.id;
  });
// @ts-ignore
  const docRef = doc(db, "posts", item.id);
  let res = await updateDoc(docRef, { views: increment(1) })
  // console.log(res);
  return
}

function useRuntimeConfig() {
  throw new Error("Function not implemented.");
}
