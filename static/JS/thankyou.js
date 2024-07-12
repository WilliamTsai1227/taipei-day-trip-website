let signoutButton = document.querySelector(".navigation_button_signout");
let checkBookingButton = document.querySelector(".navigation_button_book");
let title = document.querySelector(".data_block .title");
let orderNumberCaption = document.querySelector(".data_block .order_number_caption");
let orderNumberElemet = document.querySelector(".main_content .data_block .order_number");
let notice = document.querySelector(".main_content .data_block .notice");
let footer = document.querySelector(".footer");



async function getOrderResult(){
    let userdata = getUserData();
    if(userdata == false){
        window.location.replace("http://34.223.129.79:8000/");
        return;
    }
    let userId = userdata.id;
    let userName = userdata.name;
    let userAccount = userdata.account;
    let currentUrl = window.location.href;
    let token = localStorage.getItem('token');
    // 解析出 {orderNumber}
    let url = new URL(currentUrl); //轉換成URL對象
    let orderNumber = url.searchParams.get('number'); //使用searchParams屬性
    url = `http://34.223.129.79:8000/api/order/${orderNumber}`;
    fetch(url,{
        method: 'GET',  
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
    .then(response => {
        const statusCode = response.status;
        return response.json().then(data => ({
            statusCode: statusCode,
            data: data
        }));
    })
    .then(responseData => {
        let statusCode = responseData.statusCode;
        if(statusCode === 403){
            console.error(`status_code: ${statusCode},message: 尚未登入`)
            window.location.replace("http://34.223.129.79:8000"); //返回首頁
            return false
        }
        if(statusCode === 200 && responseData.data.data === null){
            title.textContent = "行程預定失敗，尚未扣款";
            orderNumberElemet.textContent = orderNumber;
            notice.textContent = "請至預定行程嘗試再次付款";
            return {"status_code":200,"data":null}
        }
        if(statusCode === 200 && responseData.data.data !== null){
            title.textContent = "行程預定成功";
            orderNumberElemet.textContent = orderNumber;
            notice.textContent = "請記住此編號，或到會員中心查詢歷史訂單";
            return {"status_code":200,"data":responseData.data.data}
        }
        if(statusCode === 500){
            alert("伺服器錯誤")
            console.error(`status_code: ${statusCode},message:${responseData.data.message}`)
            title.textContent = "行程預定失敗，尚未扣款";
            orderNumberElemet.textContent = orderNumber;
            return {"status_code":statusCode,"message":responseData.data.message}
        }
    });
}



//返回首頁按紐
function backToHomePage(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.href = "http://34.223.129.79:8000";
    })
}



//查看預定行程按鈕
function changeToBookingPage(){
    checkBookingButton.addEventListener("click", ()=>{
        let loginResult = getUserData();
        if(loginResult == false){
            alert("尚未登入");
            window.location.replace("http://34.223.129.79:8000/");
        }else{
            window.location.href = "http://34.223.129.79:8000/thankyou";
        }
        
    })
}



//取得現在登入使用者資料

async function getUserData() {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            signoutButton.style.display = "flex";
            return false;
        }

        const response = await fetch('http://34.223.129.79:8000/api/user/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let responseData = await response.json();
        
        if (responseData.data === null) {
            return false;
        }

        if (responseData.data) {
            let id = responseData.data.id; //取得會員資訊
            let name = responseData.data.name;
            let account = responseData.data.email;
            signoutButton.style.display = "flex";
            return { "id": id, "name": name, "account": account };
        }
    } catch (error) {
        console.error('getUserData() error occurred:', error.message);
        return false;
    }
}
//登出

function logout(){
    signoutButton.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.replace("http://34.223.129.79:8000");
    })
}



async function excute(){
    await getOrderResult();
    backToHomePage(); 
    logout();
    changeToBookingPage();
}
excute();
