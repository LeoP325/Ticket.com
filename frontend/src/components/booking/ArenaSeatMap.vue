<script setup lang="ts">
  interface Zone {
    name: string
    color: 'red' | 'purple' | 'blue' | 'yellow'
    gridColumn: number
    gridRow: number
  }

  const zones: readonly Zone[] = [
    ...['紅1A', '紅1B', '紅1C', '紅1D', '紅1E', '紫2A'].map((name, index) => ({
      name,
      color: (index < 5 ? 'red' : 'purple') as Zone['color'],
      gridColumn: index + 1,
      gridRow: 6,
    })),
    ...['紫2B', '紫2C', '紫2D', '紫2E', '藍2A', '藍2B'].map((name, index) => ({
      name,
      color: (index < 4 ? 'purple' : 'blue') as Zone['color'],
      gridColumn: index + 1,
      gridRow: 1,
    })),
    ...['藍2C', '藍2D', '藍2E', '黃3A'].map((name, index) => ({
      name,
      color: (index < 3 ? 'blue' : 'yellow') as Zone['color'],
      gridColumn: 6,
      gridRow: index + 2,
    })),
    ...['黃3B', '黃3C', '黃3D', '黃3E'].map((name, index) => ({
      name,
      color: 'yellow' as const,
      gridColumn: 1,
      gridRow: index + 2,
    })),
  ]
</script>

<template>
  <section aria-labelledby="arena-title" class="arena-card">
    <div class="arena-heading">
      <div>
        <p class="text-overline text-primary">15,000 SEATS</p>
        <h2 id="arena-title">星夜音樂祭座位配置</h2>
      </div>

      <span>20 區 × 每區 750 席</span>
    </div>

    <div
      aria-label="環繞中央舞台的紅、紫、藍、黃四類座位分區，共一萬五千席"
      class="arena"
      role="img"
    >
      <div class="stage">中央舞台</div>

      <div
        v-for="zone in zones"
        :key="zone.name"
        class="zone"
        :class="zone.color"
        :style="{ gridColumn: zone.gridColumn, gridRow: zone.gridRow }"
      >
        <strong>{{ zone.name }}</strong>

        <small>750 席</small>
      </div>
    </div>

    <p class="map-note">
      本圖參考台北小巨蛋環形分區概念；中選後由系統分配實際排號與座號。
    </p>
  </section>
</template>

<style scoped>
.arena-card {
  background: #f8fafc;
  border: 1px solid #d0d5dd;
  border-radius: 12px;
  margin-top: 36px;
  padding: 24px;
}
.arena-heading {
  align-items: end;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.arena-heading h2 {
  color: #172033;
}
.arena-heading span,
.map-note {
  color: #667085;
  font-size: 0.85rem;
}
.arena {
  aspect-ratio: 1.45;
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  margin: auto;
  max-width: 780px;
}
.stage {
  align-items: center;
  background: #e4e7ec;
  border-radius: 45%;
  color: #8b0000;
  display: flex;
  font-size: 1.2rem;
  font-weight: 900;
  grid-column: 2 / 6;
  grid-row: 2 / 6;
  justify-content: center;
  letter-spacing: 0.2em;
}
.zone {
  align-items: center;
  border-radius: 8px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 4px;
}
.zone small {
  font-size: 0.67rem;
  opacity: 0.85;
}
.red {
  background: #e51b2b;
}
.purple {
  background: #771179;
}
.blue {
  background: #3653a4;
}
.yellow {
  background: #d4b900;
}
.map-note {
  margin-top: 18px;
  text-align: center;
}
@media (max-width: 600px) {
  .arena-card {
    padding: 14px;
  }
  .arena {
    gap: 3px;
  }
  .zone {
    border-radius: 4px;
    font-size: 0.7rem;
  }
  .zone small {
    display: none;
  }
  .stage {
    font-size: 0.8rem;
  }
}
</style>
