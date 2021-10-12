<template>
  <div>
    <v-card>
      <v-card-title>
        Blacklist
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-btn @click="updateBlackList()">
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="blacklist"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.blackListedBy }}</td>
            <td>{{ item.blackListedFor }}</td>
            <td>{{ new Date(item.blackListedOn.seconds*1000).toLocaleString() }}</td>
            <td><v-icon
        small
        class="mr-2"
        @click="remove(item.id)"
      >
        mdi-delete
      </v-icon></td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getBlacklist, removeFromBlacklist } from "../../firebase_config";
export default {
  data() {
    return {
        blacklist:[]
    };
  },
  components: {
  },
  created() {
    this.updateBlackList();
  },
  methods: {
      remove(id){
        removeFromBlacklist(id);
        this.updateBlackList();
      },
      async updateBlackList(){
        this.blacklist=await getBlacklist();
      }
  },
  computed: {
        headers() {
      return [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Blacklisted By",
          value: "",
          filterable: false,
        },
        {
          text: "Blacklisted For",
          value: "",
        },
        {
          text: "Blacklisted on",
          value: ``,
        },
         {
          text: "Actions",
        },
      ];
    },
  },
};
</script>
