<template>
  <v-app>
    <router-view />
    <v-snackbar-queue v-model="snackbar.queue" />
  </v-app>
</template>

<script lang="ts" setup>
  import { useSnackbarStore } from './stores/snackbar'

  const snackbar = useSnackbarStore()
</script>
