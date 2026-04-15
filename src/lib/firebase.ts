import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMLBmmfn2o68F3VuDNFgJKTFAF2tceJ3Y",
  authDomain: "cimp-aa1ec.firebaseapp.com",
  projectId: "cimp-aa1ec",
  appId: "1:51169924175:web:500c3e730e82943cd6063a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
