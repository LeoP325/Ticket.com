# 購票網站 MVP 變更紀錄

更新日期：2026-08-26

## 2026-08-25：修正「立即選位」導覽

### 問題

首頁的「立即選位」按鈕原本先由 `EventInfo` 元件送出 `book` 事件，再由首頁呼叫 `router.push()` 導覽。這段間接事件鏈可能使按鈕在實際執行環境中沒有完成頁面切換。

### 修正

- 首頁依登入狀態計算選位目的地。
- 將目的地透過 `bookingPath` 傳入 `EventInfo` 元件。
- 按鈕改用 Vue Router 原生 `to` 連結，不再透過自訂事件間接導覽。
- 未登入時前往 `/login?redirect=/ticket`，登入後會返回選位頁。
- 已登入時直接前往 `/ticket`。

### 驗證

- ESLint 檢查通過。
- Vue／TypeScript 型別檢查通過。
- Vite 正式建置通過。
- 瀏覽器 DOM 已確認按鈕產生正確的選位連結。

## 1. 改造目標

本次將原本的購物網站範本改造成單一活動的購票網站 MVP，開發重點放在最小但完整的訂票流程，不實作正式售票平台才需要的付款、退票、多場次、活動後台及複雜排隊系統。

本次需求包含：

- 網站只提供一個活動。
- 場地固定為 50 個座位。
- 同一時間最多允許 10 個使用者鎖定座位。
- 每個帳號限定購買 1 個座位。
- 選中的座位保留 5 分鐘。
- 省略付款流程，確認座位後直接完成訂票。
- 保留簡單帳號密碼註冊與登入，不加入手機、Email 或身分驗證。
- 前端視覺參考 tixCraft 的資訊層級。
- 首頁只保留最上方導覽列、3 張輪播圖及活動資訊。

## 2. 最終使用流程

完整使用流程如下：

1. 使用者進入首頁查看輪播圖與活動資訊。
2. 尚未登入的使用者點擊「立即選位」後，會被導向登入頁。
3. 登入完成後，自動返回選位頁。
4. 選位頁顯示 1 至 50 號座位及目前狀態。
5. 使用者選擇一個可用座位。
6. 後端將座位鎖定給該帳號 5 分鐘。
7. 前端顯示 5 分鐘倒數及訂票摘要。
8. 使用者可在倒數結束前確認訂票，或主動取消保留。
9. 確認後不進入付款頁，座位直接轉為完成訂票狀態。
10. 已完成訂票的帳號無法再選擇第二個座位。

## 3. MVP 技術設計

### 3.1 保留的原有技術

本次沒有更換專案框架，繼續沿用既有技術：

- 前端：Vue 3、TypeScript、Vite、Vuetify。
- 前端狀態：Pinia。
- 伺服器資料查詢：Pinia Colada。
- API 請求：Axios。
- 後端：Express、TypeScript。
- 資料庫：MongoDB、Mongoose。
- 登入：JWT Access Token、Refresh Token Cookie。
- 表單驗證：Yup、VeeValidate。

### 3.2 刻意省略的項目

依照 MVP 與 YAGNI 原則，本次沒有加入：

- 多活動管理。
- 多場次管理。
- 不同票種與不同票價。
- 正式金流串接。
- 付款 Webhook。
- 電子票券或 QR Code。
- 入場核銷。
- 退票與退款。
- 手機或 Email 驗證。
- 實名制。
- 管理後台。
- 獨立排隊服務。
- Redis 或額外快取服務。
- WebSocket 即時推播。

## 4. 後端變更

### 4.1 新增座位資料模型

新增檔案：`backend/src/models/seat.ts`

座位模型主要欄位：

| 欄位 | 說明 |
| --- | --- |
| `number` | 座位編號，範圍為 1 至 50，且不可重複。 |
| `heldBy` | 目前鎖定此座位的使用者 ID。 |
| `heldUntil` | 座位鎖定到期時間。 |
| `bookedBy` | 已完成訂票的使用者 ID。 |
| `bookedAt` | 完成訂票的時間。 |

模型加入以下資料庫限制：

- `number` 為唯一值，避免重複座號。
- `heldBy` 使用部分唯一索引，確保一個帳號同時間只能鎖定一席。
- `bookedBy` 使用部分唯一索引，確保一個帳號只能完成一筆訂票。

後端連線資料庫時會執行 `ensureSeats()`，透過 upsert 自動補齊 1 至 50 號座位。因此不需要另外執行種子資料指令，重複啟動也不會重複新增座位。

