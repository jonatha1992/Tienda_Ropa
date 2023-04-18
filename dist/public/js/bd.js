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
  apiKey: "AIzaSyD16cBwNmCcxcLOdJg-MT68NVjJMp_TPN8",
  authDomain: "unmil-f0fee.firebaseapp.com",
  projectId: "unmil-f0fee",
  storageBucket: "unmil-f0fee.appspot.com",
  messagingSenderId: "365850853178",
  appId: "1:365850853178:web:30eddb1839d3b3310d1a03",
  measurementId: "G-036BPBNNXS"
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


export function TraerProductos() {
  url = "/productos";
  let productos
  fetch(url)
    .then((response) => response.json())
    .then((datos) => {
      productos = datos;
    });

  return productos  
}