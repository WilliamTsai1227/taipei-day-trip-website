
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








//返回首頁按紐
function back_to_home_page(){
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
                attractionName.textContent = fetchAttractionName;
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





//登入註冊,查看預定行程相關功能

let htmlBody = document.querySelector("body")
let loginArea = document.querySelector(".login");
let loginBlock = document.querySelector(".login_block");
let loginBlockClose = document.querySelector(".login_block_close_btn");
let signin_signup_button = document.querySelector(".navigation_button_signin_signup");
let signout_button = document.querySelector(".navigation_button_signout");
let loginBlockTitle = document.querySelector(".login_block .title");
let loginBlockName = document.querySelector(".login_block .name");
let loginBlockNameInput = document.querySelector(".login_block .name input");
let loginBlockAccount = document.querySelector(".login_block .account");
let loginBlockAccountInput = document.querySelector(".login_block .account input");
let loginBlockPassword = document.querySelector(".login_block .password");
let loginBlockPasswordInput = document.querySelector(".login_block .password input");
let loginBlockButton = document.querySelector(".login_block .submit_btn");
let loginBlockErrorMessage = document.querySelector(".login_block .error_message");
let loginBlockChangeToSignup = document.querySelector(".login_block .change_to_signup_btn");
let loginBlockChangeToLogin = document.querySelector(".login_block .change_to_login_btn");
let checkBookingButton = document.querySelector(".navigation_button_book");
let bookingButton = document.querySelector(".section_profile_book_form_button")
let loginBlockStatus = "login";


//打開登入框
function show_login_block(){
    signin_signup_button.addEventListener("click", ()=>{
        loginArea.style.display = "flex";
    })
}

//關閉登入框
function close_login_block(){
    loginBlockClose.addEventListener("click", ()=>{
        loginArea.style.display = "none";
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


function change_to_signup_block(){    
    loginBlockChangeToSignup.addEventListener("click", ()=>{
        clear_input();
        loginBlockErrorMessage.textContent="";
        loginBlockTitle.textContent = "註冊會員帳號";
        loginBlockName.style.display = "flex";
        loginBlockAccountInput.placeholder = "輸入電子郵件";
        loginBlockButton.textContent = "註冊新帳戶";
        loginBlockChangeToSignup.style.display = "none";
        loginBlockChangeToLogin.style.display = "flex";
        loginBlockStatus =  "signup";
    });
}

function change_to_login_block(){
    loginBlockChangeToLogin.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
        loginBlockTitle.textContent = "登入會員帳號";
        loginBlockName.style.display = "none";
        loginBlockAccountInput.placeholder = "輸入電子信箱";
        loginBlockButton.textContent = "登入帳戶";
        loginBlockChangeToSignup.style.display = "flex";
        loginBlockChangeToLogin.style.display = "none";
        loginBlockStatus = "login";
    })
}

// 姓名格式驗證，必須是中文或英文，至少兩個字元
function checkNameFormat(name) {
    const namePattern = /^[\u4e00-\u9fa5A-Za-z\s]{2,}$/;
    return namePattern.test(name);
}

// 帳號(email)格式驗證
function checkAccountFormat(account) {
    const accountPattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    return accountPattern.test(account);
}

// 密碼格式驗證，只能是數字或字母，至少八個字元
function checkPasswordFormat(password) {
    const passwordPattern = /^[A-Za-z0-9]{8,}$/;
    return passwordPattern.test(password);
}

//清除使用者輸入Input內容
function clear_input(){
    loginBlockNameInput.value = "";
    loginBlockAccountInput.value = "";
    loginBlockPasswordInput.value = "";
}

//清除error message字樣
function erase_error_message(){
    signin_signup_button.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
    })
    loginBlockNameInput.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
    })
    loginBlockAccountInput.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
    })
    loginBlockPasswordInput.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
    })
    loginBlockClose.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
    })
}

//登入