### 4.2 新增購票控制器

新增檔案：`backend/src/controllers/ticket.ts`

核心常數：

```ts
const HOLD_MS = 5 * 60 * 1000
const MAX_ACTIVE_HOLDS = 10
```

#### `getSeats`

用途：取得目前 50 個座位及選位人數。

處理內容：

- 每次讀取前清除已超過 5 分鐘的鎖位。
- 查詢目前有效鎖位數量。
- 依登入使用者轉換每個座位的顯示狀態。
- 不會將其他使用者的帳號或 ID 傳給前端。

前端可收到的座位狀態：

| 狀態 | 說明 |
| --- | --- |
| `available` | 尚未被鎖定或訂購。 |
| `held` | 正由其他使用者保留。 |
| `booked` | 已由其他使用者完成訂票。 |
| `mine-held` | 目前登入使用者保留中的座位。 |
| `mine-booked` | 目前登入使用者已完成訂票的座位。 |

#### `holdSeat`

用途：鎖定一個座位 5 分鐘。

處理規則：

- 座位編號必須是 1 至 50 的整數。
- 已完成訂票的帳號不能再次鎖位。
- 同時有效鎖位達 10 人時，新的使用者不能加入。
- 同一帳號只能保留一個座位。
- 使用者改選座位時，會先釋放原座位再嘗試鎖定新座位。
- 若新座位已被搶先鎖定，API 回傳衝突錯誤。
- 鎖位使用帶條件的資料庫更新，避免直接覆蓋其他人的有效鎖位。
- 鎖位完成後再檢查總數，避免競爭情況下長時間超過 10 個有效鎖位。

已加入 `ponytail` 註解說明：目前 MVP 使用 MongoDB 後檢查控制 10 人上限，沒有為此額外加入 Queue 或 Redis。

#### `releaseSeat`

用途：使用者主動取消目前保留的座位。

處理內容：

- 只會釋放目前登入使用者自己的鎖位。
- 不會取消已完成的訂票。
- 清除 `heldBy` 與 `heldUntil`。

#### `confirmSeat`

用途：確認訂票。

處理內容：

- 確認使用者是否有尚未到期的鎖位。
- 將該座位寫入 `bookedBy` 與 `bookedAt`。
- 清除原有的鎖位欄位。
- 已完成訂票的使用者重複呼叫時，會回傳既有結果，避免重複建立訂票。
- 若保留已到期，回傳鎖位過期錯誤。

### 4.3 新增購票 API 路由

新增檔案：`backend/src/routes/ticket.ts`

所有購票 API 都必須登入：

| 方法 | 路徑 | 功能 |
| --- | --- | --- |
| `GET` | `/ticket` | 取得座位狀態、目前選位人數及人數上限。 |
| `POST` | `/ticket/hold` | 鎖定指定座位 5 分鐘。 |
| `DELETE` | `/ticket/hold` | 取消目前登入者的座位保留。 |
| `POST` | `/ticket/confirm` | 省略付款並直接完成訂票。 |

鎖位請求格式：

```json
{
  "number": 12
}
```

### 4.4 後端啟動流程調整

修改檔案：`backend/src/index.ts`

原本後端會在 MongoDB 尚未連線完成前先開放 HTTP 服務，可能造成請求進入 Mongoose buffer 後逾時。

本次調整為：

1. 先連線 MongoDB。
2. 建立或補齊 50 個座位。
3. 確認完成後才開始監聽 HTTP 連接埠。

如果資料庫連線失敗，後端不會假裝已經可以接受請求。

### 4.5 移除舊 API 入口

`backend/src/index.ts` 已不再掛載以下購物網站 API：

- `/product`
- `/user`
- `/order`

目前對外只保留：

- `/auth`
- `/ticket`

舊後端檔案仍留在專案中供參考，但已不再由 Express 掛載，因此前端與一般 API 使用者無法進入舊購物流程。

### 4.6 新增錯誤訊息

修改檔案：`backend/src/middlewares/error.ts`

新增錯誤狀態：

| 內部錯誤 | HTTP 狀態 | 前端訊息 |
| --- | --- | --- |
| `SELECTION FULL` | `409 Conflict` | 目前已有 10 人選位，請稍後再試。 |
| `SEAT UNAVAILABLE` | `409 Conflict` | 座位已被其他人選取，請選擇其他座位。 |
| `BOOKING EXISTS` | `409 Conflict` | 每個帳號限購一個座位。 |
| `HOLD EXPIRED` | `409 Conflict` | 座位保留時間已到，請重新選位。 |

