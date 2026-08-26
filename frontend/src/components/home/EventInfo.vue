<script setup lang="ts">
  interface EventInfo {
    title: string
    subtitle: string
    date: string
    venue: string
    price: string
    capacity: number
    description: string
    notes: readonly string[]
  }

  defineProps<{
    bookingPath: string
    event: EventInfo
  }>()
</script>

<template>
  <section class="event-section">
    <div class="event-heading">
      <p class="event-kicker">FEATURED EVENT</p>
      <h1 class="event-title">{{ event.title }}</h1>
      <p class="event-subtitle">{{ event.subtitle }}</p>
    </div>

    <v-row>
      <v-col cols="12" md="7">
        <v-card class="event-card" flat>
          <v-card-text>
            <p class="event-description">{{ event.description }}</p>

            <v-list bg-color="transparent" lines="one">
              <v-list-item prepend-icon="mdi-calendar" :title="event.date" />
              <v-list-item prepend-icon="mdi-map-marker" :title="event.venue" />
              <v-list-item prepend-icon="mdi-ticket-confirmation" :title="`${event.price}／共 ${event.capacity} 席`" />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5">
        <v-card class="notice-card" color="#f5f7fa" flat>
          <v-card-title>購票提醒</v-card-title>

          <v-card-text>
            <ul class="notice-list">
              <li v-for="note in event.notes" :key="note">{{ note }}</li>
            </ul>

            <v-btn
              block
              class="mt-6"
              color="#1967b3"
              size="large"
              :to="bookingPath"
            >
              立即選位
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<style scoped>
  .event-section { padding: 72px 0 96px; }
  .event-heading { margin-bottom: 36px; }
  .event-kicker { color: #1967b3; font-size: .78rem; font-weight: 800; letter-spacing: .18em; }
  .event-title { color: #172033; font-size: clamp(2rem, 4vw, 3.4rem); line-height: 1.15; margin-top: 8px; }
  .event-subtitle { color: #667085; font-size: 1.1rem; margin-top: 12px; }
  .event-card, .notice-card { border-radius: 4px; height: 100%; }
  .event-card { border-top: 4px solid #1967b3; }
  .event-description { color: #344054; font-size: 1.05rem; line-height: 1.9; margin-bottom: 18px; }
  .notice-list { color: #475467; line-height: 1.8; padding-left: 20px; }
</style>
