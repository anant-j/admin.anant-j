<template>
  <v-card :color="color" elevation="15" outlined style="width: 100%">
    <v-card-subtitle class="white--text">
      <h2>{{ title }}</h2>
    </v-card-subtitle>
    <v-card-title>
      <v-icon color="white" left>{{ icon }}</v-icon>
      <h3 class="white--text" v-html="data"></h3>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    color: String,
    data: String,
    icon: String,
  },
};
</script>
