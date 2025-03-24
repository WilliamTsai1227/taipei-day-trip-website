# <a href="https://taipeitrips.com/" target="_blank">台北一日遊</a>
Taipei-Day-Trip is a travel e-commerce website that allows you to browse, search, book attractions, register & log in to a member account, and pay by credit card through third-party payment methods.

台北一日遊是一個旅遊電商網站，可以讓您瀏覽、搜尋、預定景點、註冊＆登入會員帳號，並透過第三方金流使用信用卡付款。  

## Live Demo  
https://taipeitrips.com/  

## 測試用  
You can preview information about attractions by entering the website. If you want to book a travel date and time, you need to log in. The following are the test accounts and passwords.  

進入網站即可預覽景點相關資訊，若想要預定行程日期及時段，需要登入才可以使用。以下是測試帳號及密碼。  

| 帳號           | 密碼     | 手機號碼   |
|---------------|----------|------------|
| test@gmail.com | 12345678 | 0912345678 |

| 卡片號碼            | 過期時間 | 驗證密碼 |
|--------------------|----------|----------|
| 4242 4242 4242 4242 | 12/25    | 123      |  


## 開發流程

1. **前端開發**

   Implemented based on Figma designs, using HTML, CSS, and JavaScript to complete the layout and front-end functionality, ensuring the interface meets design specifications and user interactions work as intended.  

   依據 Figma 文件進行規劃與設計，使用 HTML、CSS 和 JavaScript 完成網頁切版與前端功能實作，確保介面符合設計規格及使用者互動功能正常。  

2. **資料處理與儲存**

   Used a Python script to extract and organize attraction data from the taipei-attractions.json file. The data was standardized and stored in a MySQL database for easy access and management.    

   使用Python 程式統⼀將景點資料從taipei-attractions.json中提取並整理景點資料，統一結構化後存入 MySQL 資料庫以便存取與管理。  

3. **後端開發**

   Adopted Python FastAPI as the backend framework with a front-end and back-end separation architecture. Through RESTful API design, the front-end uses AJAX to send requests to the backend, which returns a JSON response after processing the request.  

   採用 Python FastAPI 作為後端框架，採用前後端分離架構。採用 RESTful API 設計，前端利用 AJAX 技術發送 Request 向後端獲取數據，後端接收請求後回傳 JSON 格式的 Response。  

4. **版本控制與協作**

   Used Git/GitHub to create a develop branch for new feature development. After weekly development is completed, submitted a Pull Request to the Reviewer, and after review and approval, merged the develop branch into the main branch.  

   使用 Git/GitHub 建立 `develop` 分支進行新功能開發。每週開發完成後，向 Reviewer 提交 Pull Request，經審核同意後將 `develop` 分支合併至 `main` 分支。  

5. **部署與測試** 

   During the local development phase, used Postman to test the API, ensuring functionality and expected behavior. After development was completed, deployed the project using Docker to sync with the EC2 instance, and then used Postman again to verify the API's accuracy in the live environment, ensuring the system operated correctly.  

   在本地開發階段，使用 Postman 對 API 進行測試，確保功能正常並符合預期。開發完成後，將專案同步部署至 EC2 Instance，並再次利用 Postman 驗證 API 在實際環境中正確性，確保整體系統運作無誤。  
   

## 主要功能

1. **景點搜尋**  
   Quickly search for nearby attractions using keywords from attraction or metro station names.   
   使用景點或捷運站名稱關鍵字，快速搜尋附近的景點資訊。    

2. **註冊並登入會員帳戶**   
   Users can register and log in to their accounts to book trips and make payments.  
   使用者可以註冊並登入會員帳戶，以進行預訂行程與付款。  
   
3. **行程預訂**    
   After searching for attractions, users can view detailed information and log in to book trips.  
   搜尋景點後可以查看詳細的景點資料，並登入會員進行預訂行程。  

4. **線上付款**  
   Integrated TapPay payment service, allowing users to easily complete payments and receive an order number.    
   集成 TapPay 金流服務，使用者可輕鬆完成付款並取得訂單編號。  

5. **延遲載入功能**  
   Implemented lazy loading while browsing a large amount of attraction data to improve website performance.   
   在瀏覽大量景點資料時，實現延遲載入以提升網站效能。  

6. **景點畫面輪播**   
   The images of each attraction are displayed through a carousel.  
   每個景點的圖片資料透過輪播圖呈現。  

## 系統架構  
  
