<template>
  <v-container>
    <div class="vis-container">
      <ais-instant-search :search-client="searchClient" index-name="products">
        <ais-autocomplete>
          <div slot-scope="{ currentRefinement, indices, refine }">
            <v-text-field
              :value="currentRefinement"
              label="🔎 buscar productos"
              outlined
              clearable
              @input="refine($event)"
            ></v-text-field>
            <div v-if="currentRefinement">
              <div v-for="index in indices" :key="index.label">
                <v-list-item v-for="hit in index.hits" :key="hit.objectID">
                  <v-list-item-content>
                    <v-list-item-title>
                      <ais-highlight attribute="name" :hit="hit" />
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </div>
            </div>
          </div>
        </ais-autocomplete>
      </ais-instant-search>
    </div>
  </v-container>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
// import AppDebouncedSearchBox from '@/components/DebouncedSearchBox';

export default {
  name: 'Test2',
  // components: {
  //   AppDebouncedSearchBox,
  // },
  data() {
    return {
      searchClient: algoliasearch(
        process.env.VUE_APP_ALGOLIA_ID,
        process.env.VUE_APP_ALGOLIA_KEY,
      ),
    };
  },
  methods: {
    clearStuff() {
      console.log("HI")
      document.querySelectorId
    }
  }
};
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/reset-min.css");
@import url("https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css");

body {
  font-family: sans-serif;
  padding: 1em;
}
</style>
