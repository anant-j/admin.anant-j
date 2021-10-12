import * as firebase from "firebase";
import store from "./store";

const configOptions = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_ID,
};

firebase.initializeApp(configOptions);

export default firebase;
var db = firebase.firestore();
export async function getAllVisitorData(dateString) {
  const final = [];
  store.state.visitors = [];
  await db
    .collection(dateString)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = JSON.parse(JSON.stringify(doc.data()));
        data["id"] = doc.id;
        final.push(data);
      });
    });
  store.state.visitors = final;
}

export async function getBlacklist() {
  const final = {};
  await db
    .collection("Blacklist")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = JSON.parse(JSON.stringify(doc.data()));
        data["id"] = doc.id;
        final[doc.id] = data;
      });
    });
  store.state.blacklist = final;
}

export async function getWhitelist() {
  const final = {};
  await db
    .collection("Whitelist")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = JSON.parse(JSON.stringify(doc.data()));
        data["id"] = doc.id;
        final[doc.id] = data;
      });
    });
  store.state.whitelist = final;
}

export async function deleteVisitor(visitorId) {
  await db
    .collection(store.state.selectedDate)
    .doc(visitorId)
    .delete();
  await getAllVisitorData(store.state.selectedDate);
}

export function blacklist(visitorId) {
  var confirmation = confirm(`Blacklist: ${visitorId}?`);
  if (!confirmation) return;
  var label = prompt("Please enter a label");
  while (!label) {
    alert("You must enter a label");
    label = prompt("Please enter a label");
    return;
  }
  db.collection("Whitelist")
    .doc(visitorId)
    .delete();
  db.collection("Blacklist")
    .doc(visitorId)
    .set({
      blackListedFor: store.state.selectedDate,
      blackListedOn: new Date(),
      blackListedBy: store.state.auth.user.data.email,
      label: label,
    });
  getBlacklist();
  getWhitelist();
}

export function removeFromBlacklist(visitorId) {
  var confirmation = confirm(`Remove from Blacklist: ${visitorId}?`);
  if (!confirmation) return;
  db.collection("Blacklist")
    .doc(visitorId)
    .delete();
  getBlacklist();
}

export function whitelist(visitorId) {
  var confirmation = confirm(`Whitelist: ${visitorId}?`);
  if (!confirmation) return;
  var label = prompt("Please enter a label");
  while (!label) {
    alert("You must enter a label");
    label = prompt("Please enter a label");
    return;
  }
  db.collection("Blacklist")
    .doc(visitorId)
    .delete();
  db.collection("Whitelist")
    .doc(visitorId)
    .set({
      whitelistedOn: new Date(),
      whitelistedBy: store.state.auth.user.data.email,
      label: label,
    });
  getBlacklist();
  getWhitelist();
}

export function removeFromWhitelist(visitorId) {
  var confirmation = confirm(`Remove from Whitelist: ${visitorId}?`);
  if (!confirmation) return;
  db.collection("Whitelist")
    .doc(visitorId)
    .delete();
  getWhitelist();
}