### 4.7 登入回應簡化

修改檔案：`backend/src/controllers/auth.ts`

登入與 Refresh Token 回應已不再包含購物車數量 `cart`，目前回傳：

- `accessToken`
- `account`
- `role`

帳號密碼登入、Refresh Token 及登出機制仍沿用原本設計，沒有新增手機、Email 或其他驗證流程。

## 5. 前端變更

### 5.1 新增活動資料

新增檔案：`frontend/src/data/event.ts`

目前只有一個固定活動：

- 活動名稱：城市星光音樂祭 2026
- 日期：2026 年 10 月 17 日 19:30
- 場地：台北流行音樂中心表演廳
- 價格：NT$ 1,280
- 容量：50 席

活動名稱、日期、場地、價格、介紹及購票提醒都集中在這個檔案。需要替換示範活動時，只需先修改此處，不需要建立活動管理後台。

### 5.2 首頁重新設計

修改檔案：`frontend/src/pages/index.vue`

首頁現在只包含：

- 最上方導覽列。
- 3 張自動輪播圖。
- 單一活動資訊。
- 活動日期、場地、票價與購票提醒。
- 「立即選位」按鈕。

未登入時點擊「立即選位」會前往：

```text
/login?redirect=/ticket
```

登入成功後會依 `redirect` 返回選位頁，不需要再次從首頁操作。

### 5.3 導覽列重新設計

修改檔案：`frontend/src/layouts/default.vue`

導覽列改為藍色售票網站風格，品牌名稱為 `TIXLIGHT`。

未登入時顯示：

- 活動資訊
- 註冊
- 登入

登入後顯示：

- 活動資訊
- 立即選位
- 登出

已移除購物車、訂單與管理後台入口。

### 5.4 新增三張預設輪播圖片

新增檔案：

- `frontend/src/assets/banner-1.svg`
- `frontend/src/assets/banner-2.svg`
- `frontend/src/assets/banner-3.svg`

圖片為專案內建 SVG，不依賴外部圖片網址，因此離線開發與正式建置都能正常顯示。

三張圖分別呈現：

- 城市星光音樂祭舞台。
- 藍紫色演唱會燈光。
- 夕陽城市音樂現場。

### 5.5 新增輪播元件

新增檔案：`frontend/src/components/home/HeroCarousel.vue`

元件責任：

- 接收輪播圖片陣列。
- 每 5 秒自動切換。
- 支援滑鼠移入時顯示左右切換按鈕。
- 顯示圖片替代文字。
- 高度依螢幕寬度調整。

### 5.6 新增活動資訊元件

新增檔案：`frontend/src/components/home/EventInfo.vue`

元件責任：

- 接收活動資料。
- 顯示標題、簡介、日期、場地、票價及容量。
- 顯示購票注意事項。
- 透過 `book` 事件通知首頁開始選位。

元件不直接控制 Router 或登入狀態，維持 Props Down、Events Up 的明確資料流。

### 5.7 新增選位頁

新增檔案：`frontend/src/pages/ticket.vue`

選位頁主要功能：

- 顯示活動名稱、日期及場地。
- 顯示目前選位人數，例如 `3／10 人`。
- 顯示 1 至 50 號座位。
- 每 5 秒重新向後端取得座位狀態。
- 選位成功後顯示 Snackbar。
- 顯示目前使用者的座位及 5 分鐘倒數。
- 可確認訂票或取消保留。
- 已完成訂票時顯示訂票完成狀態。
- 已訂票使用者不能再選第二席。
- 同時選位人數已滿時停用新的座位選擇並顯示提示。

選位頁設定為 `login-only`，未登入時會由既有 Router Guard 導向登入頁。

### 5.8 新增座位圖元件

新增檔案：`frontend/src/components/booking/SeatGrid.vue`

座位圖包含：

- 舞台方向提示。
- 1 至 50 號座位按鈕。
- 桌面版每排 10 席。
- 行動版每排 5 席。
- 可選、我的保留、他人保留、已訂四種圖例。
- 使用 `aria-label` 提供座位編號及狀態，改善鍵盤與螢幕閱讀器操作。

元件只接收座位狀態並送出 `select` 事件，不直接發送 API。

### 5.9 新增訂票摘要元件

