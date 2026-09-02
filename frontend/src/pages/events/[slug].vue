<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ArenaSeatMap from '@/components/booking/ArenaSeatMap.vue'
  import RaffleRegistration from '@/components/booking/RaffleRegistration.vue'
  import { findEvent } from '@/data/event'
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const user = useUserStore()
  const activeEvent = computed(() =>
    findEvent(String('slug' in route.params ? route.params.slug : '')),
  )
  const bookingPath = computed(() => {
    if (!activeEvent.value) return '/'
    if (activeEvent.value.saleMethod === 'raffle')
      return `/login?redirect=${encodeURIComponent(`/events/${activeEvent.value.slug}`)}`
    const ticketPath = `/ticket?event=${activeEvent.value.slug}`
    return user.isLoggedIn
      ? ticketPath
      : `/login?redirect=${encodeURIComponent(ticketPath)}`
  })
</script>

<template>
  <main v-if="activeEvent" class="event-page">
    <div class="event-hero">
      <v-img
        :alt="activeEvent.title"
        class="event-image"
        cover
        height="clamp(300px, 42vw, 540px)"
        :src="activeEvent.image"
      />
    </div>

    <v-container class="event-content">
      <v-row>
        <v-col cols="12" md="8">
          <p class="event-kicker">{{ activeEvent.category }} / EVENT</p>
          <h1 class="event-title">{{ activeEvent.title }}</h1>
          <p class="event-subtitle">{{ activeEvent.subtitle }}</p>
          <v-divider class="my-8" />
          <h2 class="section-title">活動介紹</h2>
          <p class="event-description">{{ activeEvent.description }}</p>
          <h2 class="section-title mt-8">注意事項</h2>

          <ul class="notice-list">
            <li v-for="note in activeEvent.notes" :key="note">{{ note }}</li>
          </ul>

          <template v-if="activeEvent.saleMethod === 'raffle'">
            <ArenaSeatMap v-if="activeEvent.slug === 'starry-night-2026'" />

            <div id="raffle">
              <RaffleRegistration
                v-if="user.isLoggedIn"
                :event-slug="activeEvent.slug"
              />

              <v-alert v-else class="mt-7" color="info" variant="tonal">
                請先登入後登記抽選。
                <template #append><v-btn
                  :to="bookingPath"
                  variant="text"
                >登入</v-btn></template>
              </v-alert>
            </div>
          </template>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="ticket-card" variant="outlined">
            <v-list bg-color="transparent">
              <v-list-item
                prepend-icon="mdi-calendar"
                subtitle="活動時間"
                :title="activeEvent.date"
              />

              <v-list-item
                prepend-icon="mdi-map-marker"
                :subtitle="activeEvent.address"
                :title="activeEvent.venue"
              />

              <v-list-item
                prepend-icon="mdi-ticket-confirmation"
                subtitle="票價"
                :title="`NT$ ${activeEvent.price.toLocaleString('zh-TW')}`"
              />

              <v-list-item
                prepend-icon="mdi-seat"
                :subtitle="activeEvent.saleMethod === 'raffle' ? '中選名額' : '座位數'"
                :title="`${activeEvent.capacity.toLocaleString('zh-TW')} ${activeEvent.saleMethod === 'raffle' ? '位' : '席'}`"
              />
            </v-list>

            <v-alert
              v-if="activeEvent.saleMethod === 'raffle'"
              class="ma-3"
              color="deep-purple"
              variant="tonal"
            >
              登記抽選制<br>抽選日：{{ activeEvent.drawDate }}
            </v-alert>

            <v-card-actions v-else><v-btn
              block
              color="#1967b3"
              size="large"
              :to="bookingPath"
              variant="flat"
            >立即購票</v-btn></v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>

  <v-container
    v-else
    class="not-found"
  ><h1>找不到活動</h1>
    <v-btn class="mt-4" color="primary" to="/">回節目資訊</v-btn></v-container>
</template>

<style scoped>
.event-page {
  background: #fff;
  min-height: 100%;
}
.event-hero {
  background: #101828;
}
.event-image {
  margin: auto;
  max-width: 1440px;
}
.event-content {
  max-width: 1120px;
  padding-bottom: 96px;
  padding-top: 56px;
}
.event-kicker {
  color: #1967b3;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.event-title {
  color: #172033;
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1.15;
  margin-top: 8px;
}
.event-subtitle {
  color: #667085;
  font-size: 1.15rem;
  margin-top: 16px;
}
.section-title {
  color: #172033;
  font-size: 1.35rem;
}
.event-description,
.notice-list {
  color: #475467;
  line-height: 1.9;
  margin-top: 14px;
}
.notice-list {
  padding-left: 22px;
}
.ticket-card {
  border-color: #d0d5dd;
  padding: 12px;
  position: sticky;
  top: 92px;
}
.not-found {
  padding-top: 100px;
  text-align: center;
}
</style>

<route lang="yaml">
meta:
  title: 活動介紹
  admin: false
</route>
