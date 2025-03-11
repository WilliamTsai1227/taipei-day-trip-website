# <a href="https://taipeitrips.com/" target="_blank">台北一日遊</a>
台北一日遊是一個旅遊電商網站，可以讓您搜尋、預定景點，並透過第三方金流使用信用卡付款。  
可以點擊上方連接查看網站。

## 主要功能

1. **景點搜尋**  
   使用捷運站名稱關鍵字，快速搜尋附近的景點資訊。  

2. **註冊並登入會員帳戶**  
   使用者可以註冊並登入會員帳戶，以進行預訂行程與付款。
   
3. **行程預訂**  
   搜尋後可以查看詳細的景點資料，並登入會員進行預訂行程。

4. **線上付款**  
   集成 TapPay 金流服務，使用者可輕鬆完成付款並取得訂單編號。

5. **延遲載入功能**  
   在瀏覽大量景點資料時，實現延遲載入以提升網站效能。

6. **景點畫面輪播**  
   每個景點的圖片資料透過輪播圖呈現。

## 測試用

- 帳號：`test@gmail.com`
- 密碼：`12345678`
- 手機號碼：`0912345678`
- 卡片號碼：`4242 4242 4242 4242`
- 過期時間：`12/25` （有效期間內即可）
- 驗證密碼：`123`

## 系統架構
  
- **系統架構圖**  
![Image](https://github.com/user-attachments/assets/3e0d1cc0-99a3-464a-9fd4-638a026d9390)  
    
1. **Git Flow 開發流程**  
   透過 Git Flow 的方式開發，確保各個版本的控制。

2. **前後端分離架構**  
   前端使用 HTML、CSS 和 JavaScript，後端採用 Python FastAPI，通過 RESTful API 進行通信。  
   後端基於 MVC 模式進行模組化開發。

3. **資料庫設計**  
   使用 MySQL 作為資料庫，保存會員、景點、預訂及訂單等資料。

4. **Nginx 反向代理與 SSL 支援**  
   網站透過 Nginx 作為反向代理，並配置 SSL 證書提供 https 支援，提升網站安全性。

5. **Docker 容器化**  
   使用 Docker 將程式及其依賴打包為 Docker 映像檔（Docker Image），並上傳至 Docker Hub。部署時從 Docker Hub 拉取映像檔，在 AWS EC2 上運行容器，確保應用程式在不同環境中的一致性和可移植性。

6. **域名與 DNS 設置**  
   在GoDaddy上購買自定義域名，並使用 AWS Route53 作為 DNS 伺服器進行管理配置。

7. **伺服器**  
   網站運行於 AWS EC2 實例中，並通過 Docker 管理部署。  

## 資料庫架構
![資料庫架構圖](https://github.com/user-attachments/assets/027ffdb9-fddd-46b7-afd4-db97b461b06d)


- **`member`** : 儲存會員相關資料
- **`attractions`、`images`** : 儲存景點相關資訊
- **`booking`** : 預定資料
- **`orders`** : 訂單資料

## 網頁功能操作
以下是網頁功能的演示影片，您可以點擊影片縮圖來觀看每個功能的演示。

### 延遲載入 (Lazy Loading)  

[![Lazy Loading](https://img.youtube.com/vi/p7z0Wfa3WRc/0.jpg)](https://youtu.be/p7z0Wfa3WRc)

### 搜尋景點功能   

[![搜尋景點功能](https://img.youtube.com/vi/qf-TZbt3Xis/0.jpg)](https://youtu.be/qf-TZbt3Xis)

### 預訂行程功能    

[![預訂行程功能](https://img.youtube.com/vi/lXXNnQxh8Z8/0.jpg)](https://youtu.be/lXXNnQxh8Z8)

### 串接第三方金流付款    

[![串接第三方金流付款](https://img.youtube.com/vi/FJmj-lv3Wuw/0.jpg)](https://youtu.be/FJmj-lv3Wuw)

### 響應式網頁設計 (RWD)    

[![響應式網頁設計 (RWD)](https://img.youtube.com/vi/Q05kZzArVnU/0.jpg)](https://youtu.be/Q05kZzArVnU)

### 註冊並登入會員    

[![註冊並登入會員](https://img.youtube.com/vi/J1sV6ThiDC8/0.jpg)](https://youtu.be/J1sV6ThiDC8)

### 驗證帳號是否已註冊    

[![驗證帳號是否已註冊過](https://img.youtube.com/vi/3tQ3ZNau7PQ/0.jpg)](https://youtu.be/3tQ3ZNau7PQ)

### 註冊格式確認    

[![註冊格式確認](https://img.youtube.com/vi/Noq6TNDL6QE/0.jpg)](https://youtu.be/Noq6TNDL6QE)

### 登入格式確認    

[![登入格式確認](https://img.youtube.com/vi/BW3QHFk-2gY/0.jpg)](https://youtu.be/BW3QHFk-2gY)

