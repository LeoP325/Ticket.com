<script setup lang="ts">
  import type { EventInfo } from '@/data/event'

  defineProps<{ events: readonly EventInfo[] }>()
</script>

<template>
  <section aria-labelledby="program-title" class="event-section">
    <div class="event-heading">
      <p class="event-kicker">PROGRAM</p>
      <h1 id="program-title" class="event-title">節目資訊</h1>
      <p class="event-subtitle">近期熱門活動，選一場喜歡的現場。</p>
    </div>

    <v-row>
      <v-col v-for="item in events" :key="item.slug" cols="12" md="4">
        <v-card
          class="event-card"
          :to="`/events/${item.slug}`"
          variant="outlined"
        >
          <v-img :alt="item.title" cover height="210" :src="item.image" />

          <v-card-text>
            <div class="event-meta">{{ item.category }} ・ {{ item.date }}</div>
            <h2 class="card-title">{{ item.title }}</h2>

            <p class="card-venue">
              <v-icon icon="mdi-map-marker-outline" size="small" />
              {{ item.venue }}
            </p>

            <p class="card-price">
              NT$ {{ item.price.toLocaleString("zh-TW") }}
            </p>

            <v-chip
              v-if="item.saleMethod === 'raffle'"
              class="mt-3"
              color="deep-purple"
              size="small"
              variant="tonal"
            >登記抽選・{{ item.drawDate }} 抽選</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
.event-section {
  padding: 64px 0 96px;
}
.event-heading {
  margin-bottom: 28px;
}
.event-kicker {
  color: #1967b3;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}
.event-title {
  color: #172033;
  font-size: clamp(2rem, 4vw, 3rem);
  margin-top: 6px;
}
.event-subtitle {
  color: #667085;
  margin-top: 8px;
}
.event-card {
  border-color: #e4e7ec;
  border-radius: 4px;
  height: 100%;
  overflow: hidden;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
}
.event-card:hover {
  box-shadow: 0 14px 36px rgb(16 24 40 / 14%);
  transform: translateY(-4px);
}
.event-meta {
  color: #1967b3;
  font-size: 0.78rem;
  font-weight: 700;
}
.card-title {
  color: #172033;
  font-size: 1.35rem;
  margin-top: 10px;
}
.card-venue {
  color: #667085;
  margin-top: 12px;
}
.card-price {
  color: #172033;
  font-size: 1.05rem;
  font-weight: 800;
  margin-top: 18px;
}
</style>
