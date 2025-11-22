// src/lib/firebase.js

// 1. Importa a função de inicialização
import { initializeApp, getApps, getApp } from "firebase/app";

// 2. Define as configurações puxando das variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// 3. Inicializa o Firebase (evita erro de "app already initialized" no Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 4. Exporta o app para usar nas outras páginas
export { app };