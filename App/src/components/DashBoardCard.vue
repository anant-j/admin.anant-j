<template>
    <v-card :color="color" elevation="15" outlined>
        <v-card-subtitle class="white--text">
            <h1>{{ title }}</h1>
        </v-card-subtitle>
        <v-card-title>
            <v-icon color="white" large left>{{ icon }}</v-icon>
            <h2 class="white--text">{{ data }}</h2>
        </v-card-title>
    </v-card>
</template>

<script>
export default {
    props: {
        title: String,
        color: String,
        data: String,
        icon: String
    }
}
</script>