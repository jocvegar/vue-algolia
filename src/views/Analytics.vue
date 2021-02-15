<template>
  <v-container>
    <h4>Analytics</h4>
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
    fetch("http://localhost:5001/algolia-poc/us-central1/analytics")
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log("error ", error));
  },
};
</script>

<style></style>
