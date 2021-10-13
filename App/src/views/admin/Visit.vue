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
        <!-- <v-col>
          <DashBoardCard
            :title="'Last visit'"
            color="warning"
            :data="latestVisit"
            :icon="'mdi-clock'"
          />
        </v-col> -->
      </div>
      <!-- <v-col cols="3">
        <v-card>
          <v-sheet class="v-sheet--offset" style="height:300px" color="dark">
            <apexchart
              type="line"
              :options="getBarValues.options"
              :series="getBarValues.series"
            ></apexchart>
          </v-sheet>
        </v-card>
      </v-col> -->
      <!-- <v-col cols="4">
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
      </v-col> -->
      <!-- <div>
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
      </div> -->
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import DashBoardCard from "../../components/DashBoardCard";
export default {
  name: "Visit",
  data() {
    return {
      id: 0,
      data: {},
    };
  },
  components: {
    DashBoardCard,
  },
  created() {
    const nav = window.location.search.split("?id=")[1];
    if (!nav) {
      this.$router.push("/");
      return;
    } else {
      this.id = nav;
    }
    this.getDataFromServer(this.id);
  },
  methods: {
    async getDataFromServer(id) {
      const result = await axios.get(
        `https://api.fpjs.io/visitors/${id}?token=token`
      );
      this.data = result.data.visits;
    },
  },
  computed: {
    totalVisits() {
      return this.data.length;
    },
  },
};
</script>
