<template>
  <v-container class="px-12">
    <v-row class="pa-0 ma-0">
      <v-col cols="12">
        <h1>Zonas</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field label="Zona" v-model="newZone.name"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-btn color="primary" elevation="2" large @click="createZone()">
          Salvar
        </v-btn>
      </v-col>
    </v-row>

    <v-card
      class="mx-auto my-6"
      color="#26c6da"
      dark
      v-for="zone in zones"
      :key="zone.id"
    >
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title>{{ zone.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ zone.schedule }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import { zonesCollection, db } from "@/firebase";

export default {
  name: "Zones",
  mounted() {
    this.loadZones();
  },
  data() {
    return {
      zones: [],
      availableZones: [],
      coverageZone: "",
      availableCoverageZone: "",
      timeNow: "",
      dayNow: "",
      newZone: {
        name: "",
      },
    };
  },
  methods: {
    loadZones() {
      zonesCollection
        .where("deleted", "==", false)
        .where("active", "==", true)
        .onSnapshot((zones) => {
          const zonesArray = [];
          zones.docs.forEach((zone) => {
            zonesArray.push(Object.assign({ id: zone.id }, zone.data()));
          });
          this.zones = zonesArray;
        });
    },
    generateCoverageZoneObject() {
      if (confirm("¿Estás seguro de actualizar cobertura de zonas?")) {
        let tempText = "";
        let str1 = `{"type": "FeatureCollection", "features": [`;
        let str2 = "]}";
        zonesCollection
          .where("deleted", "==", false)
          .where("active", "==", true)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              tempText += `
            {"type": "Feature",
              "properties": {
                "name": "${doc.data().name}",
                "color": "${doc.data().color}",
              },
             ${doc.data().geoJson}
            },`;
            });
            const mainText = tempText.slice(0, -1);
            this.coverageZone = str1 + mainText + str2;
            this.updateSettingCoverZone(this.coverageZone);
          })
          .catch((err) => {
            console.log("error: ", err);
          });
      }
    },

    generateAvailableCoverageZoneObject1() {
      let tempText = "";
      let str1 = `{"type": "FeatureCollection", "features": [`;
      let str2 = "]}";

      this.availableZones.forEach((availableZone) => {
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
      this.availableCoverageZone = str1 + mainText + str2;
      // this.updateSettingAvailableCoverZone(this.availableCoverageZone);
    },
    updateSettingCoverZone(coverageZone) {
      db.collection("settingsTest")
        .doc("global")
        .update({
          coverageZone: coverageZone,
        })
        .then(() => {
          console.log("success!");
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    updateSettingAvailableCoverZone(availableCovergeZone) {
      db.collection("settingsTest")
        .doc("global")
        .update({
          availableCovergeZone: availableCovergeZone,
        })
        .then(() => {
          console.log("success!");
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    },
    getCurrentTimeAndDay() {
      let date = new Date();
      var weekday = new Array(7);
      weekday[0] = "sunday";
      weekday[1] = "monday";
      weekday[2] = "tuesday";
      weekday[3] = "wednesday";
      weekday[4] = "thursday";
      weekday[5] = "friday";
      weekday[6] = "saturday";

      this.dayNow = weekday[date.getDay()];

      let h = this.hours_with_leading_zeros(date);
      let m = this.minutes_with_leading_zeros(date);
      let s = this.seconds_with_leading_zeros(date);

      this.timeNow = `${h}:${m}:${s}`;
    },

    availableZoneChecker() {
      let availableZonesArray = [];
      this.getCurrentTimeAndDay();
      this.zones.forEach((zone) => {
        let schedule = zone.schedule;
        if (schedule) {
          let times = schedule[this.dayNow];
          if (!times || times.length == 0) {
            availableZonesArray.push(zone);
          } else {
            times.forEach((time) => {
              if (
                time.availableFrom < this.timeNow &&
                time.availableTo > this.timeNow
              ) {
                availableZonesArray.push(zone);
              }
            });
          }
        } else {
          availableZonesArray.push(zone);
        }
      });
      this.availableZones = availableZonesArray;
      // this.generateAvailableCoverageZoneObject1();
    },
    minutes_with_leading_zeros(date) {
      return (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    },
    hours_with_leading_zeros(date) {
      return (date.getHours() < 10 ? "0" : "") + date.getHours();
    },
    seconds_with_leading_zeros(date) {
      return (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
    },
    createZone() {
      this.newZone.deleted = false;
      this.newZone.active = true;

      zonesCollection
        .add(this.newZone)
        .then(() => {
          console.log("success!");
          this.newZone.name = "";
        })
        .catch((err) => {
          console.log("err!", err);
        });
    },
  },
};
</script>

<style></style>
