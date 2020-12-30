<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/search.png"
          transition="scale-transition"
          width="40"
          @click="goHome()"
        />
        <v-toolbar-title
          @click="goHome()"
          class="shrink mt-1 hidden-sm-and-down font-weight-bold"
        >
          Algolia POC
        </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <router-link class="white--text mx-5" to="/test">Test</router-link> |
      <router-link class="white--text mx-5" to="/test2">Test 2</router-link> |
      <router-link class="white--text mx-5" to="/zones">Zones</router-link>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({}),
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>
