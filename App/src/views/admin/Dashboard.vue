<template>
  <div>
    <v-row>
      <div>
        <v-col>
          <DashBoardCard
            :title="
              'Total Visits This Month (' + this.$store.state.selectedDate + ')'
            "
            color="primary"
            :data="String(totalVisits)"
            :icon="'mdi-cursor-default-click'"
          />
        </v-col>
        <v-col>
          <DashBoardCard
            :title="'Last visit on'"
            color="warning"
            :data="latestVisit"
            :icon="'mdi-clock'"
          />
        </v-col>
      </div>
      <v-col cols="3">
        <v-card>
          <v-sheet class="v-sheet--offset" style="height:300px" color="dark">
            <apexchart
              type="line"
              :options="getBarValues.options"
              :series="getBarValues.series"
            ></apexchart>
          </v-sheet>
        </v-card>
      </v-col>
      <v-col cols="3">
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
        :items="this.$store.state.visitors.data"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.visits.length }}</td>
            <td>{{ item.location.place }}</td>
            <td>{{ new Date(Math.max(...item.visits)).toLocaleString() }}</td>
            <td>
              <v-icon small class="mr-2" @click="deleteUser(item.id)">
                mdi-delete </v-icon
              ><v-icon small class="mr-2" @click="blacklistUser(item.id)">
                mdi-account-cancel </v-icon
              ><v-icon small class="mr-2" @click="whitelistUser(item.id)">
                mdi-account-check
              </v-icon>
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
} from "../../firebase_config";
import { getAllMonths, getCurrentMonth, sameDay } from "../../utilities";
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
    getAllVisitorData(getCurrentMonth());
  },
  methods: {
    deleteUser(id) {
      deleteVisitor(id);
    },
    blacklistUser(id) {
      blacklist(id);
    },
    refreshData() {
      getAllVisitorData(this.$store.state.selectedDate);
    },
    whitelistUser(id) {
      whitelist(id);
    },
  },
  computed: {
    headers() {
      return [
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
        },
      ];
    },
    totalVisits() {
      let totalCount = 0;
      for (const key of this.$store.state.visitors.data) {
        totalCount += key.visits.length;
      }
      return totalCount;
    },
    latestVisit() {
      let minDate = 0;
      for (const key of this.$store.state.visitors.data) {
        for (const visit of key.visits) {
          if (visit > minDate) {
            minDate = visit;
          }
        }
      }
      if (minDate != 0) {
        const newDate = new Date(minDate);
        return `${newDate
          .toDateString()
          .substr(4)} | ${newDate.toTimeString().substr(0, 8)}`;
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
        for (const key of this.$store.state.visitors.data) {
          for (const visit of key.visits) {
            if (sameDay(new Date(visit), out)) {
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
      for (const key of this.$store.state.visitors.data) {
        arr.push({
          position: {
            lat: key.location.coordinates.latitude,
            lng: key.location.coordinates.longitude,
          },
          title: key.id,
        });
      }
      console.log(arr);
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
