import moment from "moment-timezone";

const admin = require("firebase-admin");
const functions = require("firebase-functions");

const algoliasearch = require("algoliasearch");
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("actors");
let dayNow = "";
let timeNow = "";

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

exports.scheduledAvailabeZonesaFunction = functions.pubsub
  .schedule("01 8,20 * * * ")
  .timeZone("America/Tegucigalpa")
  .onRun((context) => {
    generateCurrentDayAndTime();
    console.log("context", context);
    // db.collection("zones")
    //   .where("deleted", "==", false)
    //   .where("active", "==", true)
    //   .get()
    //   .then((zones) => {
    //     const zonesArray = [];
    //     zones.docs.forEach((zone) => {
    //       zonesArray.push(Object.assign({ id: zone.id }, zone.data()));
    //     });
    //   })
    //   .catch(function(error) {
    //     console.error("Error: ", error);
    //     return false;
    //   });

    // db.doc("timers/timer1").update({ time: admin.firestore.Timestamp.now() });
    // return console.log("This will be running at 8:01am and 8:01pm");
  });

generateCurrentDayAndTime = () => {
  let arr = moment()
    .tz("America/Tegucigalpa")
    .format("YYYY, MM, DD, HH, mm, ss, 0")
    .split(",");

  let date = new Date(
    parseInt(arr[0]),
    parseInt(arr[1]) - 1,
    parseInt(arr[2]),
    parseInt(arr[3]),
    parseInt(arr[4]),
    parseInt(arr[5]),
    parseInt(arr[6])
  );

  let weekday = new Array(7);
  weekday[0] = "sunday";
  weekday[1] = "monday";
  weekday[2] = "tuesday";
  weekday[3] = "wednesday";
  weekday[4] = "thursday";
  weekday[5] = "friday";
  weekday[6] = "saturday";

  dayNow = weekday[date.getDay()];

  let h = hours_with_leading_zeros(date);
  let m = minutes_with_leading_zeros(date);
  let s = seconds_with_leading_zeros(date);

  timeNow = `${h}:${m}:${s}`;

  console.log("dayNow ", dayNow);
  console.log("timeNow ", timeNow);
};

minutes_with_leading_zeros = (date) => {
  return (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
};

hours_with_leading_zeros = (date) => {
  return (date.getHours() < 10 ? "0" : "") + date.getHours();
};

seconds_with_leading_zeros = (date) => {
  return (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
};
