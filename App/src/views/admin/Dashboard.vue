<template>
  <div>
    <v-row>
      <div>
        <v-col>
          <DashBoardCard
            :title="'Total Visits'"
            color="primary"
            :data="String(totalVisits)"
            :icon="'mdi-cursor-default-click'"
          />
        </v-col>
        <v-col>
          <DashBoardCard
            :title="'Last visit'"
            color="warning"
            :data="latestVisit"
            :icon="'mdi-clock'"
          />
        </v-col>
      </div>
      <v-col cols="3">
        <v-card>
          <v-sheet class="v-sheet--offset" style="height: 300px" color="dark">
            <apexchart
              type="line"
              :options="getBarValues.options"
              :series="getBarValues.series"
            ></apexchart>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="4">
        <GmapMap
          :center="center"
          :zoom="10"
          map-type-id="terrain"
          style="height: 300px"
        >
          <GmapMarker
            :key="index"
            v-for="(m, index) in getLocations"
            :position="m.position"
            :clickable="true"
            :title="m.title"
            @click="center = m.position"
          />
        </GmapMap>
      </v-col>
      <div>
        <v-col>
          <DashBoardCard
            :title="'Total Blacklisted'"
            color="error"
            :data="String(Object.keys(this.$store.state.blacklist).length)"
            :icon="'mdi-account-cancel'"
          />
        </v-col>
        <v-col>
          <DashBoardCard
            :title="'Total Whitelisted'"
            color="success"
            :data="String(Object.keys(this.$store.state.whitelist).length)"
            :icon="'mdi-account-check'"
          />
        </v-col>
      </div>
    </v-row>
    <v-card>
      <v-card-title>
        Visitors
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-select
          :items="availableDates"
          label="Month Selection"
          v-model="currentDate"
        ></v-select>
        <v-btn @click="refreshData()">
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="this.$store.state.visitors"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr>
            <!-- <td v-if="$store.state.blacklist[item.id]">
              {{ $store.state.blacklist[item.id].label }}
            </td>
            <td v-else-if="$store.state.whitelist[item.id]">
              {{ $store.state.whitelist[item.id].label }}
            </td>
            <td v-else>No label</td> -->
            <td>
              <v-edit-dialog
                :return-value.sync="item.label"
                @save="save(item.id, item.label)"
              >
                {{ item.label }}
                <template v-slot:input>
                  <v-text-field
                    v-model="item.label"
                    label="Edit"
                    single-line
                    counter
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.visits.length }}</td>
            <td>{{ item.location.place }}</td>
            <td>{{ getMaxDate(item.visits) }}</td>
            <td>
              <v-chip
                class="ma-2"
                color="red"
                text-color="white"
                @click="deleteUser(item.id)"
              >
                Delete
              </v-chip>
              <v-chip
                v-if="!$store.state.blacklist[item.id]"
                class="ma-2"
                color="warning"
                text-color="white"
                @click="blacklistUser(item.id)"
              >
                Blacklist
              </v-chip>
              <v-chip
                v-else
                close
                class="ma-2"
                color="warning"
                text-color="white"
                @click:close="removeBlacklist(item.id)"
              >
                Blacklisted
              </v-chip>
              <v-chip
                v-if="!$store.state.whitelist[item.id]"
                class="ma-2"
                color="info"
                text-color="white"
                @click="whitelistUser(item.id)"
              >
                Whitelist
              </v-chip>
              <v-chip
                v-else
                close
                class="ma-2"
                color="success"
                text-color="white"
                @click:close="removeWhitelist(item.id)"
              >
                Whitelisted
              </v-chip>
              <v-chip
                class="ma-2"
                color="blue"
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
import DashBoardCard from "../../components/DashBoardCard";
import {
  getAllVisitorData,
  deleteVisitor,
  blacklist,
  whitelist,
  getBlacklist,
  getWhitelist,
  removeFromBlacklist,
  removeFromWhitelist,
  updateLabelFirebase,
} from "../../firebase_config";
import { getAllMonths, sameDay } from "../../utilities";
export default {
  data() {
    return {
      search: "",
      currentDate: this.$store.state.selectedDate,
      center: {
        lat: 43.263911,
        lng: -79.950365,
      },
    };
  },
  components: {
    DashBoardCard,
  },
  created() {
    this.refreshData();
  },
  methods: {
    async deleteUser(id) {
      await deleteVisitor(id);
    },
    blacklistUser(id) {
      blacklist(id);
    },
    whitelistUser(id) {
      whitelist(id);
    },
    removeBlacklist(id) {
      removeFromBlacklist(id);
    },
    removeWhitelist(id) {
      removeFromWhitelist(id);
    },
    refreshData() {
      getBlacklist();
      getWhitelist();
      getAllVisitorData(this.$store.state.selectedDate);
    },
    openPage(id) {
      this.$router.push(`/visit?id=${id}`);
    },
    getMaxDate(visitKeyMap) {
      let max = 0;
      for (const keyval of visitKeyMap) {
        if (keyval.time > max) {
          max = keyval.time;
        }
      }
      return new Date(max).toLocaleString();
    },
    save(id, label) {
      updateLabelFirebase(id, label);
    },
  },
  computed: {
    headers() {
      return [
        {
          text: "Label",
          value: "label",
        },
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Visits this month",
          value: "visits.length",
          filterable: false,
        },
        {
          text: "Location",
          value: "location.place",
        },
        {
          text: "Last Visit",
          value: `visits`,
        },
        {
          text: "Actions",
          filterable: false,
          sortable: false,
        },
      ];
    },
    totalVisits() {
      let totalCount = 0;
      for (const key of this.$store.state.visitors) {
        totalCount += key.visits.length;
      }
      return totalCount;
    },
    latestVisit() {
      let minDate = 0;
      for (const key of this.$store.state.visitors) {
        for (const visit of key.visits) {
          if (visit.time > minDate) {
            minDate = visit.time;
          }
        }
      }
      if (minDate != 0) {
        const newDate = new Date(minDate);
        return `${newDate.toDateString().substr(4)} | ${newDate
          .toLocaleString()
          .substr(11)}`;
      }
      return "No data";
    },
    getBarValues() {
      const arr1 = [];
      const arr2 = [];
      const final = {
        options: {
          xaxis: {
            categories: arr1,
            type: "datetime",
          },
          chart: {
            toolbar: {
              show: true,
              tools: {
                download: false,
                selection: false,
                zoom: true,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: true,
              },
            },
            height: "300px",
          },
          tooltip: {
            enabled: true,
            shared: true,
            followCursor: true,
            intersect: false,
            theme: false,
          },
        },
        series: [],
      };
      const today = new Date();
      const out = new Date();
      out.setMonth(out.getMonth() - 1);
      out.setDate(out.getDate() + 15);
      while (out <= today) {
        arr1.push(out.getTime());
        arr2.push(0);
        for (const key of this.$store.state.visitors) {
          for (const visit of key.visits) {
            if (sameDay(new Date(visit.time), out)) {
              const newVal = 1 + arr2.pop();
              arr2.push(newVal);
            }
          }
        }
        out.setDate(out.getDate() + 1);
      }
      final["options"]["xaxis"]["categories"] = arr1;
      final["series"] = [{ name: "Visits", data: arr2 }];
      // final["series"] =arr2;
      return final;
    },
    getLocations() {
      const arr = [];
      for (const key of this.$store.state.visitors) {
        arr.push({
          position: {
            lat: key.location.coordinates.latitude,
            lng: key.location.coordinates.longitude,
          },
          title: key.id,
        });
      }
      return arr;
    },
    availableDates() {
      return getAllMonths();
    },
  },
  watch: {
    currentDate(newVal) {
      this.$store.state.selectedDate = newVal;
      getAllVisitorData(newVal);
    },
  },
};
</script>
