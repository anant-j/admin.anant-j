import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import store from "./store";

const configOptions = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_ID,
};

const firebaseApp = initializeApp(configOptions);
export const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export async function getAllVisitorData(dateString) {
  const final = [];
  store.state.visitors = [];
  const querySnapshot = await getDocs(collection(db, dateString));
  querySnapshot.forEach((doc) => {
    const data = JSON.parse(JSON.stringify(doc.data()));
    data["id"] = doc.id;
    final.push(data);
  });
  store.state.visitors = final;
}

export async function getBlacklist() {
  const final = {};
  const querySnapshot = await getDocs(collection(db, "Blacklist"));
  querySnapshot.forEach((doc) => {
    const data = JSON.parse(JSON.stringify(doc.data()));
    data["id"] = doc.id;
    final[doc.id] = data;
  });
  store.state.blacklist = final;
}

export async function getWhitelist() {
  const final = {};
  const querySnapshot = await getDocs(collection(db, "Whitelist"));
  querySnapshot.forEach((doc) => {
    const data = JSON.parse(JSON.stringify(doc.data()));
    data["id"] = doc.id;
    final[doc.id] = data;
  });
  store.state.whitelist = final;
}

export async function deleteVisitor(visitorId) {
  await deleteDoc(doc(db, store.state.selectedDate, visitorId));
  await getAllVisitorData(store.state.selectedDate);
}

export async function blacklist(visitorId) {
  const confirmation = confirm(`Blacklist: ${visitorId}?`);
  if (!confirmation) return;
  let label = prompt("Please enter a label");
  while (!label) {
    alert("You must enter a label");
    label = prompt("Please enter a label");
    return;
  }
  await deleteDoc(doc(db, "Whitelist", visitorId));
  const dbref = doc(db, "Blacklist", visitorId);
  setDoc(
    dbref,
    {
      blackListedFor: store.state.selectedDate,
      blackListedOn: new Date(),
      blackListedBy: store.state.auth.user.data.email,
      label: label,
    },
    { merge: true }
  );
  getBlacklist();
  getWhitelist();
}

export async function removeFromBlacklist(visitorId) {
  const confirmation = confirm(`Remove from Blacklist: ${visitorId}?`);
  if (!confirmation) return;
  await deleteDoc(doc(db, "Blacklist", visitorId));
  getBlacklist();
}

export async function whitelist(visitorId) {
  const confirmation = confirm(`Whitelist: ${visitorId}?`);
  if (!confirmation) return;
  let label = prompt("Please enter a label");
  while (!label) {
    alert("You must enter a label");
    label = prompt("Please enter a label");
    return;
  }
  await deleteDoc(doc(db, "Blacklist", visitorId));
  const dbref = doc(db, "Whitelist", visitorId);
  setDoc(
    dbref,
    {
      whitelistedOn: new Date(),
      whitelistedBy: store.state.auth.user.data.email,
      label: label,
    },
    { merge: true }
  );
  getBlacklist();
  getWhitelist();
}

export async function removeFromWhitelist(visitorId) {
  const confirmation = confirm(`Remove from Whitelist: ${visitorId}?`);
  if (!confirmation) return;
  await deleteDoc(doc(db, "Whitelist", visitorId));
  getWhitelist();
}
