
let headline = document.querySelector(".main_content .booking_data_block .headline");
let bookingContent = document.querySelector(".main_content .booking_data_block .content");
let bookingDataBlock = document.querySelector(".main_content .booking_data_block");
let attractionImg = document.querySelector(".main_content .booking_data_block .content .img img");
let attractionName = document.querySelector(".main_content .booking_data_block .content .text_content .attraction_name");
let attractionDate = document.querySelector(".main_content .booking_data_block .content .text_content .date_content");
let attractionTime = document.querySelector(".main_content .booking_data_block .content .text_content .time_content");
let attractionPrice = document.querySelector(".main_content .booking_data_block .content .text_content .price_content");
let attractionLocaion = document.querySelector(".main_content .booking_data_block .content .text_content .location_content");
let contractBlock = document.querySelector(".main_content .contract_block ");
let contractName = document.querySelector(".contract_block .content .name_input");
let contractEmail = document.querySelector(".contract_block .content .email_input");
let paymentBlock = document.querySelector(".main_content .payment_block");
let submitBlock = document.querySelector(".main_content .submit_block");
let submitTotalPrice = document.querySelector(".main_content .submit_block .content .total_price");
let footer = document.querySelector(".footer");
let deleteBtn = document.querySelector(".delete_block .btn")
let htmlBody = document.querySelector("body")
let signoutButton = document.querySelector(".navigation_button_signout");
let checkBookingButton = document.querySelector(".navigation_button_book");




//返回首頁按紐
function backToHomePage(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.href = "http://34.223.129.79:8000";
    })
}

//拿到使用者booking data

async function getBookingData(){
    let userData = await getUserData();
    console.log(userData);
    if (userData === false){
        window.location.replace("http://34.223.129.79:8000"); //返回首頁
    }
    if (userData){
        let userName = userData.name;
        let userAccount = userData.account;
        let token = localStorage.getItem('token');
        fetch("http://34.223.129.79:8000/api/booking",{
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
            console.log(responseData.data.data)
            if(statusCode === 200 && responseData.data.data === null){
                bookingContent.style.display = "none";
                contractBlock.style.display = "none";
                paymentBlock.style.display = "none";
                submitBlock.style.display = "none";
                headline.textContent = `您好，${userName}，待預定的行程如下：`;
                let noBookingContent= document.createElement("div");
                noBookingContent.textContent = "目前沒有任何待預定的行程";
                noBookingContent.className = "no_booking_content";
                bookingDataBlock.appendChild(noBookingContent);
                footer.style = "height: calc(100vh - 254px);"
                return {"status_code":200,"data":null}
            }
            if(statusCode === 200 && responseData.data.data !== null){
                let fetchAttractionName = responseData.data.data.attraction.name;
                let fetchAttractionId = responseData.data.data.attraction.id;
                let fetchAttractionAddress = responseData.data.data.attraction.address;
                let fetchAttractionImage = responseData.data.data.attraction.image;
                let fetchAttractionDate = responseData.data.data.date;
                let fetchAttractionTime = responseData.data.data.time;
                let fetchAttractionPrice = String(responseData.data.data.price);
                //景點資訊
                attractionName.textContent = `台北一日遊 ： ${fetchAttractionName}`;
                attractionDate.textContent = fetchAttractionDate;
                if(fetchAttractionTime === "morning"){
                    fetchAttractionTime = "早上９點到下午4點"
                };
                if(fetchAttractionTime === "afternoon"){
                    fetchAttractionTime = "下午2點到晚上9點"
                };
                attractionTime.textContent = fetchAttractionTime;
                headline.textContent = `您好，${userName}，待預定的行程如下：`;
                attractionPrice.textContent = `新台幣${fetchAttractionPrice}元`;
                attractionLocaion.textContent = fetchAttractionAddress;
                attractionImg.src = fetchAttractionImage;
                //聯絡資訊
                contractName.value = userName;
                contractEmail.value = userAccount;
                //訂購資訊
                submitTotalPrice.textContent = `總價 : 新台幣${fetchAttractionPrice}元`
                bookingContent.style.display = "flex";
                contractBlock.style.display = "flex";
                paymentBlock.style.display = "flex";
                submitBlock.style.display = "flex";
                return {"status_code":200,"data":responseData.data.data}
            }
            if(statusCode === 500){
                alert("伺服器錯誤")
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`)
                window.location.replace("http://34.223.129.79:8000"); //返回首頁
                return {"status_code":statusCode,"message":responseData.data.message}
            }
        })
    }
    
}

function deleteBookingData(){
    deleteBtn.addEventListener("click",()=>{
        let loginResult = getUserData()
        if(loginResult == false){
            window.location.replace("http://34.223.129.79:8000"); //返回首頁
        }
        if(loginResult !== false){
            let token = localStorage.getItem('token');
            fetch("http://34.223.129.79:8000/api/booking",{
                method: 'DELETE',  
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => {
                const statusCode = response.status;
                if(statusCode === 403){
                    window.location.replace("http://34.223.129.79:8000"); //返回首頁
                }
                if(statusCode === 500){
                    alert("伺服器錯誤")
                }
                if(statusCode === 200){
                    window.location.reload();
                }
            })
        }
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
            window.location.href = "http://34.223.129.79:8000/booking";
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

//金流相關功能

TPDirect.setupSDK(151711, 'app_4L6D7260cV24Upa7DWKA1jOaIIZ69D4ZF7qCr8SOC1OVDTTf6Rix7qz4liTe', 'sandbox');
TPDirect.card.setup({
    fields: {
        number: {
            element: '.form-control.card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('tappay-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: $('.form-control.ccv')[0],
            placeholder: '後三碼'
        }
    },
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            // 'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})
// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
    /* Disable / enable submit button depend on update.canGetPrime  */
    /* ============================================================ */

    // update.canGetPrime === true
    //     --> you can call TPDirect.card.getPrime()
    // const submitButton = document.querySelector('button[type="submit"]')
    if (update.canGetPrime) {
        // submitButton.removeAttribute('disabled')
        $('button[type="submit"]').removeAttr('disabled')
    } else {
        // submitButton.setAttribute('disabled', true)
        $('button[type="submit"]').attr('disabled', true)
    }


    /* Change card type display when card type change */
    /* ============================================== */

    // cardTypes = ['visa', 'mastercard', ...]
    var newType = update.cardType === 'unknown' ? '' : update.cardType
    $('#cardtype').text(newType)



    /* Change form-group style when tappay field status change */
    /* ======================================================= */

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
    } else {
        setNumberFormGroupToNormal('.card-number-group')
    }

    if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date-group')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date-group')
    } else {
        setNumberFormGroupToNormal('.expiration-date-group')
    }

    if (update.status.ccv === 2) {
        setNumberFormGroupToError('.ccv-group')
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.ccv-group')
    } else {
        setNumberFormGroupToNormal('.ccv-group')
    }
})

async function excute(){
    await getBookingData();
    backToHomePage(); 
    logout();
    changeToBookingPage();
    deleteBookingData(); 
}
excute();
