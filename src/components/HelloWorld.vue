<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"  class="mb-1">
        <h2 class="font-weight-bold">
          Algolia POC by {{user.name}}
        </h2>
      </v-col>
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
  </v-container>
</template>

<script>

export default {
  name: 'HelloWorld',
  data() {
    return {
      user: {
        name: this.$faker().name.findName(),
        email: this.$faker().internet.email(),
        company: this.$faker().company.companyName(),
      },
      searchQuery: "",
    }
  },

}
</script>
