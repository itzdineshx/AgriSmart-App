// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAevXiK95LZlZ2LuRWHpJQRx-unnXx6C3U",
  authDomain: "duckduckgo-search-game.firebaseapp.com",
  projectId: "duckduckgo-search-game",
  storageBucket: "duckduckgo-search-game.firebasestorage.app",
  messagingSenderId: "248385871471",
  appId: "1:248385871471:web:5d0f7c81420e674613779a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;