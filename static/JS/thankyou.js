import {logout} from './modules/auth.js';
import { getUserData } from './modules/user.js';
import { backToHomePage} from './modules/ui.js';

let checkBookingButton = document.querySelector(".navigation_button_book");
let title = document.querySelector(".data_block .title");
let orderNumberCaption = document.querySelector(".data_block .order_number_caption");
let orderNumberElement = document.querySelector(".main_content .data_block .order_number");
let notice = document.querySelector(".main_content .data_block .notice");
let footer = document.querySelector(".footer");



async function getOrderResult(){
    let userdata = getUserData();
    if(userdata == false){
        window.location.replace("https://taipeitrips.com");
        return;
    }
    let userId = userdata.id;
    let userName = userdata.name;
    let userAccount = userdata.account;
    let currentUrl = window.location.href;
    let token = localStorage.getItem('token'); //Parse out {orderNumber}
    let url = new URL(currentUrl); //Convert to URL object
    let orderNumber = url.searchParams.get('number'); //Using the searchParams attribute
    url = `https://taipeitrips.com/api/order/${orderNumber}`;
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
        if(statusCode === 403 || statusCode === 401){
            console.error(`status_code: ${statusCode},message: 尚未登入或無權訪問`)
            window.location.replace("https://taipeitrips.com"); 
            return false
        }
        if(statusCode === 200 && responseData.data.data.status === 1){
            title.textContent = "行程付款失敗，尚未扣款";
            orderNumberElement.textContent = orderNumber;
            notice.textContent = "請至預定行程再次嘗試";
            return {"status_code":200,"data":null}
        }
        if(statusCode === 200 && responseData.data.data.status === 0){
            title.textContent = "行程付款成功";
            orderNumberElement.textContent = orderNumber;
            notice.textContent = "請記住此編號，或到會員中心查詢歷史訂單";
            return {"status_code":200,"data":responseData.data.data}
        }
        if(statusCode === 500){
            alert("伺服器錯誤")
            console.error(`status_code: ${statusCode},message:${responseData.data.message}`)
            title.textContent = "行程付款失敗，尚未扣款";
            orderNumberElement.textContent = orderNumber;
            return {"status_code":statusCode,"message":responseData.data.message}
        }
    });
}







function changeToBookingPage(){
    checkBookingButton.addEventListener("click", ()=>{
        let loginResult = getUserData();
        if(loginResult == false){
            alert("尚未登入");
            window.location.replace("https://taipeitrips.com");
        }else{
            window.location.href = "https://taipeitrips.com/booking";
        }
        
    })
}





async function excute(){
    await getOrderResult();
    backToHomePage(); 
    logout();
    changeToBookingPage();
}
excute();