- **系統架構圖**     
![Image](https://github.com/user-attachments/assets/cc9b5ea3-9ae6-4a9d-b7ad-fc351d2ddea0)   
    
1. **Git Flow 開發流程**

   Developed using Git Flow to ensure version control across different stages.  

   透過 Git Flow 的方式開發，確保各個版本的控制。  

2. **前後端分離架構**

   The front-end uses HTML, CSS, and JavaScript, while the back-end is built with Python FastAPI, communicating through RESTful APIs. The back-end follows the MVC (Model-View-Controller) architecture for development.  

   前端使用 HTML、CSS 和 JavaScript，後端採用 Python FastAPI，通過 RESTful API 進行通信。    
   後端基於 MVC 模式進行開發。  

3. **資料庫設計**

   Used MySQL as the database to store data such as member information, attractions, bookings, and orders.  

   使用 MySQL 作為資料庫，保存會員、景點、預訂及訂單等資料。  

4. **Nginx 反向代理與 SSL 支援**

   The website uses Nginx as a reverse proxy and configures an SSL certificate to provide HTTPS support, enhancing website security.  

   網站透過 Nginx 作為反向代理，並配置 SSL 證書提供 https 支援，提升網站安全性。  

5. **Docker 容器化**

   Used Docker to package the application and its dependencies into a Docker image, and uploaded it to Docker Hub. During deployment, the image is pulled from Docker Hub and deployed in a container on AWS EC2, ensuring consistency and portability across different environments.  

   使用 Docker 將程式及其依賴打包為 Docker 映像檔（Docker Image），並上傳至 Docker Hub。部署時從 Docker Hub 拉取映像檔，在 AWS EC2 上運行容器，確保應用程式在不同環境中的一致性和可移植性。  

6. **域名與 DNS 設置**

   Purchased a custom domain on GoDaddy and used AWS Route 53 as the DNS server for management and configuration.   

   在GoDaddy上購買自定義域名，並使用 AWS Route53 作為 DNS 伺服器進行管理配置。  

7. **伺服器**

   The website runs on an AWS EC2 instance and is managed and deployed through Docker.   

   網站運行於 AWS EC2 實例中，並通過 Docker 管理部署。    

## 資料庫架構  
![資料庫架構圖](https://github.com/user-attachments/assets/027ffdb9-fddd-46b7-afd4-db97b461b06d)  


- **`member`** : 儲存會員相關資料
- **`attractions`、`images`** : 儲存景點相關資訊
- **`booking`** : 預定資料
- **`orders`** : 訂單資料

## RESTful API
The project follows a front-end and back-end separation approach. The back-end provides different data based on the request methods sent by the front-end, using a RESTful API for communication.

專案採用前後端分離的開發架構，透過 RESTful API 與後端進行資料交互，根據前端發送的不同請求方法，從後端獲取相應的資料。

⚠️ Developed according to the specification of RESTful API（Not involved in planning）

## 網頁功能操作  
The following is a demonstration video of the web page functions. You can click on the video thumbnails to watch the demonstration of each function.

以下是網頁功能的演示影片，您可以點擊影片縮圖來觀看每個功能的演示。  

### 延遲載入 (Lazy Loading)    
Implemented Lazy Loading and Infinite Scroll using JavaScript. By delaying the loading of resources until needed, reduced the browser's loading burden and improved the user experience.  

使用 Javascript 實踐 Lazy Loading 和 Infinite Scroll。透過延遲，在需要時才載入所需資源，降低瀏覽器載入負擔，提升使用者體驗。  

[![Lazy Loading](https://img.youtube.com/vi/p7z0Wfa3WRc/0.jpg)](https://youtu.be/p7z0Wfa3WRc)

### 搜尋景點功能     
Quickly find the desired attractions using keyword search.  

使用關鍵字搜尋可以快速找到想要的景點。  

[![搜尋景點功能](https://img.youtube.com/vi/qf-TZbt3Xis/0.jpg)](https://youtu.be/qf-TZbt3Xis)

### 註冊並登入會員  
Users can register and log in to their accounts to book trips.  

使用者可以註冊並登入會員以便預約行程。  

[![註冊並登入會員](https://img.youtube.com/vi/J1sV6ThiDC8/0.jpg)](https://youtu.be/J1sV6ThiDC8)

### 預訂行程功能  
⚠️ The user needs to become a member to use the function of booking itinerary and payment.  

⚠️ 使用者需要成為會員才可以使用預約行程與付款的功能。    

[![預訂行程功能](https://img.youtube.com/vi/lXXNnQxh8Z8/0.jpg)](https://youtu.be/lXXNnQxh8Z8)

### 串接第三方金流付款(TapPay)   
Use TapPay to connect to a third-party cash flow system. After the credit card is successfully authenticated, the user completes the payment.  

使用 TapPay 串接第三方金流系統，信用卡認證成功後，使用者完成付款。  

[![串接第三方金流付款](https://img.youtube.com/vi/FJmj-lv3Wuw/0.jpg)](https://youtu.be/FJmj-lv3Wuw)

### 響應式網頁設計 (RWD)      

[![響應式網頁設計 (RWD)](https://img.youtube.com/vi/Q05kZzArVnU/0.jpg)](https://youtu.be/Q05kZzArVnU)

### 驗證帳號是否已註冊   
A reminder message will appear if the user's account is already registered.  

當用戶帳號已註冊過，會跳出提醒字樣。  

[![驗證帳號是否已註冊過](https://img.youtube.com/vi/3tQ3ZNau7PQ/0.jpg)](https://youtu.be/3tQ3ZNau7PQ)

### 註冊/登入格式確認   
During registration/login, the front-end will check if the input format is correct.  

註冊/登入時，前端會檢查輸入格式是否正確。  

[![註冊格式確認](https://img.youtube.com/vi/Noq6TNDL6QE/0.jpg)](https://youtu.be/Noq6TNDL6QE)   

[![登入格式確認](https://img.youtube.com/vi/BW3QHFk-2gY/0.jpg)](https://youtu.be/BW3QHFk-2gY)

