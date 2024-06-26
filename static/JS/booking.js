//返回首頁按紐
function back_to_home_page(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.href = "http://34.223.129.79:8000";
    })
}

function get_booking_data(){
    fetch("http://127.0.0.1:8000/api/booking")
    .then(response => {

    }).then(data => {
        
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
    checkBookingButton.addEventListener("click", async ()=>{
        let loginResult = await getUserData();
        if(loginResult === false){
            loginArea.style.display = "flex";
            return
        }
        loginArea.style.display = "none";
        window.location.href = "http://34.223.129.79:8000/booking";
    })
}

//預定行程
function booking(){
    bookingButton.addEventListener("click",async ()=>{
        let loginResult = await getUserData();
        if(loginResult === false){
            loginArea.style.display = "flex";
            return
        }
        let token = localStorage.getItem('token');
        let data = getBookingData();
        if(data === false){
            alert("請填寫預約資訊")
            return false
        }
        fetch("http://34.223.129.79:8000/api/booking",{
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`)
                return {"status_code":statusCode,"message":responseData.data.message}
            }
            if(statusCode === 403){
                alert("尚未登入，預約失敗")
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`)
                return {"status_code":statusCode,"message":responseData.data.message}
            }
            if(statusCode === 500){
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`)
                return {"status_code":statusCode,"message":responseData.data.message}
            }
            if(statusCode === 200 && responseData.data.ok === true){
                window.location.href = "http://34.223.129.79:8000/booking";
                return true
            }
        })

    })
}

function getBookingData(){
    let dateInput = document.querySelector(".section_profile_book_form_date input[name='book_day']");
    let date = dateInput.value;
    let time = document.querySelector(".section_profile_book_form_datetime input[name='datetime']:checked").value;
    let id = location.pathname.split("/").pop();
    let price = 0;
    if(checkId(id) === false){  //若id有錯誤及終止回傳false
        return false;
    }
    if (!dateInput.checkValidity()) { // 如果日期未選擇，顯示內建的警告信息並返回 false
        dateInput.reportValidity();
        return;
    }
    if(time === "morning"){
        price = 2000;
    }
    if(time === "afternoon"){
        price = 2500;
    }
    if(price === 0){  ////若價錢為空白及終止回傳false
        return false;
    }
    id = Number(id);
    return {"attractionId":id,"date":date,"time":time, "price":price};
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

async function getUserData(){
    let token = localStorage.getItem('token');
    if (!token) {
        signin_signup_button.style.display = "flex";
        signout_button.style.display = "none";
        // window.location.replace("http://34.223.129.79:8000"); 先不要做返回首頁
        return false;
    }
    fetch('http://34.223.129.79:8000/api/user/auth', {
        method: 'GET',  
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json().then(data => ({
            statusCode: response.status,
            data: data
        }));
    })
    .then(responseData => {
        if(responseData.data.data === null){
            signin_signup_button.style.display = "flex";
            signout_button.style.display = "none";
            // window.location.replace("http://34.223.129.79:8000"); 先不要做返回首頁
            return false; 
        }
        if(responseData.data.data){
            let id = responseData.data.data.id; //取得會員資訊
            let name = responseData.data.data.name;
            let account = responseData.data.data.email;
            signin_signup_button.style.display = "none";
            signout_button.style.display = "flex";
            return{"id":id,"name":name,"acccount":account}
        } 
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        return false;
    });
}

//登出

function logout(){
    signout_button.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        getUserData();
    })
}



async function excute(){
    getUserData();
    changeToBookingPage();
    back_to_home_page(); 
    show_login_block();
    close_login_block();
    change_to_signup_block();
    change_to_login_block();
    signin();
    signup();
    erase_error_message();
    logout(); 
    booking(); 
}
excute();
