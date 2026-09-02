<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { useOrdersQuery, useRefundOrderMutation } from '@/quries/order'
  import { useSnackbarStore } from '@/stores/snackbar'
  import type { Order } from '@/types/order'

  const { data: orders, isLoading } = useOrdersQuery()
  const { mutateAsync: refundOrder, isLoading: isRefunding } = useRefundOrderMutation()
  const snackbar = useSnackbarStore()
  const refundingOrderId = shallowRef<string>()
  const dateFormatter = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium', timeStyle: 'short' })

  function statusText (status: Order['status']) {
    if (status === 'paid') return '已付款'
    if (status === 'refunded') return '已退票'
    return '已取消'
  }

  async function submitRefund (orderId: string) {
    if (!window.confirm('確定要退票嗎？退票後座位將重新開放。')) return
    refundingOrderId.value = orderId
    try {
      await refundOrder(orderId)
      snackbar.add({ text: '退票完成', color: 'green' })
    } catch (error) {
      snackbar.addError(error)
    } finally {
      refundingOrderId.value = undefined
    }
  }
</script>

<template>
  <v-container class="orders-page">
    <div class="page-heading"><p class="text-overline text-primary">MY ORDERS</p><h1>訂單查詢</h1><p>查看已完成的活動票券與座位資訊。</p></div>
    <v-skeleton-loader v-if="isLoading" type="article, article" />
    <v-alert v-else-if="!orders?.length" color="blue-grey" icon="mdi-ticket-outline" variant="tonal">目前沒有訂單，先去看看節目吧！<template #append><v-btn to="/" variant="text">瀏覽節目</v-btn></template></v-alert>

    <div v-else class="order-list">
      <v-card v-for="order in orders" :key="order._id" class="order-card" variant="outlined">
        <v-card-text>
          <div class="order-head"><div><span class="order-label">訂單編號</span><strong>{{ order.orderNo }}</strong></div><v-chip :color="order.status === 'paid' ? 'success' : 'grey'" size="small" variant="tonal">{{ statusText(order.status) }}</v-chip></div>
          <v-divider class="my-4" />
          <div v-for="item in order.items" :key="`${order._id}-${item.seatLabel}`" class="order-item"><div><h2>{{ item.eventTitle }}</h2><p>{{ item.seatLabel }} ・ {{ item.quantity }} 張</p></div><strong>NT$ {{ item.price.toLocaleString('zh-TW') }}</strong></div>
          <div class="order-foot"><span>{{ dateFormatter.format(new Date(order.createdAt)) }}</span><div class="order-actions"><strong>合計 NT$ {{ order.totalAmount.toLocaleString('zh-TW') }}</strong><v-btn v-if="order.status === 'paid'" color="error" :loading="isRefunding && refundingOrderId === order._id" size="small" variant="tonal" @click="submitRefund(order._id)">退票</v-btn></div></div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
  .orders-page { max-width: 960px; padding-bottom: 96px; padding-top: 56px; }
  .page-heading { margin-bottom: 32px; }
  .page-heading h1 { color: #172033; font-size: clamp(2rem, 4vw, 3rem); }
  .page-heading p:last-child { color: #667085; margin-top: 8px; }
  .order-list { display: grid; gap: 18px; }
  .order-card { border-color: #d0d5dd; }
  .order-head, .order-item, .order-foot { align-items: center; display: flex; justify-content: space-between; gap: 20px; }
  .order-label { color: #667085; display: block; font-size: .78rem; margin-bottom: 4px; }
  .order-item h2 { color: #172033; font-size: 1.15rem; }
  .order-item p { color: #667085; margin-top: 5px; }
  .order-foot { background: #f8fafc; color: #475467; margin: 20px -16px -16px; padding: 14px 16px; }
  .order-actions { align-items: center; display: flex; gap: 14px; }
  @media (max-width: 600px) { .order-item, .order-foot { align-items: flex-start; flex-direction: column; gap: 8px; } }
</style>

<route lang="yaml">
meta:
  title: 訂單查詢
  login: login-only
  admin: false
</route>
