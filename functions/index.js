const moment = require("moment-timezone");

const admin = require("firebase-admin");
const functions = require("firebase-functions");

const algoliasearch = require("algoliasearch");
const APP_ID = "functions.config().algolia.app";
const ADMIN_KEY = "functions.config().algolia.key";

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("actors");
let dayNow = "";
let timeNow = "";

admin.initializeApp();

const db = admin.firestore();
const { AlphaAnalyticsDataClient } = require("@google-analytics/data");
const keyFilename = "./credentials.json";

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
    getCurrentDayAndTime();
    let availableZonesArray = [];

    db.collection("zones")
      .where("deleted", "==", false)
      .where("active", "==", true)
      .get()
      .then((zones) => {
        zones.docs.forEach((zone) => {
          let schedule = zone.data().schedule;
          if (schedule) {
            let times = schedule[dayNow];
            if (!times || times.length == 0) {
              availableZonesArray.push(zone.data());
            } else {
              times.forEach((time) => {
                if (
                  time.availableFrom < timeNow &&
                  time.availableTo > timeNow
                ) {
                  availableZonesArray.push(zone.data());
                }
              });
            }
          } else {
            availableZonesArray.push(zone.data());
          }
        });
        generateAvailableCoverageZoneObject(availableZonesArray);
      })
      .catch(function(error) {
        console.error("Error: ", error);
        return false;
      });

    return console.log("availableCovergeZone updated!");
  });

getCurrentDayAndTime = () => {
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

generateAvailableCoverageZoneObject = (availableZones) => {
  let tempText = "";
  let str1 = `{"type": "FeatureCollection", "features": [`;
  let str2 = "]}";

  availableZones.forEach((availableZone) => {
    tempText += `
			{"type": "Feature",
				"properties": {
					"name": "${availableZone.name}",
					"color": "${availableZone.color}",
				},
				${availableZone.geoJson}
			},`;
  });
  const mainText = tempText.slice(0, -1);
  let availableCoverageZone = str1 + mainText + str2;
  updateSettingAvailableCoverZone(availableCoverageZone);
};

updateSettingAvailableCoverZone = (availableCovergeZone) => {
  db.collection("settingsTest")
    .doc("global")
    .update({
      availableCovergeZone: availableCovergeZone,
    })
    .then(() => {
      console.log("updated succesfully!");
    })
    .catch((err) => {
      console.log("error: ", err);
    });
};

exports.zoneAfterSave = functions.firestore
  .document(`zones/{zoneId}`)
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectID = snapshot.id;
    console.log("data", data);
    console.log("objectID", objectID);

    db.collection("zones")
      .doc(objectID)
      .update({
        updated: "Noty tu me escuchas?",
      })
      .then(() => {
        console.log("updated succesfully!");
      })
      .catch((err) => {
        console.log("error: ", err);
      });

    return "";
  });

exports.analytics = functions.https.onRequest((request, response) => {
  runReport()
    .then((data) => {
      return response.send(JSON.stringify(data));
    })
    .catch((error) => {
      console.log("error :>> ", error);
      return response.status(500).send(error);
    });
});

runReport = async () => {
  const analyticsDataClient = new AlphaAnalyticsDataClient({
    keyFilename,
  });

  const [response] = await analyticsDataClient.runReport({
    entity: {
      propertyId: "252786671",
    },
    dateRanges: [
      {
        startDate: "2020-03-31",
        endDate: "today",
      },
    ],
    dimensions: [
      {
        name: "city",
      },
      {
        name: "platform",
      },
    ],
    metrics: [
      {
        name: "activeUsers",
      },
    ],
  });
  return response;
};
