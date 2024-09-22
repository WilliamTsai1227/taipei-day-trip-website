let signoutButton = document.querySelector(".navigation_button_signout");
let checkBookingButton = document.querySelector(".navigation_button_book");
let title = document.querySelector(".data_block .title");
let orderNumberCaption = document.querySelector(".data_block .order_number_caption");
let orderNumberElement = document.querySelector(".main_content .data_block .order_number");
let notice = document.querySelector(".main_content .data_block .notice");
let footer = document.querySelector(".footer");



async function getOrderResult(){
    let userdata = getUserData();
    if(userdata == false){
        window.location.replace("http://taipeitrips.com");
        return;
    }
    let userId = userdata.id;
    let userName = userdata.name;
    let userAccount = userdata.account;
    let currentUrl = window.location.href;
    let token = localStorage.getItem('token'); //Parse out {orderNumber}
    let url = new URL(currentUrl); //Convert to URL object
    let orderNumber = url.searchParams.get('number'); //Using the searchParams attribute
    url = `http://taipeitrips.com/api/order/${orderNumber}`;
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
            window.location.replace("http://taipeitrips.com"); 
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




function backToHomePage(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.href = "http://taipeitrips.com";
    })
}




function changeToBookingPage(){
    checkBookingButton.addEventListener("click", ()=>{
        let loginResult = getUserData();
        if(loginResult == false){
            alert("尚未登入");
            window.location.replace("http://taipeitrips.com");
        }else{
            window.location.href = "http://taipeitrips.com/booking";
        }
        
    })
}





async function getUserData() {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            signoutButton.style.display = "flex";
            return false;
        }

        const response = await fetch('http://taipeitrips.com/api/user/auth', {
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
            let id = responseData.data.id; 
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


function logout(){
    signoutButton.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.replace("http://taipeitrips.com");
    })
}



async function excute(){
    await getOrderResult();
    backToHomePage(); 
    logout();
    changeToBookingPage();
}
excute();
