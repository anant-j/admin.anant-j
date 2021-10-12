<template>
  <div>
    <v-row>
      <div cols="3">
        <v-col>
          <DashBoardCard
            :title="'Total Visits This Month (' + getCurrentMonth() + ')'"
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
        <v-card elevation="15" outlined>
          <v-sheet class="v-sheet--offset" color="dark" elevation="15">
            <apexchart
              type="line"
              :options="getBarValues.options"
              :series="getBarValues.series"
            ></apexchart>
          </v-sheet>
        </v-card>
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
        <v-btn @click="getCurrentMonthData()">
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
            <td>{{ new Date(Math.max(...item.visits)) }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import DashBoardCard from "../../components/DashBoardCard";
import { getAllVisitorData } from "../../firebase_config.js";
export default {
  data() {
    return {
      search: "",
    };
  },
  components: {
    DashBoardCard,
  },
  created() {
    this.getCurrentMonthData();
  },
  methods: {
    getCurrentMonth() {
      var date = new Date();
      var dateString = `${this.getMonthName(
        date.getMonth()
      )} ${date.getFullYear()}`;
      return dateString;
    },
    getCurrentMonthData() {
      getAllVisitorData(this.getCurrentMonth());
      return;
    },
    getMonthName(id) {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthNames[id];
    },
    newVal(id) {
      return id * 2;
    },
    sameDay(d1, d2) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
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
            if (this.sameDay(new Date(visit), out)) {
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
  },
};
</script>
