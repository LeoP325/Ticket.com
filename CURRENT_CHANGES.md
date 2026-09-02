# 購票網站本次變更與設定指南

更新日期：2026-09-02

本文件記錄本次加入的登入、訂單、退票、雙票訂購、活動抽選、粉絲見面會、15,000 席座位圖、Email 驗證調整、多視窗登入修正，以及 MongoDB Atlas 與 Gmail SMTP 正式環境設定方式。

## 1. 功能變更摘要

### 1.1 導覽列登入資訊

使用者登入後，導覽列會顯示：

```text
aaaa，您好!
```

帳號資訊來自 Pinia 使用者 Store，登出後會立即清除。

主要檔案：

- `frontend/src/layouts/default.vue`
- `frontend/src/stores/user.ts`

### 1.2 訂單查詢

登入後可從導覽列進入「訂單查詢」。每筆訂單會顯示：

- 訂單編號與狀態。
- 活動名稱。
- 每張票的座位分區、排號與座號。
- 張數、票價、訂單總額及建立時間。

主要檔案：

- `frontend/src/pages/orders.vue`
- `backend/src/controllers/order.ts`
- `backend/src/models/order.ts`

### 1.3 每個帳號最多訂購兩張票

一般選位活動已由每個帳號一張改為最多兩張：

- 可同時保留一至兩個座位。
- 座位保留時間仍為五分鐘。
- 確認時會將所有保留中的座位建立為同一筆訂單。
- 後端仍會驗證數量上限，不能只靠修改前端繞過限制。

主要檔案：

- `frontend/src/pages/ticket.vue`
- `frontend/src/components/booking/BookingSummary.vue`
- `backend/src/controllers/ticket.ts`
- `backend/src/models/seat.ts`

## 2. 星夜音樂祭 2026 抽選制

### 2.1 活動設定

「星夜音樂祭 2026」已改為：

| 項目 | 設定 |
| --- | --- |
| 售票方式 | 登記抽選 |
| 總容量 | 15,000 席 |
| 座位分區 | 20 區，每區 750 席 |
| 每帳號登記量 | 1 至 2 張 |
| 抽選日 | 2026-09-30 |

抽選日後，管理員可在活動頁執行抽選。抽中者會自動分配座位並建立訂單，未中選者會顯示未中選狀態。

### 2.2 座位圖

座位圖參考台北小巨蛋環繞中央舞台的分區概念，以紅、紫、藍、黃四類區域呈現：

- 20 個分區。
- 每區 750 席。
- 合計 15,000 席。
- 抽中後才產生實際分區、排號與座號。

這個設計不會在後端啟動時建立 15,000 筆實體座位文件，可避免不必要的大量資料庫寫入。

主要檔案：

- `frontend/src/components/booking/ArenaSeatMap.vue`
- `frontend/src/components/booking/RaffleRegistration.vue`
- `frontend/src/pages/events/[slug].vue`
- `backend/src/utils/raffle.ts`

### 2.3 抽選機制

後端使用 Node.js `crypto.randomInt()` 執行 Fisher-Yates 洗牌：

1. 取得所有尚未抽選的登記資料。
2. 使用加密安全亂數打亂登記順序。
3. 依順序分配票券，總張數不超過活動容量。
4. 同一帳號登記兩張時，兩張會一起中選或一起落選。
5. 中選者自動建立訂單與座位標籤。
6. 活動記錄抽選完成時間，避免重複執行。

例如 1,000 張票、2,000 人各登記一張時，系統只會抽出 1,000 人。

抽選 API：

| 方法 | 路徑 | 權限 | 功能 |
| --- | --- | --- | --- |
| `GET` | `/ticket/:eventSlug/raffle` | 登入 | 查詢自己的登記與抽選狀態 |
| `POST` | `/ticket/:eventSlug/raffle` | 登入 | 登記或更新一至兩張票 |
| `POST` | `/ticket/:eventSlug/raffle/draw` | 管理員 | 9/30 後執行抽選 |

主要檔案：

- `backend/src/models/raffleEntry.ts`
- `backend/src/controllers/raffle.ts`
- `backend/src/routes/ticket.ts`
- `backend/src/utils/raffle.ts`

## 3. Email 驗證

### 3.1 註冊與驗證流程

新帳號註冊時必須提供 Email：

