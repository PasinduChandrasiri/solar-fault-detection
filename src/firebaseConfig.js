import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByffkjtGLbvrwGh_lmg1Ve91EADk-FjbU",
  authDomain: "solar-fault-detection-27f84.firebaseapp.com",
  databaseURL: "https://solar-fault-detection-27f84-default-rtdb.firebaseio.com",
  projectId: "solar-fault-detection-27f84",
  storageBucket: "solar-fault-detection-27f84.firebasestorage.app",
  messagingSenderId: "1057240982455",
  appId: "1:1057240982455:web:95b3cf8dadc693217a7e32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);