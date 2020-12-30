const admin = require("firebase-admin");
const functions = require("firebase-functions");

const algoliasearch = require("algoliasearch");
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("actors");

admin.initializeApp();

const db = admin.firestore();

exports.addToIndex = functions.firestore
  .document(`actors/{actorId}`)
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectID = snapshot.id;
    return index.saveObject({ ...data, objectID });
  });

exports.updateIndex = functions.firestore
  .document(`actors/{actorId}`)
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({ ...newData, objectID });
  });

exports.deleteIndex = functions.firestore
  .document(`actors/{actorId}`)
  .onDelete((snapshot) => index.deleteBy({ objectID: snapshot.id }));

exports.exportActorsToJson = functions.https.onRequest((request, response) => {
  admin
    .firestore()
    .collection("actors")
    .get()
    .then(function(querySnapshot) {
      const actors = [];

      querySnapshot.forEach((doc) => {
        let whiteListedAttrs = {
          name: doc.data().name,
          description: doc.data().description,
        };
        actors.push(Object.assign({ objectID: doc.id }, whiteListedAttrs));
      });

      response.send(JSON.stringify(actors));
      return true;
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
      return false;
    });
});

exports.scheduledFunction = functions.pubsub
  .schedule("01 8,20 * * * ")
  .timeZone("America/Tegucigalpa")
  .onRun((context) => {
    db.doc("timers/timer1").update({ time: admin.firestore.Timestamp.now() });
    return console.log("This will be running at 8:01am and 8:01pm");
  });
