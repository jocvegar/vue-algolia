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
    <ais-instant-search :search-client="searchClient" index-name="actors">
        <v-container>
            <v-row justify="space-between" class="px-3">
                <v-col cols="12">
                    <ais-search-box>
                        <div slot="submit-icon">🔎</div>
                        <div slot="reset-icon">🚫</div>
                    </ais-search-box>
                </v-col>
            </v-row>
        </v-container>
        <v-spacer></v-spacer>
        <ais-hits>
          <v-list-item two-line slot="item" slot-scope="{ item }">
            <v-list-item-content>
                <v-list-item-title>
                    <ais-highlight attribute="name" :hit="item" />
                </v-list-item-title>
                <v-list-item-subtitle>
                  <ais-highlight attribute="description" :hit="item" />
                </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </ais-hits>

         <ais-state-results>
          <template slot-scope="{ state: { query }, results: { hits } }">
            <!-- show no result if query with no hits -->
            <div v-if="query && hits.length == 0">
              <h2 class="text-center mt-5  blue-grey--text text--darken-2">
                ¡No hay nada!
              </h2>
            </div>
            <div v-else></div>
          </template>
        </ais-state-results>
        <v-spacer></v-spacer>
    </ais-instant-search>    
  </v-container>
</template>

<script>
import { firebase, actorsCollection } from "@/firebase"
import algoliasearch from 'algoliasearch/lite';
export default {
  name: 'HelloWorld',
  data() {
    return {
      searchQuery: "",
      actors: [],
      actorName: "",
      searchClient: algoliasearch(
        process.env.VUE_APP_ALGOLIA_ID,
        process.env.VUE_APP_ALGOLIA_KEY,
      ),
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
        this.$router.go()
        this.forceRerender()
      }).catch(error => console.log("error: ", error))
    },
  }
}
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css");

.ais-SearchBox-input {
  padding: .5em 2.25em;
}
.ais-SearchBox-submit {
  padding-bottom: 1.5rem;
  padding-left: .5rem;
}
.ais-SearchBox-reset {
  padding-bottom: 1.5rem;
  padding-right: 1.5rem;
}
</style>
