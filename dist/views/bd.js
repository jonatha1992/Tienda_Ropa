// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-analytics.js";
/* import { 
        getDatabase,
        ref,
        onValue,
        onChildAdded,
        push,
        } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js"; */

import { getStorage, uploadBytes, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js"

const firebaseConfig = {
  apiKey: "AIzaSyAiUV_8h-5DXq243Xzv8pKIPM4fgN7faa0",
  authDomain: "unmillenceria.firebaseapp.com",
  databaseURL: "https://unmillenceria-default-rtdb.firebaseio.com",
  projectId: "unmillenceria",
  storageBucket: "unmillenceria.appspot.com",
  messagingSenderId: "246474988151",
  appId: "1:246474988151:web:aac0cb380619df75610472",
  measurementId: "G-7PCH118VJ7"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)

/* const db = getDatabase(); */

async function uploadFiles(file) {
  const storageRef = ref(storage, crypto.randomUUID())
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}


export { uploadFiles }