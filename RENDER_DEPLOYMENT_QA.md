# Render 部署問題與解答

本文件整理此專案部署到 Render 時遇到的問題與處理方式。

## 1. 為什麼執行 `npm install` 時找不到 `package.json`？

錯誤訊息：

```text
npm error code ENOENT
npm error path /opt/render/project/src/package.json
npm error enoent Could not read package.json
```

### 原因

此專案的前後端放在同一個 GitHub repository，但根目錄沒有 `package.json`：

```text
專案根目錄/
├─ frontend/
│  └─ package.json
└─ backend/
   └─ package.json
```

Render 預設在 repository 根目錄執行 `npm install`，因此找不到檔案。

### 解法

在 Render 服務中設定正確的 **Root Directory**：

- 後端服務：`backend`
- 前端服務：`frontend`

## 2. GitHub 上的前後端一定要拆成兩個 repository 嗎？

不需要。前後端可以放在同一個 GitHub repository。

不過，在 Render 上通常要建立兩個服務，並讓兩個服務連接同一個 repository：

| 用途 | Render 服務類型 | Root Directory |
|---|---|---|
| 前端 | Static Site | `frontend` |
| 後端 | Web Service | `backend` |

## 3. 後端服務應如何設定？

```text
Service Type: Web Service
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
```

後端至少需要設定：

```text
DB_URL=MongoDB 連線字串
JWT_SECRET=自行產生的安全隨機字串
```

Render 的 Node.js 執行環境會自動將 `NODE_ENV` 設為 `production`，通常不必手動新增。

後端使用 Render 提供的 `PORT` 啟動服務，不需要自行固定連接埠。

## 4. 前端服務應如何設定？

```text
Service Type: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

前端需要設定後端 API 網址：

```text
VITE_API_URL=https://你的後端服務.onrender.com
```

請勿在網址末尾加 `/`，除非後端 API 設計明確需要。

## 5. 尚未設定 SMTP，如何讓後端先成功部署？

原本程式會在 production 環境檢查以下變數，缺少時直接終止：

```text
SMTP_HOST
SMTP_USER
SMTP_PASS
MAIL_FROM
FRONTEND_URL
```

目前已改成只有設定下列變數時，才會強制檢查 SMTP：

```text
REQUIRE_SMTP=true
```

因此，尚未完成信箱設定時，請不要設定 `REQUIRE_SMTP=true`。後端可以繼續啟動，但郵件只會使用開發模式，不會真的寄給使用者。

日後需要正式啟用郵件時，再設定：

```text
SMTP_HOST=SMTP 主機
SMTP_PORT=SMTP 連接埠
SMTP_USER=SMTP 帳號
SMTP_PASS=SMTP 密碼或應用程式密碼
SMTP_SECURE=true 或 false
MAIL_FROM=寄件者名稱與信箱
FRONTEND_URL=https://正式前端網址
REQUIRE_SMTP=true
```

## 6. 為什麼 Render 顯示 `No open ports detected`？

當時後端在執行 `app.listen()` 前，就因缺少 SMTP 環境變數而拋出錯誤並停止，所以 Render 掃描不到開放的連接埠。

這不是 `PORT` 本身的問題。SMTP 檢查不再中止程式後，只要資料庫連線及其他啟動流程成功，後端就會使用 Render 提供的 `PORT` 啟動。

## 7. `FRONTEND_URL` 要填什麼？

`FRONTEND_URL` 是使用者實際開啟的前端公開網址，不是後端 API 網址。

若前端部署在 Render：

```text
FRONTEND_URL=https://你的前端服務.onrender.com
```

若前端部署在 GitHub Pages：

```text
FRONTEND_URL=https://你的帳號.github.io/你的專案名稱
```

請不要在結尾加入 `/`、`/#/` 或特定頁面路徑。程式會自行產生例如：

```text
https://你的前端服務.onrender.com/#/verify-email?token=...
```

### 在 Render 中設定的位置

1. 開啟後端 Web Service。
2. 選擇左側的 **Environment**。
3. 在 **Environment Variables** 新增 `FRONTEND_URL`。
4. 儲存並重新部署。

若目前完全停用郵件功能，`FRONTEND_URL` 可以暫時不設定。

## 8. 前端部署後無法呼叫後端 API，可能是什麼原因？

後端有設定 CORS 白名單。前端網址若不在白名單中，瀏覽器會阻擋 API 請求。

目前後端白名單位於：

```text
backend/src/index.ts
```

正式部署前，應將實際的前端 origin 加入白名單，例如：

```text
https://你的前端服務.onrender.com
```

Origin 只包含協定、網域及連接埠，不包含 `/`、`/#/` 或其他路徑。

## 9. 建議的部署順序

1. 建立 Render 後端 Web Service，Root Directory 設為 `backend`。
2. 設定 `DB_URL`、`JWT_SECRET`，部署後端。
3. 取得後端公開網址。
4. 建立 Render 前端 Static Site，Root Directory 設為 `frontend`。
5. 將 `VITE_API_URL` 設為後端公開網址，部署前端。
6. 取得前端公開網址。
7. 將前端網址設為後端的 `FRONTEND_URL`，並加入後端 CORS 白名單。
8. 重新部署後端。
9. SMTP 完成後再加入郵件環境變數及 `REQUIRE_SMTP=true`。

## 10. 前後端環境變數對照

| 設定位置 | 變數 | 用途 |
|---|---|---|
| 前端 Static Site | `VITE_API_URL` | 告訴前端後端 API 在哪裡 |
| 後端 Web Service | `FRONTEND_URL` | 產生信箱驗證及活動頁面的前端連結 |
| 後端 Web Service | `DB_URL` | 連接 MongoDB |
| 後端 Web Service | `JWT_SECRET` | 簽署登入權杖 |
| 後端 Web Service | `REQUIRE_SMTP` | 設為 `true` 時強制要求完整 SMTP 設定 |