function signin(){
    let emailData = "";
    let passwordData = "";
    loginBlockButton.addEventListener("click", ()=>{
        emailData = loginBlockAccountInput.value;
        passwordData = loginBlockPasswordInput.value;
        if(loginBlockButton.textContent == "登入帳戶"){
            if(emailData===""){
                loginBlockErrorMessage.textContent = "帳號不得空白";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(passwordData === ""){
                loginBlockErrorMessage.textContent = "密碼不得空白";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(checkAccountFormat(emailData)=== false){
                loginBlockErrorMessage.textContent = "帳號格式錯誤";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(checkPasswordFormat(passwordData)=== false){
                loginBlockErrorMessage.textContent = "密碼格式錯誤,數字或字母,至少八個字";
                loginBlockErrorMessage.style.color = "red";
                return
            }
        
            const data = {
                email: emailData,
                password: passwordData
            };
            
            fetch('http://34.223.129.79:8000/api/user/auth', {
                method: 'PUT',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                const statusCode = response.status;
                return response.json().then(data => ({
                    statusCode: statusCode,
                    data: data
                }));
            })
            .then(responseData => {
                const statusCode = responseData.statusCode;
                const data = responseData.data;
                
                if(statusCode === 400){
                    loginBlockErrorMessage.textContent = data.message;
                    loginBlockErrorMessage.style.color = "red";
                }
                if(statusCode === 500){
                    console.error(statusCode , data.message);
                }
                if(statusCode === 200){
                    const token = data.token;
                    localStorage.setItem('token', token);
                    loginArea.style.display = "none";
                    clear_input();
                    if (getUserData() === false){
                        console.error("Can't get user token.")
                    }
                }
                getBookingData();

            })
            .catch(error => {
                // console.error('Error fetching token:', error);
            });
        }
    })
}

//註冊

function signup(){
    let nameData = "";
    let emailData = "";
    let passwordData = "";
    loginBlockButton.addEventListener("click", ()=>{
        nameData = loginBlockNameInput.value;
        emailData = loginBlockAccountInput.value;
        passwordData = loginBlockPasswordInput.value;
        if(loginBlockButton.textContent == "註冊新帳戶"){
            if(emailData===""){
                loginBlockErrorMessage.textContent = "帳號不得空白";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(nameData===""){
                loginBlockErrorMessage.textContent = "姓名不得空白";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(passwordData === ""){
                loginBlockErrorMessage.textContent = "密碼不得空白";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(checkNameFormat(nameData)=== false){
                loginBlockErrorMessage.textContent = "姓名格式錯誤,中文或英文，至少兩個字";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(checkAccountFormat(emailData)=== false){
                loginBlockErrorMessage.textContent = "帳號格式錯誤";
                loginBlockErrorMessage.style.color = "red";
                return
            }
            if(checkPasswordFormat(passwordData)=== false){
                loginBlockErrorMessage.textContent = "密碼格式錯誤,數字或字母,至少八個字";
                loginBlockErrorMessage.style.color = "red";
                return
            }
        
            const data = {
                name: nameData,
                email: emailData,
                password: passwordData
            };
            
            fetch('http://34.223.129.79:8000/api/user', {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                const statusCode = response.status;
                return response.json().then(data => ({
                    statusCode: statusCode,
                    data: data
                }));
            })
            .then(responseData => {
                const statusCode = responseData.statusCode;
                if(statusCode === 400){
                    loginBlockErrorMessage.textContent = responseData.data.message;
                    loginBlockErrorMessage.style.color = "red";
                }
                if(statusCode === 500){
                    console.error(statusCode , responseData.data.message);
                }
                if(statusCode === 200 && responseData.data.ok === true){
                    loginBlockErrorMessage.textContent = "註冊成功";
                    loginBlockErrorMessage.style.color = "green";
                }
            })
            .catch(error => {
                // console.error('Error signup procedure:', error);
            });
        }
    })    
}

//取得現在登入使用者資料

async function getUserData() {
    try {
        let token = localStorage.getItem('token');
        if (!token) {
            signin_signup_button.style.display = "flex";
            signout_button.style.display = "none";
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
            signin_signup_button.style.display = "flex";
            signout_button.style.display = "none";
            return false;
        }

        if (responseData.data) {
            let id = responseData.data.id; //取得會員資訊
            let name = responseData.data.name;
            let account = responseData.data.email;
            signin_signup_button.style.display = "none";
            signout_button.style.display = "flex";
            return { "id": id, "name": name, "account": account };
        }
    } catch (error) {
        console.error('getUserData() error occurred:', error.message);
        return false;
    }
}
//登出

function logout(){
    signout_button.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.replace("http://34.223.129.79:8000");
    })
}



async function excute(){
    await getBookingData();
    back_to_home_page(); 
    show_login_block();
    close_login_block();
    change_to_signup_block();
    change_to_login_block();
    signin();
    signup();
    erase_error_message();
    logout();
    changeToBookingPage();
    deleteBookingData(); 
}
excute();
