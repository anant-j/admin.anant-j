import * as firebase from "firebase";
import store from './store';

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
export function getAllVisitorData(dateString){
    const final=[];
    db.collection(dateString).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = JSON.parse(JSON.stringify(doc.data()));
            data["id"] = doc.id;
            final.push(data);
        });
    });
    store.state.visitors["dated"] = dateString;
    store.state.visitors["data"] = final;
}

