<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"  class="mb-4">
        <h2 class="font-weight-bold mb-3">
          Algolia POC by {{name}}
        </h2>
      </v-col>
      <v-col  cols="12" class="mb-4">
        <p class="font-weight-bold mb-3">
          Ecosystem
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => ({
      name: "JOSE"
    }),
  }
</script>
