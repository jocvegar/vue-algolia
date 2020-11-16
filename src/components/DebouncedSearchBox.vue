<template>
  <input type="search" v-model="query" class="ais-SearchBox-input" />
</template>

<script>
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { createWidgetMixin } from 'vue-instantsearch';
export default {
  mixins: [createWidgetMixin({ connector: connectSearchBox })],
  props: {
    delay: {
      type: Number,
      default: 500,
      required: false,
    },
  },
  data() {
    return {
      timerId: null,
      localQuery: '',
    };
  },
  destroyed() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  },
  computed: {
    query: {
      get() {
        return this.localQuery;
      },
      set(val) {
        this.localQuery = val;
        if (this.timerId) {
          clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(() => {
          this.state.refine(this.localQuery);
        }, this.delay);
      },
    },
  },
};
</script>

<style>
.ais-Highlight-highlighted {
  background: #EF6A25;
  font-style: normal;
  color:rgb(245, 245, 245);
}
</style>