新增檔案：`frontend/src/components/booking/BookingSummary.vue`

元件功能：

- 顯示目前選擇的座號。
- 顯示 5 分鐘倒數。
- 倒數結束時送出 `expired` 事件要求重新整理座位。
- 提供「確認訂票」按鈕。
- 提供「取消保留」按鈕。
- 訂票完成後顯示成功狀態。
- 摘要在桌面版會固定於畫面右側，方便長頁面操作。

### 5.10 新增倒數 composable

新增檔案：`frontend/src/composables/useHoldCountdown.ts`

功能：

- 接收後端提供的 `heldUntil`。
- 每秒依真實到期時間重新計算剩餘秒數。
- 將秒數格式化為 `分鐘:秒數`。
- 元件卸載時自動清除 `setInterval`。

倒數不是自行從 5 分鐘開始扣除，而是以後端時間為準，因此重新整理頁面後仍會顯示正確剩餘時間。

### 5.11 新增票務型別、Service 與 Query

新增檔案：

- `frontend/src/types/ticket.ts`
- `frontend/src/services/ticket.ts`
- `frontend/src/quries/ticket.ts`

分工如下：

- `types/ticket.ts`：座位狀態與 API 結果型別。
- `services/ticket.ts`：Axios API 請求。
- `quries/ticket.ts`：Pinia Colada Query、Mutation 及快取失效處理。

鎖位、取消與確認成功後，都會讓 `ticket` Query 失效並重新取得最新座位狀態。

### 5.12 補上 Pinia Colada Plugin

修改檔案：`frontend/src/plugins/index.ts`

原專案使用 Pinia Colada Query 與 Mutation，但 Plugin 沒有註冊到 Vue App。

本次補上：

```ts
app.use(PiniaColada)
```

並確保註冊順序在 Pinia 之後、Router 之前。

### 5.13 登入返回選位頁

修改檔案：`frontend/src/pages/login.vue`

登入成功後會讀取網址中的 `redirect` Query：

- 有合法字串時導向該路徑。
- 沒有指定時回到首頁。

這讓首頁的「立即選位」能形成完整登入流程。

### 5.14 使用者 Store 簡化

修改檔案：`frontend/src/stores/user.ts`

已移除購物車數量 `cart`，Store 目前只保存：

- Access Token
- 帳號
- 使用者角色
- 是否登入
- 是否為管理員

### 5.15 移除舊購物網站頁面與前端模組

已刪除以下購物網站檔案：

```text
frontend/src/components/ProductCard.vue
frontend/src/layouts/admin.vue
frontend/src/pages/product/[id].vue
frontend/src/pages/user/cart.vue
frontend/src/pages/user/order.vue
frontend/src/pages/admin/index.vue
frontend/src/pages/admin/product.vue
frontend/src/pages/admin/order.vue
frontend/src/quries/product.ts
frontend/src/quries/user.ts
frontend/src/quries/order.ts
frontend/src/services/product.ts
frontend/src/services/user.ts
frontend/src/services/order.ts
frontend/src/types/product.ts
frontend/src/types/user.ts
frontend/src/types/order.ts
frontend/src/types/vue-file-agent.d.ts
```

此外，`frontend/src/plugins/index.ts` 已不再註冊檔案上傳 Plugin，因為目前沒有商品圖片管理後台。

## 6. API 規則摘要

### 6.1 50 席初始化

- 後端啟動時以 upsert 建立 1 至 50 號座位。
- 已存在的座位不會被重設。
- 正式訂票結果可跨伺服器重啟保存。

### 6.2 每人限購一席

限制同時存在於：

- Controller 查詢檢查。
- `heldBy` 唯一索引。
- `bookedBy` 唯一索引。
- 前端完成訂票後停用選位。

即使使用者繞過前端直接呼叫 API，後端與資料庫仍會阻止第二席。

### 6.3 五分鐘鎖位

- 鎖位時由後端寫入 `Date.now() + 300000`。
- 前端倒數僅負責顯示。
- 確認訂票時後端重新驗證 `heldUntil`。
- 每次取得座位前都會釋放過期鎖位。
- 到期後舊使用者不能再確認該座位。

### 6.4 十人同時選位

- 以目前有效且尚未到期的鎖位數量作為選位人數。
- 前 10 位使用者可以鎖位。
- 第 11 位使用者收到 `409 Conflict`。
- 已經擁有鎖位的使用者改選座位時，不額外占用名額。
- 取消保留或超過 5 分鐘後，名額自動釋放。

