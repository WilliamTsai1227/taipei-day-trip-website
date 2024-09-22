
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
// Declare the obtained Attraction related variables
let fetchAttractionName;
let fetchAttractionId;
let fetchAttractionAddress;
let fetchAttractionImage;
let fetchAttractionDate;
let fetchAttractionTime; //Original attraction time data, morning or afternoon.
let fetchAttractionTimeToText; 
let fetchAttractionPrice;
//Declare member-related data variables
let userName;
let userAccount;





//Return to home page button
function backToHomePage(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.href = "http://taipeitrips.com";
    })
}

//Get user booking data

async function getBookingData(){
    let userData = await getUserData();
    if (userData === false){
        window.location.replace("http://taipeitrips.com"); //Back to home page
    }
    if (userData){
        userName = userData.name;
        userAccount = userData.account;
        let token = localStorage.getItem('token');
        fetch("http://taipeitrips.com/api/booking",{
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
                //Attraction information
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
                //Contact information
                contractName.value = userName;
                contractEmail.value = userAccount;
                //Booking information
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
                window.location.replace("http://taipeitrips.com"); 
                return {"status_code":statusCode,"message":responseData.data.message}
            }
        })
    }
    
}

function deleteBookingData(){
    deleteBtn.addEventListener("click",()=>{
        let loginResult = getUserData()
        if(loginResult == false){
            window.location.replace("http://taipeitrips.com"); 
        }
        if(loginResult !== false){
            let token = localStorage.getItem('token');
            fetch("http://taipeitrips.com/api/booking",{
                method: 'DELETE',  
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => {
                const statusCode = response.status;
                if(statusCode === 403){
                    window.location.replace("http://taipeitrips.com"); 
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











//Check out the scheduled itinerary button
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



//Get current login user information

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
            let id = responseData.data.id; //get member info
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
//logout button

function logout(){
    signoutButton.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.replace("http://taipeitrips.com");
    })
}



//Cash flow related functions

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
        // This setting will display the first six and last four digits of the credit card number after the card number is entered correctly.
        isMaskCreditCardNumber: true,
        maskCreditCardNumberRange: {
            beginIndex: 6,
            endIndex: 11
        }
    })

    

    // Confirm order and pay button

    submitButton.addEventListener('click',async function (event) {
        event.preventDefault();
        let token = localStorage.getItem('token');
        if (!token) {
            window.location.replace("http://taipeitrips.com"); //Return to home page
            return ;
        }

        const response = await fetch('http://taipeitrips.com/api/user/auth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let responseData = await response.json();
        
        if (responseData.data === null) {
            window.location.replace("http://taipeitrips.com"); //Return to home page
            return ;
        }

        if(contractName.value === "" || contractEmail.value ==="" || contractPhone.value ===""){ //Check member's information
            alert("請完整填寫聯絡資訊");
            return;
        };
        const tappayStatus = TPDirect.card.getTappayFieldsStatus();

        if (tappayStatus.canGetPrime === false) {
            alert("信用卡資料錯誤")
            console.error(`Frontend get Tappay prime status: ${tappayStatus.canGetPrime}`)
            return;
        };


        TPDirect.card.getPrime(function (result) {
            if (result.status !== 0) {
                console.error('get prime error ' + result.msg);
                return;
            };


            // Send payment request to backend
            fetch('http://taipeitrips.com/api/order', {
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
            .then(response =>{
                let statusCode = response.status;
                return response.json().then(data => ({
                    statusCode: statusCode,
                    body: data
                }));
            })
            .then(responseData => {
                statusCode = responseData.statusCode;
                if (statusCode === 200 && responseData.body.data.payment.status === 0) {
                    window.location.href = "/thankyou?number=" + responseData.body.data.number;
                    return;
                } 
                if (statusCode === 200 && responseData.body.data.payment.status === 1) {
                    alert("付款失敗");
                    window.location.href = "/thankyou?number=" + responseData.body.data.number;
                    return;
                } 
                if(statusCode === 400){
                    alert("付款失敗，輸入資訊有誤，請重新再試一次")
                    console.error(responseData.body.message);
                    window.location.href = "/thankyou?number=" + responseData.body.data.number;
                    return;
                }
                if(statusCode === 500){
                    alert("伺服器錯誤");
                    return;
                }
                if(statusCode === 403){
                    window.location.replace("http://taipeitrips.com"); 
                    return;
                }  
            })
            .catch(error => {
                console.error('Payment processing Error:', error);
                // alert('An error occurred while processing the payment.');
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




