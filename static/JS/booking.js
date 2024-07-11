
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
let contractPhone = document.querySelector('.contract_block .content .phone_input');
let paymentBlock = document.querySelector(".main_content .payment_block");
let submitBlock = document.querySelector(".main_content .submit_block");
let submitTotalPrice = document.querySelector(".main_content .submit_block .content .total_price");
let footer = document.querySelector(".footer");
let deleteBtn = document.querySelector(".delete_block .btn");
let htmlBody = document.querySelector("body");
let signoutButton = document.querySelector(".navigation_button_signout");
let checkBookingButton = document.querySelector(".navigation_button_book");
let submitButton = document.querySelector('.submit_block .content .submit_btn');
// 宣告Attraction相關data
let fetchAttractionName;
let fetchAttractionId;
let fetchAttractionAddress;
let fetchAttractionImage;
let fetchAttractionDate;
let fetchAttractionTime; //原始景點時間data ,morning or afternoon.
let fetchAttractionTimeToText; //文字顯示部分
let fetchAttractionPrice;
//宣告會員相關data
let userName;
let userAccount;





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
        userName = userData.name;
        userAccount = userData.account;
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
                fetchAttractionName = responseData.data.data.attraction.name;
                fetchAttractionId = responseData.data.data.attraction.id;
                fetchAttractionAddress = responseData.data.data.attraction.address;
                fetchAttractionImage = responseData.data.data.attraction.image;
                fetchAttractionDate = responseData.data.data.date;
                fetchAttractionTime = responseData.data.data.time;
                fetchAttractionPrice = responseData.data.data.price;
                //景點資訊
                attractionName.textContent = `台北一日遊 ： ${fetchAttractionName}`;
                attractionDate.textContent = fetchAttractionDate;
                if(fetchAttractionTime === "morning"){
                    fetchAttractionTimeToText = "早上９點到下午4點"
                };
                if(fetchAttractionTime === "afternoon"){
                    fetchAttractionTimeToText = "下午2點到晚上9點"
                };
                attractionTime.textContent = fetchAttractionTimeToText;
                headline.textContent = `您好，${userName}，待預定的行程如下：`;
                attractionPrice.textContent = `新台幣${String(fetchAttractionPrice)}元`;
                attractionLocaion.textContent = fetchAttractionAddress;
                attractionImg.src = fetchAttractionImage;
                //聯絡資訊
                contractName.value = userName;
                contractEmail.value = userAccount;
                //訂購資訊
                submitTotalPrice.textContent = `總價 : 新台幣${String(fetchAttractionPrice)}元`
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

