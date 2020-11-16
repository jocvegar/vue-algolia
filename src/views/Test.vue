<template>
    <div class="vis-container">
        <ais-instant-search :search-client="searchClient" index-name="products">
            <v-container>
                <v-row justify="space-between">
                    <v-col cols="12" md="8">
                        <!-- <ais-search-box>
                            <div slot="submit-icon">🔎</div>
                            <div slot="reset-icon">🚫</div>
                        </ais-search-box> -->
                        <ais-search-box>
                            <app-debounced-search-box 
                                :delay="1000"
                                placeholder="buscar dentro de 3,291 productos..."/>
                        </ais-search-box>
                    </v-col>
                    <v-col cols="12" md="4">
                        <ais-hits-per-page class="pl-2"
                            :items="[
                                { label: '16 por págnia', value: 16, default: true },
                                { label: '32 por págnia', value: 32 },
                            ]"
                        />
                    </v-col>
                </v-row>
            </v-container>
            <v-spacer></v-spacer>
            <ais-hits>
                <div slot="item" slot-scope="{ item }">
                    <v-list-item-content>
                        <v-list-item-title>
                           <ais-highlight attribute="name" :hit="item" />
                        </v-list-item-title>
                    </v-list-item-content>
                </div>
            </ais-hits>
            <v-spacer></v-spacer>
            <ais-pagination 
                :total-pages="5"
                :padding="2" 
            />
        </ais-instant-search>
    </div>
</template>

<script>
import algoliasearch from 'algoliasearch/lite';
import AppDebouncedSearchBox from '@/components/DebouncedSearchBox';

export default {
  name: 'Test',
  components: {
    AppDebouncedSearchBox,
  },
  data() {
    return {
      searchClient: algoliasearch(
        process.env.VUE_APP_ALGOLIA_ID,
        process.env.VUE_APP_ALGOLIA_KEY,
      ),
    };
  },
};
</script>

<style>
@import url("https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/reset-min.css");
@import url("https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css");

body {
  font-family: sans-serif;
  padding: 1em;
}
.ais-Hits-list {
  margin-top: 0;
  margin-bottom: 1em;
}
.ais-HitsPerPage-select {
    padding: .25em 3em .25em 2em;
}
.ais-SearchBox-input {
    padding: 0.25em 0.7em;
}
.pagination {
  margin: 4rem auto;
  text-align: center;
}
</style>
