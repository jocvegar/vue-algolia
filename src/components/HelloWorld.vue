<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12"  class="mb-1">
        <h2 class="font-weight-bold">
          Algolia POC by {{user.name}}
        </h2>
      </v-col>
      <v-btn @click="addProduct()"> 
        Add product
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
    
    <v-list-item two-line v-for="product in products" :key="product.id">
      <v-list-item-content>
        <v-list-item-title>{{product.name}}</v-list-item-title>
        <v-list-item-subtitle>{{product.description}}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    
  </v-container>
</template>

<script>

import { firebase, productsCollection } from "@/firebase"

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
      products: []
    }
  },
  created() {
    this.getProducts()
  },
  methods: {
    getProducts() {
      productsCollection
      .orderBy("createdAt", "desc")
      .get()
      .then(products => {
        const productsArray = []
        products.docs.forEach(product => {
          productsArray.push(Object.assign({id: product.id}, product.data()))
        })
        this.products = productsArray
      })
    },
    addProduct() {
      productsCollection.add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        description: this.$faker().commerce.productDescription(),
        name: this.$faker().commerce.product(),
      }).then(() => {
        this.getProducts()
      }).catch(error => console.log("error: ", error))
    }
  }
}
</script>
