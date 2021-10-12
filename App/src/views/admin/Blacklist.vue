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
        :items="Object.values(this.$store.state.blacklist)"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.label }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.blackListedBy }}</td>
            <td>{{ item.blackListedFor }}</td>
            <td>
              {{ new Date(item.blackListedOn.seconds * 1000).toLocaleString() }}
            </td>
            <td>
              <v-chip
                class="ma-2"
                color="info"
                text-color="white"
                @click="remove(item.id)"
              >
                Blacklisted
              </v-chip>
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                @click="openPage(item.id)"
              >
                Open
              </v-chip>
            </td>
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
      search: "",
    };
  },
  components: {},
  created() {
    this.updateBlackList();
  },
  methods: {
    remove(id) {
      removeFromBlacklist(id);
      this.updateBlackList();
    },
    async updateBlackList() {
      await getBlacklist();
    },
    openPage(id){
              this.$router.push(`/visit?id=${id}`);
    }
  },
  computed: {
    headers() {
      return [
        {
          text: "Label",
        },
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Blacklisted By",
          value: "",
          filterable: true,
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
