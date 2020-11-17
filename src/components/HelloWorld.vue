<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"  class="mb-1">
        <h2 class="font-weight-bold">
          Algolia POC
        </h2>
      </v-col>
      <v-btn @click="addActor()" class="mx-auto" color="primary" elevation="5"> 
        Add actor {{actorName}} 
      </v-btn>
    </v-row>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="8" offset="2">
            <v-text-field
              v-model="searchQuery"
              label="Search"
              outlined
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    
    <v-list-item two-line v-for="actor in actors" :key="actor.id">
      <v-list-item-content>
        <v-list-item-title>{{actor.name}}</v-list-item-title>
        <v-list-item-subtitle>{{actor.description}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    
  </v-container>
</template>

<script>

import { firebase, actorsCollection } from "@/firebase"

export default {
  name: 'HelloWorld',
  data() {
    return {
      searchQuery: "",
      actors: [],
      actorName: ""
    }
  },
  created() {
    this.getActors()
  },
  methods: {
    getActors() {
      actorsCollection
      .orderBy("createdAt", "desc")
      .get()
      .then(actors => {
        const actorsArray = []
        actors.docs.forEach(actor => {
          actorsArray.push(Object.assign({id: actor.id}, actor.data()))
        })
        this.actors = actorsArray
        this.actorName = this.$faker().name.findName()
      })
    },
    addActor() {
      actorsCollection.add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        description: this.$faker().lorem.sentence(),
        name: this.actorName,
      }).then(() => {
        this.getActors()
      }).catch(error => console.log("error: ", error))
    }
  }
}
</script>