1. 後端建立 32-byte 隨機驗證碼。
2. 資料庫只保存驗證碼的 SHA-256 雜湊，不保存原始驗證碼。
3. 驗證碼有效時間為 24 小時。
4. 後端透過 SMTP 寄出驗證連結。
5. 使用者開啟 `/#/verify-email?token=...` 完成驗證。
6. 未驗證 Email 的新帳號不能登入。

既有帳號會在後端啟動時標記為已驗證，避免更新後所有舊帳號都無法登入。

主要檔案：

- `backend/src/configs/mail.ts`
- `backend/src/controllers/auth.ts`
- `backend/src/models/user.ts`
- `frontend/src/pages/register.vue`
- `frontend/src/pages/verify-email.vue`

### 3.2 開發模式與正式模式

- 開發環境未設定 SMTP 時，後端會在終端機輸出驗證連結。
- 正式環境啟動時會主動驗證 SMTP 連線。
- `NODE_ENV=production` 時若缺少 SMTP、寄件人或前端網址設定，後端會拒絕啟動。
- SMTP 成功時會顯示 `SMTP 連線成功`。

正式環境變數範本位於：

```text
backend/.env.example
```

## 4. Gmail 正式寄信設定教學

> 不要將 Gmail 一般登入密碼填入 `SMTP_PASS`。請使用 Google 產生的 16 位數 App Password，也不要把 `.env` 提交到 Git。

### 4.1 準備 Gmail 帳號

建議建立專門寄送系統信件的帳號，例如：

```text
tixlight.service@gmail.com
```

不要使用開發者的私人主帳號寄送正式系統信件。

### 4.2 開啟兩步驟驗證

