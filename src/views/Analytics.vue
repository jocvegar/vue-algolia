<template>
  <v-container>
    <h4>Analytics</h4>
    <hr />
    <div v-if="data">
      <div v-for="row in data.rows" :key="row.value">
        {{ row }}
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Analytics",
  data() {
    return {
      data: null,
    };
  },
  mounted() {
    fetch("https://us-central1-algolia-poc.cloudfunctions.net/analytics")
      .then((response) => response.json())
      .then((data) => (this.data = data))
      .catch((error) => console.log("error ", error));
  },
};
</script>
