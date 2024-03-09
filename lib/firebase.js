import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8i98FU8n4QFj3YtJ0EoOkCtgfT1rj6Dk",
  authDomain: "foodiesapp-370a4.firebaseapp.com",
  projectId: "foodiesapp-370a4",
  storageBucket: "foodiesapp-370a4.appspot.com",
  messagingSenderId: "952082028826",
  appId: "1:952082028826:web:fd9dffbe46dda936e834a3",
  measurementId: "G-VSP79YYLPR",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