async function tapPay() {
    TPDirect.setupSDK(151711, 'app_4L6D7260cV24Upa7DWKA1jOaIIZ69D4ZF7qCr8SOC1OVDTTf6Rix7qz4liTe', 'sandbox');
    // Display ccv field
    let fields = {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: '#card-expiration-date',
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    }
    // # TPDirect.card.setup(config)
    TPDirect.card.setup({
        fields: fields,
        styles: {
            // Style all elements
            'input': {
                'color': 'gray'
            },
            // Styling ccv field
            'input.ccv': {
                // 'font-size': '16px'
            },
            // Styling expiration-date field
            'input.expiration-date': {
                // 'font-size': '16px'
            },
            // Styling card-number field
            'input.card-number': {
                // 'font-size': '16px'
            },
            // style focus state
            ':focus': {
                'color': 'black'
            },
            // style valid state
            '.valid': {
                'color': 'green'
            },
            // style invalid state
            '.invalid': {
                'color': 'red'
            },
            // Media queries
            // Note that these apply to the iframe, not the root window.
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

    // # TPDirect.card.onUpdate(callback)
    // let inputFormatStatus = false;
    // TPDirect.card.onUpdate(function (update) {
    //     if (update.canGetPrime) {
    //         inputFormatStatus = true;
    //     } else {
    //         inputFormatStatus = false;
    //     }
    //     // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    //     if (update.cardType === 'visa') {
    //         // Handle card type visa.
    //     }
    //     if (update.status.number === 1 || update.status.number === 2) {
    //         inputFormatStatus = false;
    //     }
    //     if (update.status.number === 0) {
    //         inputFormatStatus = true;
    //     }
    //     if (update.status.expiry === 1 || update.status.expiry === 2) {
    //         inputFormatStatus = false;
    //     }
    //     if (update.status.expiry === 0) {
    //         inputFormatStatus = true;
    //     }
    //     if (update.status.ccv === 1 || update.status.ccv === 2) {
    //         inputFormatStatus = false;
    //     }
    //     if (update.status.ccv === 0) {
    //         inputFormatStatus = true;
    //     }
    // })

    // 確認訂購並付款按鈕

    submitButton.addEventListener('click',async function (event) {
        event.preventDefault();
        let token = localStorage.getItem('token');
        if (!token) {
            window.location.replace("http://34.223.129.79:8000"); //返回首頁
            return ;
        }

        const response = await fetch('http://34.223.129.79:8000/api/user/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let responseData = await response.json();
        
        if (responseData.data === null) {
            window.location.replace("http://34.223.129.79:8000"); //返回首頁
            return ;
        }

        // if (responseData.data) {
        //     let id = responseData.data.id; //取得會員資訊
        //     let name = responseData.data.name;
        //     let account = responseData.data.email;
        //     signoutButton.style.display = "flex";
        //     return { "id": id, "name": name, "account": account };
        // }
        // let userdata = getUserData();
        // if (userdata === false){
        //     window.location.replace("http://34.223.129.79:8000"); //返回首頁
        //     return;
        // }
        if(contractName.value === "" || contractEmail.value ==="" || contractPhone.value ===""){ //檢查會員填寫資訊
            alert("請完整填寫聯絡資訊");
            return;
        };
        const tappayStatus = TPDirect.card.getTappayFieldsStatus();
        console.log(tappayStatus);

        if (tappayStatus.canGetPrime === false) {
            alert("信用卡資料錯誤")
            // alert('Cannot get prime.');
            console.error(`inputFormatStatus: ${inputFormatStatus}`)
            return;
        };


        TPDirect.card.getPrime(function (result) {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg)
                return;
            };
            alert('get prime 成功，prime: ' + result.card.prime);
        


            // 发送付款请求到后端
            fetch('http://34.223.129.79:8000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    prime: result.card.prime,
                    order: {
                        price: fetchAttractionPrice,
                        trip: {
                            attraction: {
                                id: fetchAttractionId,
                                name: fetchAttractionName,
                                address: fetchAttractionAddress,
                                image: fetchAttractionImage
                            },
                            date: fetchAttractionDate,
                            time: fetchAttractionTime
                        },
                        contact: {
                            name: userName,
                            email: userAccount,
                            phone: document.querySelector('.phone_input').value
                        }
                    }
                })
            })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.status_code === 200 && responseData.data.payment.status === 0) {
                    window.location.href = "/thankyou?number=" + responseData.data.number;
                    return;
                } 
                if (responseData.status_code === 200 && responseData.data.payment.status === 1) {
                    alert("付款失敗");
                    return;
                } 
                if(responseData.status_code === 400){
                    alert(responseData.message);
                    return;
                }
                if(responseData.status_code === 500){
                    alert("伺服器錯誤");
                    return;
                }
                if(responseData.status_code === 403){
                    alert(responseData.message);
                    window.location.replace("http://34.223.129.79:8000"); //返回首頁
                    return;
                }

                
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while processing the payment.');
            });
        });
    });
}




async function excute(){
    await getBookingData();
    backToHomePage(); 
    logout();
    changeToBookingPage();
    deleteBookingData(); 
    tapPay();
}
excute();




