<template>
  <div>
    <v-card>
      <v-card-title>
        Whitelist
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-btn @click="updateWhiteList()">
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="whitelist"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.label }}</td>
            <td>{{ item.id }}</td>
            <td>{{ item.whitelistedBy }}</td>
            <td>
              {{ new Date(item.whitelistedOn.seconds * 1000).toLocaleString() }}
            </td>
            <td>
              <v-icon small class="mr-2" @click="remove(item.id)">
                mdi-delete
              </v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { getWhitelist, removeFromWhitelist } from "../../firebase_config";
export default {
  data() {
    return {
      search: "",
      whitelist: [],
    };
  },
  components: {},
  created() {
    this.updateWhiteList();
  },
  methods: {
    remove(id) {
      removeFromWhitelist(id);
      this.updateWhiteList();
    },
    async updateWhiteList() {
      this.whitelist = await getWhitelist();
    },
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
          text: "Whitelisted By",
          value: "",
          filterable: false,
        },
        {
          text: "Whitelisted on",
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
