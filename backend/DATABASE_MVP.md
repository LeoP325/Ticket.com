# 購票系統 MVP 資料庫

MongoDB 集合與關聯：

- `users`：會員與角色；一位會員可有多筆訂單。
- `venues`：場館基本資料。
- `seatingMaps`：隸屬一個場館的座位配置。
- `events`：活動資料，透過 `venue` 關聯場館。
- `seats`：透過 `event`、`seatingMap` 關聯活動與座位圖；保存 5 分鐘選位狀態及購票者。
- `orders`：透過 `user` 關聯會員；`items` 保存活動、座位關聯及成交當下的名稱、座位、票價快照。
- `refreshTokens`：登入續期憑證。

關鍵約束：

- 活動代碼 `events.slug` 唯一。
- 同一活動的座位編號唯一：`{ event, number }`。
- 同一會員在同一活動只能保留一席、購買一席。
- 訂單編號 `orders.orderNo` 唯一。

啟動時 `ensureCatalog()` 會以 upsert 建立三個活動、場館與座位圖：星夜音樂祭 50 席、島嶼脈動音樂節 80 席、光之間・當代舞作 100 席，重複啟動不會重複寫入。