1. 登入 [Google 帳戶](https://myaccount.google.com/)。
2. 進入「安全性」。
3. 找到「您登入 Google 的方式」。
4. 開啟「兩步驟驗證」。
5. 依畫面完成手機或驗證器設定。

Google App Password 只有在帳號已開啟兩步驟驗證後才能建立。

官方說明：<https://support.google.com/accounts/answer/185833>

### 4.3 建立 App Password

1. 開啟 <https://myaccount.google.com/apppasswords>。
2. 重新驗證 Google 帳號。
3. 應用程式名稱輸入 `TIXLIGHT Backend`。
4. 點擊建立。
5. Google 會顯示一組 16 位數密碼。
6. 立即複製並安全保存；離開畫面後通常無法再次查看。

若看不到 App Password，常見原因包括：

- 尚未開啟兩步驟驗證。
- 公司或學校的 Google Workspace 管理員停用 App Password。
- 帳號只使用安全金鑰進行兩步驟驗證。
- 帳號已啟用 Google Advanced Protection。

Google Workspace 自 2025 年起不再支援直接使用一般帳號密碼的低安全性 SMTP 登入。若組織禁止 App Password，請改用組織允許的 SMTP Relay、OAuth，或 SendGrid、Mailgun、Amazon SES 等寄信服務。

Google Workspace 說明：<https://support.google.com/a/answer/9003945>

### 4.4 設定 `backend/.env`

開啟既有的 `backend/.env`，保留原本的 `DB_URL`、`JWT_SECRET` 與 Cloudinary 設定，再加入：

```env
NODE_ENV=production
FRONTEND_URL=https://你的前端正式網址

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tixlight.service@gmail.com
SMTP_PASS=Google產生的16位數AppPassword
MAIL_FROM=TIXLIGHT <tixlight.service@gmail.com>
```

注意事項：

- `FRONTEND_URL` 必須是使用者實際能開啟的前端正式網址。
- `SMTP_USER` 與 `MAIL_FROM` 建議使用相同 Gmail 地址。
- `SMTP_PASS` 使用 App Password；可移除 Google 顯示時加入的空格。
- 連接埠 `465` 必須搭配 `SMTP_SECURE=true`。
- 若改用連接埠 `587`，通常設定 `SMTP_SECURE=false`，由 STARTTLS 升級連線。
- `.env` 已被 `.gitignore` 排除，不可把正式密碼寫入 `.env.example`。

### 4.5 驗證 SMTP

在 PowerShell 執行：

```powershell
cd backend
npm.cmd run build
npm.cmd start
```

成功時應看到：

```text
SMTP 連線成功
資料庫連線成功
伺服器啟動
```

接著註冊一個新帳號，確認：

1. Gmail 的寄件備份中有驗證信。
2. 收件信箱收到「TIXLIGHT Email 驗證」。
3. 驗證連結指向正確的 `FRONTEND_URL`。
4. 點擊後顯示驗證成功。
5. 驗證前無法登入，驗證後可以登入。

### 4.6 Gmail 常見錯誤

#### `Invalid login`、`535` 或帳號密碼錯誤

- 確認使用的是 App Password，不是一般 Gmail 密碼。
- 確認 `SMTP_USER` 是建立 App Password 的同一帳號。
- 若剛修改 Google 帳號密碼，舊 App Password 可能已被撤銷，需重新建立。

#### 找不到 App Password

- 確認兩步驟驗證已開啟。
- 檢查是否為受組織政策管理的 Workspace 帳號。
- 若組織不允許 App Password，改用 SMTP Relay、OAuth 或專業寄信服務。

#### SMTP 成功但收不到信

- 檢查垃圾郵件與促銷內容分類。
- 確認 `MAIL_FROM` 是允許寄送的帳號或別名。
- 檢查 Gmail 寄件備份與後端錯誤紀錄。
- 大量正式寄信不建議使用一般 Gmail，應改用具備網域驗證、寄信額度與退信管理的服務。

## 5. 多視窗登入修正

### 5.1 原因

原本每個瀏覽器共用一個 HttpOnly Refresh Token Cookie。不同視窗登入不同帳號時，最後一次登入會覆蓋 Cookie。電腦休眠後 Access Token 過期，所有視窗便使用相同 Cookie 刷新成最後登入的帳號。

### 5.2 新設計

- HttpOnly Cookie 作為同一瀏覽器的裝置憑證。
- 每個視窗在 `sessionStorage` 保存獨立 UUID。
- Axios 自動在請求中加入 `X-Session-ID`。
- Refresh Token 資料以「裝置憑證 + 分頁 Session ID」區分。
- 重新整理或休眠喚醒後，各視窗只會刷新自己的帳號。
- 登出只刪除目前分頁的 Refresh Token，不會讓其他分頁登出。
- 使用 `BroadcastChannel` 偵測複製分頁造成的 Session ID 重複，並自動產生新 ID。
- 原始 Refresh Token／裝置憑證仍保存於 HttpOnly Cookie，不會寫入 `localStorage` 或 `sessionStorage`。

主要檔案：

- `frontend/src/utils/session.ts`
- `frontend/src/utils/api.ts`
- `backend/src/utils/session.ts`
- `backend/src/controllers/auth.ts`
- `backend/src/models/refreshToken.ts`

部署這個版本後，舊登入資料沒有 Session ID，因此所有已開啟的舊視窗需要各自重新登入一次。

## 6. MongoDB Atlas Network Access 設定

後端只能從 Atlas IP Access List 允許的來源連線資料庫。

### 6.1 加入目前開發電腦 IP

1. 登入 <https://cloud.mongodb.com/>。
2. 選擇正確的 Organization 與 Project。
3. 左側進入 `Security` → `Network Access`。
4. 點擊 `Add IP Address`。
5. 點擊 `Add My Current IP Address`。
6. Description 輸入 `Home development PC`。
7. 可選擇建立暫時規則，讓規則在指定時間後自動過期。
8. 點擊 `Add Entry`。
9. 等候一至兩分鐘後重新啟動後端。

官方說明：

- <https://www.mongodb.com/docs/atlas/security/quick-start/>
- <https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/>

### 6.2 正式部署注意事項

- 正式部署時加入的是後端主機的固定出口公網 IP，不是家中電腦 IP。
- 若主機沒有固定出口 IP，需依代管平台文件設定固定 IP、Private Endpoint 或其他網路方案。
- 建議只允許必要的單一 IP `/32` 或最小 CIDR 範圍。
- 不建議正式環境長期使用 `0.0.0.0/0`，因為這會允許任何網路來源嘗試連線。
- IP Access List 只控制網路來源，仍須使用強密碼的 Atlas Database User。

MongoDB 網路安全建議：<https://www.mongodb.com/docs/atlas/architecture/current/network-security/>

## 7. 環境變數總覽

正式後端至少需要：

```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://你的前端正式網址
JWT_SECRET=長且隨機的JWT密鑰
DB_URL=mongodb+srv://使用者:密碼@叢集/資料庫

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=寄信帳號@gmail.com
SMTP_PASS=16位數AppPassword
MAIL_FROM=TIXLIGHT <寄信帳號@gmail.com>

CLOUDINARY_CLOUD_NAME=Cloudinary名稱
CLOUDINARY_API_KEY=Cloudinary金鑰
CLOUDINARY_API_SECRET=Cloudinary密鑰
```

不要提交下列敏感資訊：

- `DB_URL` 中的帳號與密碼。
- `JWT_SECRET`。
- `SMTP_PASS`。
- Cloudinary API Secret。

## 8. 驗證結果

本次已完成：

- 後端 TypeScript 建置通過。
- 後端六項測試通過。
- 已驗證 15,000 席分區邊界。
- 已驗證 2,000 人登記 1,000 張票時只抽出 1,000 人。
- 已驗證分頁 Session ID 僅接受有效 UUID。
- 前端 ESLint 通過。
- Vue／TypeScript 型別檢查通過。
- Vite 正式建置通過。
- 正式環境缺少 SMTP 設定時會正確拒絕啟動。

完整 Atlas、SMTP 與多視窗端到端測試，需先完成 Atlas IP Access List 與 Gmail App Password 設定。

## 9. 2026-08-28 最新變更

### 9.1 粉絲見面會抽選

- 活動代碼：`fan-meeting-2026`。
- 每個帳號限登記一次，抽選 5 位幸運粉絲。
- 抽選時間為 2026-08-28 11:35（Asia/Taipei）。
- 後端到點自動抽選；若服務當時未運行，重新啟動後會補執行。
- 本次共有 12 人登記，已抽出 5 位中選者與 7 位未中選者。
- 粉絲見面會不顯示星夜音樂祭的 15,000 席場館圖。

### 9.2 管理員中選名單

- 管理員登入後，可在活動頁的抽選卡片查看中選帳號名單。
- `GET /ticket/:eventSlug/raffle` 只會對管理員回傳 `winnerAccounts`。
- 一般會員只能查看自己的登記與中選狀態，不能取得其他帳號資料。

主要檔案：

- `backend/src/controllers/raffle.ts`
- `frontend/src/components/booking/RaffleRegistration.vue`
- `frontend/src/types/ticket.ts`

### 9.3 退票機制

- 已付款訂單可從訂單查詢頁執行退票。
- 退票採一次性狀態鎖定，已退票訂單不能重複操作。
- 一般選位訂單退票後會釋放原座位，供其他會員重新選購。
- 若座位釋放失敗，訂單會回復為已付款狀態，避免資料不一致。
- 退票 API：`POST /orders/:id/refund`，僅能操作自己的訂單。

### 9.4 Email 驗證暫停

- 新帳號註冊後可直接登入，不再寄送 Email 驗證信。
- 既有未驗證帳號也可登入。
- 驗證欄位、頁面與 API 暫時保留，方便日後恢復。
- 管理員登入設定已更新；密碼不記錄於文件或原始碼。

### 9.5 管理員登入裝置與 IP 歷史紀錄

- 每次成功登入會記錄帳號、裝置類型、作業系統、瀏覽器、User-Agent、來源 IP 與登入時間。
- 登入歷史使用獨立的 MongoDB `loginHistory` 集合保存，不會寫入密碼或 Access Token。
- 管理員可從導覽列的「裝置紀錄」進入 `/admin/login-history` 查看所有帳號的登入歷史。
- 管理員表格會顯示帳號註冊後已加入多久；計算基準為使用者資料的 `createdAt`。
- 後端查詢 API 為 `GET /users/login-history`，同時受 JWT 與管理員權限 middleware 保護。
- 後端信任一層反向代理，以取得常見正式部署環境轉送的真實來源 IP。
- 功能加入前的舊登入紀錄沒有 IP，管理員頁面會顯示「未記錄」；新登入才會開始記錄。

主要檔案：

- `backend/src/models/loginHistory.ts`
- `backend/src/utils/device.ts`
- `backend/src/controllers/auth.ts`
- `backend/src/controllers/user.ts`
- `backend/src/routes/user.ts`
- `frontend/src/pages/admin/login-history.vue`
- `frontend/src/components/admin/DeviceHistoryTable.vue`
- `frontend/src/services/admin.ts`
- `frontend/src/quries/admin.ts`
- `frontend/src/types/admin.ts`

驗證結果：

- 後端 TypeScript 建置與 5 項測試通過。
- 本次新增及修改檔案的 ESLint 檢查通過。
- Vue／TypeScript 型別檢查與 Vite 正式建置通過。

### 9.6 使用者個人資料與暱稱

- 註冊頁新增可選填的暱稱欄位，暱稱最長 30 個字。
- 登入會員可從導覽列進入 `/profile` 修改 Email、暱稱與密碼。
- 修改密碼時必須輸入目前密碼，後端核對成功後才會更新；新密碼仍由既有 bcrypt pre-save middleware 加密。
- 修改 Email 時會沿用唯一性與 Email 格式驗證，重複信箱會回傳衝突錯誤。
- 登入與 Refresh API 會回傳 Email 與暱稱，Pinia store 作為前端會員資料的單一狀態來源。
- 有暱稱時，網站問候顯示為「（暱稱）您好」；未設定暱稱時仍顯示帳號問候。
- 個人資料 API：`PATCH /users/profile`，需通過 JWT 驗證。

主要檔案：

- `backend/src/models/user.ts`
- `backend/src/utils/profile.ts`
- `backend/src/controllers/user.ts`
- `backend/src/controllers/auth.ts`
- `backend/src/routes/user.ts`
- `frontend/src/pages/profile.vue`
- `frontend/src/components/profile/ProfileForm.vue`
- `frontend/src/pages/register.vue`
- `frontend/src/stores/user.ts`
- `frontend/src/layouts/default.vue`

驗證結果：

- 後端 TypeScript 建置與 6 項測試通過。
- 本次相關後端與前端檔案的 ESLint 檢查通過。
- Vue／TypeScript 型別檢查與 Vite 正式建置通過。

## 10. 2026-09-01 最新變更

### 10.1 粉絲見面會活動主視覺

- 重新生成粉絲見面會專用的橫幅圖片，取代原先誤用的星夜音樂祭圖片。
- 主視覺採室內小型舞台、粉絲近距離互動及粉紫／玫瑰金燈光，並在左側保留首頁文案空間。
- 圖片不包含文字、Logo 或浮水印，尺寸為 1898 × 829。
- 首頁輪播、活動列表與活動詳情頁現在都會使用新的粉絲見面會圖片。
- 後端活動目錄的圖片名稱同步更新為 `fan-meeting-2026.png`。

主要檔案：

- `frontend/src/assets/fan-meeting-2026.png`
- `frontend/src/data/event.ts`
- `backend/src/data/catalog.ts`

驗證結果：

- Vue／TypeScript 型別檢查與 Vite 正式建置通過。

### 10.2 前端 Agent Skills

前端專案的本機 skills 位於 `frontend/.agents/skills`，目前包含：

- `frontend-ui-ux-design`：主要 UI／UX、響應式與無障礙設計規範。
- `design-taste-frontend`：首頁、Landing Page 與活動視覺改版時選用。
- `vue-best-practices`：Vue 3、Composition API、TypeScript 與元件架構規範。
- `vue-testing-best-practices`：Vue 單元、元件與端對端測試規範。
- `vue-router-best-practices`：Vue Router 導航守衛與路由生命週期規範。

其中三個 Vue skills 由 `antfu/skills` 安裝，版本來源記錄於：

- `frontend/skills-lock.json`

## 11. 2026-09-02 後端 TypeScript 化確認

- `backend/src` 內的 42 個後端原始碼檔案皆為 `.ts` 或 `.d.ts`，沒有殘留 `.js` 原始碼。
- TypeScript 設定以 `backend/src` 為輸入、`backend/dist` 為輸出。
- `backend/dist` 內的 `.js` 是 `tsc` 產生、供 Node.js 執行的編譯產物，因此維持 JavaScript 格式。
- 開發環境透過 `npm run dev` 執行 `src/index.ts`；正式環境先執行 `npm run build`，再透過 `npm start` 執行 `dist/index.js`。

驗證結果：

- `npm run build` 通過。
- 後端 6 項自動化測試全部通過。
