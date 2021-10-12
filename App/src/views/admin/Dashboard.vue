<template>
  <div>
    <v-row>
      <v-col cols="4">
        <DashBoardCard
          :title="'Total Visits This Month (' + getCurrentMonth() + ')'"
          color="primary"
          :data="String(totalVisits)"
          :icon="'mdi-cursor-default-click'"
        />
      </v-col>
      <v-col cols="3">
        <DashBoardCard
          :title="'Last visit on'"
          color="warning"
          :data="latestVisit"
          :icon="'mdi-clock'"
        />
      </v-col>
      <v-col>
        <v-card elevation="15" outlined>
          <v-sheet class="v-sheet--offset" color="cyan" elevation="15">
            -- {{getBarValues.max}}
            <v-sparkline
              :labels="getBarValues.dates"
              :value="getBarValues.values"
              smooth=10
              color="white"
              line-width="2"
              padding="16"
              auto-draw
            ></v-sparkline>
            -- 0<br>
            ......From : {{getBarValues.leftMonth}} {{getBarValues.dates[0]}}
            | To : {{getBarValues.rightMonth}} {{getBarValues.dates[15]}}
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
        :search="search"
      ></v-data-table>
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
      visits: {},
      value: [200, 675, 410, 390, 310, 460, 250, 240],
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
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
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
          text: "Visits this month",
          value: "visits.length",
          filterable: false,
        },
        {
          text: "Visits this month",
          value: "location.place",
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
          if (visit.seconds > minDate) {
            minDate = visit.seconds;
          }
        }
      }
      const newDate = new Date(minDate * 1000);
      return `${newDate
        .toDateString()
        .substr(4)} | ${newDate.toTimeString().substr(0, 8)}`;
    },
    getBarValues() {
      const arr1 = [];
      const arr2 = [];
      const today = new Date();
      const out = new Date();
      let maxVal=0;
      out.setMonth(out.getMonth() - 1);
      out.setDate(out.getDate() + 15);
      const final = {leftMonth:this.getMonthName(out.getMonth())};
      while (out <= today) {
        arr1.push(out.getDate());
        arr2.push(0);
        for (const key of this.$store.state.visitors.data) {
        for (const visit of key.visits) {
          if (this.sameDay(new Date(visit.seconds * 1000),out)) {
            const newVal = 1+arr2.pop();
            arr2.push(newVal);
            if(newVal>maxVal){
              maxVal=newVal;
            }
          }
        }
      }
        out.setDate(out.getDate() + 1);
      }
      console.log(arr1,arr2)
      final["dates"] = arr1;
      final["values"] = arr2;
      final["rightMonth"] =this.getMonthName(out.getMonth());
      final["max"] = maxVal;
      return final;
    },
  },
};
</script>
