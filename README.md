# <a href="https://taipeitrips.com/" target="_blank">台北一日遊</a>
台北一日遊是一個旅遊電商網站，可以讓您搜尋、預定景點，並透過第三方金流使用信用卡付款。

## 主要功能

1. **景點搜尋**  
   使用景點名稱、捷運站名稱或關鍵字，快速搜尋附近的景點資訊。
   
2. **行程預訂**  
   搜尋後可以查看詳細的景點資料，並進行行程預訂。

3. **線上付款**  
   集成 TapPay 金流服務，使用者可輕鬆完成付款並取得訂單編號。

4. **延遲載入功能**  
   在瀏覽大量景點資料時，實現延遲載入以提升網站效能。

5. **滾動式呈現**  
   支持滾動式呈現大量景點資訊，讓用戶可以快速瀏覽。

6. **景點畫面輪播**  
   每個景點有豐富的圖片資料，並通過輪播圖呈現。

## 測試用

- 帳號：`test@gmail.com`
- 密碼：`12345678`
- 手機號碼：`0912345678`
- 卡片號碼：`4242 4242 4242 4242`
- 過期時間：`12/25` （有效期間內即可）
- 驗證密碼：`123`

## 系統架構

1. **Git Flow 開發流程**  
   透過 Git Flow 的方式開發，確保各個版本的控制。

2. **前後端分離架構**  
   前端使用 HTML、CSS 和 JavaScript，後端採用 Python FastAPI，並基於 MVC（Model-View-Controller）設計模式模組化開發。

3. **資料庫設計**  
   使用 MySQL 作為資料庫，保存會員、景點、預訂及訂單等資料。

4. **Nginx 反向代理與 SSL 支援**  
   網站透過 Nginx 作為反向代理，並配置 SSL 證書提供 https 支援，提升網站安全性。

5. **Docker 容器化**  
   使用 Docker 來打包應用程式及其依賴，並部署至 AWS EC2 上，確保一致性和可移植性。

6. **域名與 DNS 設置**  
   購買自定義域名並使用 AWS Route53 作為 DNS 伺服器進行管理。

7. **伺服器**  
   網站運行於 AWS EC2 實例中，並通過 Docker 管理部署。

## 資料庫架構
![資料庫架構圖](https://github.com/user-attachments/assets/027ffdb9-fddd-46b7-afd4-db97b461b06d)


- **`member`** : 儲存會員相關資料
- **`attractions`、`images`** : 儲存景點相關資訊
- **`booking`** : 預定資料
- **`orders`** : 訂單資料

## 網頁功能操作

### Lazy Loading
![Lazy Loading](https://github.com/WilliamTsai1227/taipei-day-trip-website/blob/72a6ab0357cd5dc2fb8e5b52e2a316c3ddb742c0/gif/Lazy%20loading.gif)
