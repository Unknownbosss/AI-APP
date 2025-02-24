import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter((key) => !import.meta.env[key]);

if (missingEnvVars.length > 0) {
  console.warn(
    `Missing Firebase configuration. The following environment variables are required:\n` +
      missingEnvVars.map((key) => `- ${key}`).join("\n") +
      `\n\nPlease add these to your environment variables to enable authentication.`
  );
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
