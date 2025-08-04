import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCqwQo9BY6k8D9NtVCo8j7aRvpUwQJQhxU",
  authDomain: "m-vintage.firebaseapp.com",
  projectId: "m-vintage",
  storageBucket: "m-vintage.firebasestorage.app",
  messagingSenderId: "113636360936",
  appId: "1:113636360936:web:fb4be699caed8e888abf5d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