## 7. 驗證與測試結果

### 7.1 靜態檢查

已執行：

```powershell
cd frontend
npm.cmd run lint
npm.cmd run type-check
npm.cmd run build-only
```

結果：

- 前端 ESLint 通過。
- Vue／TypeScript 型別檢查通過。
- Vite 正式建置通過。

型別檢查仍會顯示原專案既有的 Vue Router `rootDir` 提示，但不影響型別檢查或正式建置。

後端已執行：

```powershell
cd backend
npm.cmd run build
```

結果：

- TypeScript 編譯通過。

### 7.2 實際 API 端到端測試

已使用專案既有 MongoDB Atlas 實際驗證：

| 測試 | 結果 |
| --- | --- |
| 註冊新帳號 | 成功 |
| 登入取得 Access Token | 成功 |
| 自動建立座位數量 | 50 席 |
| 鎖定可用座位 | 成功 |
| 取得自己的鎖定座位 | 成功 |
| 確認訂票 | 成功 |
| 取得自己的完成訂票座位 | 成功 |
| 同帳號嘗試第二席 | `409 Conflict` |
| 前 10 位使用者同時鎖位 | 全部成功 |
| 第 11 位使用者嘗試鎖位 | `409 Conflict` |
| 鎖位期限 | 300 秒 |

測試完成後已：

- 釋放測試鎖位。
- 清除本次建立的測試訂位。
- 刪除本次建立的 17 個測試帳號及 Refresh Token。
- 停止測試用後端程序。
- 確認 4000 連接埠未被測試程序占用。

## 8. 啟動方式

### 8.1 啟動後端

```powershell
cd backend
npm.cmd run dev
```

後端預設網址：

```text
http://localhost:4000
```

### 8.2 啟動前端

開啟另一個 PowerShell：

```powershell
cd frontend
npm.cmd run dev
```

前端預設網址：

```text
http://localhost:3000
```

### 8.3 環境設定

後端仍需要既有 `backend/.env`：

- `DB_URL`
- `JWT_SECRET`

舊 Cloudinary 環境變數目前仍可保留，但新的票務流程不會使用商品圖片上傳 API。

前端需要 `frontend/.env.development` 中的 API 網址，例如：

```env
VITE_API_URL=http://localhost:4000
```

若使用 MongoDB Atlas，必須確認目前開發環境的 IP 已加入 Atlas Network Access 白名單。

## 9. 已知限制

此版本定位為單機教學／展示用途的 MVP，目前限制如下：

- 活動內容為前端固定資料，沒有活動管理 API。
- 只有一個活動及一種票價。
- 完成訂票後沒有取消功能。
- 沒有付款、退款或付款失敗狀態。
- 沒有 Email、簡訊或票券通知。
- 沒有電子票券及入場核銷。
- 座位更新採每 5 秒輪詢，並非 WebSocket 即時推播。
- 10 人上限使用 MongoDB 條件更新與事後總數檢查，適合此 MVP；若未來面對大型售票流量，應改用正式 Queue／Redis／分散式鎖方案。
- 舊後端商品、購物車及訂單原始碼仍存在，但路由已停用；若確定不再需要參考，可在後續整理時刪除。

## 10. 後續若要擴充

建議只在需求確定後依序加入：

1. 增加活動與場次管理後台。
2. 增加不同票區及票價。
3. 增加完成訂票後的取消功能。
4. 增加第三方金流與 Webhook。
5. 增加電子票券與 QR Code 核銷。
6. 需要更高即時性時再導入 WebSocket。
7. 需要承受大量搶票流量時再導入 Redis、排隊系統與壓力測試。

目前版本已完整涵蓋本次指定的 MVP 範圍，以上擴充項目都不是現階段運作所必需。

## 2026-08-26：多活動售票與訂單查詢

### 完成項目

- 依資料關聯圖建立 `events`、`venues`、`seatingMaps`、`seats`、`orders` 等 MongoDB/Mongoose MVP 模型。
- 啟動後端時透過 `ensureCatalog()` 自動建立活動、場館、座位圖及座位資料，並相容舊版單活動座位資料。
- 新增三個活動：星夜音樂祭 2026、島嶼脈動音樂節、光之間・當代舞作。
- 三個活動皆提供獨立網址的活動介紹頁，包含日期、場館、地址、票價、座位數、活動介紹及注意事項。
- 首頁輪播圖改為對應活動主視覺，點擊後可進入該活動介紹頁；輪播下方新增節目資訊卡片。
- 導覽列新增「訂單查詢」，完成購票時建立包含活動、座位與成交票價快照的訂單。
- 售票流程支援每個活動獨立選位、5 分鐘座位保留、確認購票及訂單查詢。

