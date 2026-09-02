<script setup lang="ts">
  import ProfileForm from '@/components/profile/ProfileForm.vue'
</script>

<template>
  <v-container class="profile-page">
    <p class="text-overline text-primary">MY PROFILE</p>

    <h1>個人資料</h1>

    <p class="page-description">修改您的信箱、暱稱或登入密碼。</p>

    <v-card class="profile-card mt-8" variant="outlined">
      <v-card-text><ProfileForm /></v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.profile-page {
  max-width: 680px;
  padding-bottom: 96px;
  padding-top: 56px;
}

.profile-page h1 {
  color: #172033;
  font-size: clamp(2rem, 4vw, 3rem);
}

.page-description {
  color: #667085;
  margin-top: 8px;
}

.profile-card {
  border-color: #d0d5dd;
  padding: 16px;
}
</style>

<route lang="yaml">
meta:
  title: 個人資料
  login: login-only
  admin: false
</route>
