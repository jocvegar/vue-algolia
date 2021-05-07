<template>
  <v-container>
    <h4>Playground</h4>

    <v-btn @click="addDocument()" color="primary" elevation="2">
      Add record
    </v-btn>
  </v-container>
</template>

<script>
import { firebase, db } from "@/firebase";

export default {
  name: "Playground",
  methods: {
    async addDocument() {
      let document = await db
        .collection("ledgers")
        .where("source_id", "==", "product_id")
        .limit(1)
        .get();

      if (document && document.docs.length > 0) {
        db.collection("ledgers")
          .doc(document.docs[0].id)
          .update({
            ledger: firebase.firestore.FieldValue.arrayUnion({
              action: "add",
              user_id: "carlos_vega_12345",
              updatedAt: firebase.firestore.Timestamp.now(),
            }),
          });
      } else {
        db.collection("ledgers").add({
          source_id: "product_id",
          source_type: "product",
          ledger: [
            {
              action: "update",
              user_id: "jose_vega_12345",
              updatedAt: firebase.firestore.Timestamp.now(),
            },
          ],
        });
      }
    },
  },
};
</script>