### 活動與座位配置

| 活動 | 活動代碼 | 票價 | 座位數 |
| --- | --- | ---: | ---: |
| 星夜音樂祭 2026 | `starry-night-2026` | NT$ 1,280 | 50 |
| 島嶼脈動音樂節 | `island-pulse` | NT$ 1,680 | 80 |
| 光之間・當代舞作 | `light-between-us` | NT$ 1,480 | 100 |

### 圖片資產

- `frontend/src/assets/starry-night-2026.png`：重新產生的星夜音樂祭主視覺。
- `frontend/src/assets/island-pulse.png`：島嶼脈動音樂節主視覺。
- `frontend/src/assets/light-between-us.png`：光之間・當代舞作主視覺。

### API

| 方法 | 路徑 | 用途 |
| --- | --- | --- |
| `GET` | `/events` | 取得活動列表 |
| `GET` | `/events/:slug` | 取得單一活動 |
| `GET` | `/ticket/:eventSlug` | 取得活動座位狀態 |
| `POST` | `/ticket/:eventSlug/hold` | 保留座位 |
| `DELETE` | `/ticket/:eventSlug/hold` | 釋出座位 |
| `POST` | `/ticket/:eventSlug/confirm` | 確認購票並建立訂單 |
| `GET` | `/orders` | 查詢登入會員的訂單 |

### 驗證結果

- 後端 TypeScript 建置通過。
- 前端 Vue TypeScript 與 Vite 正式建置通過。
- 本次異動的前後端檔案 ESLint 檢查通過。

---

## 2026-09-04：修正首頁輪播圖片無法點擊

### 問題原因

`HeroCarousel.vue` 原本在 `pointerdown` 時立即呼叫 `setPointerCapture()`，導致一般點擊的後續事件被輪播容器接管，圖片內的 `RouterLink` 無法收到完整點擊事件。

### 修正內容

- 一般點擊不再接管 pointer，讓輪播圖片可正常開啟活動詳情頁。
- 只有游標移動超過 10px、確認為拖曳操作後才呼叫 `setPointerCapture()`。
- 保留原有的左右滑動與拖曳後防止誤觸連結功能。
- 維持 Vue Router 5，未進行會破壞 `vue-router/vite` 檔案路由的降版。

### 驗證結果

- `HeroCarousel.vue`、全站版型及首頁的 ESLint 檢查通過。
- Vue／TypeScript 型別檢查通過。
- Vite 正式建置通過。
- 因測試環境沒有可連線的瀏覽器實例，本次未執行瀏覽器點擊 E2E 測試。

---

## 2026-09-06：首頁輪播改用 Vue Splide

### 套件異動

- 安裝 `@splidejs/vue-splide@0.6.12`，使用其相依的 `@splidejs/splide@4.1.4`。
- 更新 `frontend/package.json` 與 `frontend/package-lock.json`。
- 在 `frontend/env.d.ts` 補上 Vue Splide 的型別橋接，處理套件未從 `exports` 公開 TypeScript 宣告的問題。

### 輪播效果

- 將 `HeroCarousel.vue` 的自製計時器、拖曳與循環位移邏輯替換為 Vue Splide。
- 套用 Ticket Plus 首頁的主要參數：循環播放、作用中圖片置中、7 秒自動切換及 400ms 切換動畫。
- 桌面、平板與手機尺寸分別為 `800 × 500`、`600 × 375`、`343 × 214`。
- 非作用中圖片維持 `scale(0.92)` 與 `opacity: 0.65`，桌面顯示導覽箭頭，手機隱藏箭頭。
- 保留活動詳情頁連結、滑鼠拖曳、觸控滑動、圓點導覽、鍵盤操作及中文無障礙標籤。

### 驗證結果

- `npm run build` 通過，包含 Vue／TypeScript 型別檢查與 Vite 正式建置。
- `HeroCarousel.vue` 與 `env.d.ts` 的 ESLint 檢查通過。
- `npm ls` 確認 Vue Splide 與 Splide Core 均已正確安裝。
- npm audit 回報依賴樹仍有 11 個安全性警告；本次未執行可能連帶升級其他套件的 `npm audit fix`。
