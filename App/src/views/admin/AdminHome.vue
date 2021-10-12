<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item v-for="(menu, index) in menus" :key="index" @click="goto(menu.path)">
            <v-list-item-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Anant-j</v-toolbar-title>
      <v-spacer />
      <v-btn text icon @click="dark = !dark">
        <v-icon>{{ dark ? 'mdi-brightness-4' : 'mdi-brightness-6'}}</v-icon>
      </v-btn>
      <v-btn text @click="logOut()">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col>
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import firebase from 'firebase';

export default {
  data: () => ({
    dark: false,
    path: '/',
    drawer: false,
    menus: [
      { path: '', title: 'Dashboard', icon: 'mdi-view-dashboard' },
      { path: 'blacklist', title: 'Blacklist', icon: 'mdi-account-cancel' },
      { path: 'whitelist', title: 'Whitelist', icon: 'mdi-account-check' },
    ]
  }),
  created(){
    this.dark =  this.$store.state.config.dark;
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace({path: '/login'});
        });
    },
    goto(newPath) {
      this.$router.push({path: this.path + newPath}).catch(()=>{});
    }
  },
  watch: {
    dark: function() {
      this.$store.state.config.dark = this.dark;
      this.$vuetify.theme.dark = this.dark;
    }
  }
}
</script>