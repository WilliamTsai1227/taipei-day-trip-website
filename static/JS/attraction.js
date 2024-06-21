function scroll_img() {
    let imgContent = document.querySelector('.image_content');
    let leftArrow = document.querySelector('.section_picture_left_btn img');
    let rightArrow = document.querySelector('.section_picture_right_btn img');
    let imgWapper = document.querySelector('.image_wrapper');
    let circle = document.querySelector('.circle');
    let currentIndex = 0;
    let scrollAmount = 0; //已經滑動像素
    let scrollStep = imgWapper.offsetWidth; // 每次移動像素
    
    imgContent.style.transform = 'translateX(0px)';

    function updateCircles(index) {
        for (let j = 0; j < circle.children.length; j++) {
            circle.children[j].className = "not_current";
        }
        circle.children[index].className = "current";
    }

    leftArrow.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
        updateCircles(currentIndex);
    });

    rightArrow.addEventListener('click', () => {
        const maxIndex = imgContent.children.length - 1;
        const maxScroll = imgContent.scrollWidth - imgContent.clientWidth;
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
        updateCircles(currentIndex);
    });

    updateCircles(currentIndex);
    
}


function createCircle() {
    let circle = document.querySelector(".circle");
    let imgContent = document.querySelector(".image_content");
    let imgWapper = document.querySelector('.image_wrapper');
    let scrollStep = imgWapper.offsetWidth;

    // 清空原有的圓點
    while (circle.firstChild) {
        circle.removeChild(circle.firstChild);
    }

    for (let i = 0; i < imgContent.children.length; i++) {
        let cirItem = document.createElement("div");
        cirItem.className = "not_current";
        circle.appendChild(cirItem);
        cirItem.setAttribute("index", i);
    }

    if (circle.children.length > 0) {
        circle.children[0].className = "current";
    }
}




async function loading_attraction_data(){
    let id = location.pathname.split("/").pop();
    let name = document.querySelector(".section_profile_name");
    let cat_mrt = document.querySelector(".section_profile_cat_mrt");
    let description = document.querySelector(".infors_description");
    let address = document.querySelector(".infors_location_content");
    let transport = document.querySelector(".infors_transportation_content");
    let imgContent = document.querySelector(".image_content");
    
    function checkId(id) {
        // 檢查 id 是否是數字
        if (isNaN(id)) {
            window.location.replace("http://34.223.129.79:8000")
        }

        // 檢查 id 是否在 0 到 58 的範圍內
        id = Number(id); // 將 id 轉換為數字
        if (id < 0 || id > 58) {
            window.location.replace("http://34.223.129.79:8000")  
        }

    }
    
    checkId(id);
    let response = await fetch(`http://34.223.129.79:8000/api/attraction/${id}`);
    let result = await response.json();
    // fetch(`http://34.223.129.79:8000/api/attraction/${id}`)
    // .then((response) => {
    //     return response.json();
    // })
    // .then((result) => {
    let attraction = result.data;
    let attractionId = attraction.id;
    let attractionName = attraction.name;
    let attractionAddress = attraction.address;
    let attractionCategory = attraction.category;
    let attractionMrt = attraction.mrt;
    let attractionDescription = attraction.description;
    let attractionTrasport = attraction.transport;
    let attractionImgList = attraction.images;


    name.textContent = attractionName;
    cat_mrt.textContent = attractionCategory+" at "+attractionMrt;
    description.textContent = attractionDescription;
    address.textContent = attractionAddress;
    transport.textContent = attractionTrasport;
    while(imgContent.firstChild){
        imgContent.removeChild(imgContent.firstChild);
    }
    attractionImgList.forEach(item => {
        let img = document.createElement("img");
        img.src = item;
        imgContent.appendChild(img);
        })
    createCircle();
    setTimeout(scroll_img, 1000);
    // })
}


function back_to_home_page(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.replace("http://34.223.129.79:8000")
    })
}


function change_book_price_text(){
    let morningBtn = document.querySelector(".profile_book_form_datetime_morning_btn");
    let afternoonBtn = document.querySelector(".profile_book_form_datetime_afternoon_btn");
    let priceContent = document.querySelector(".section_profile_book_form_price_content");

    morningBtn.addEventListener("change",() => {
        if (morningBtn.checked){
            priceContent.textContent = "新台幣 2000 元";
        }
    });
    afternoonBtn.addEventListener("change",() => {
        if (afternoonBtn.checked){
            priceContent.textContent = "新台幣 2500 元";
        }
    });
}


function handleResize(){
    let lastWidth = window.innerWidth;

    window.addEventListener("resize", () => {
        if (window.innerWidth !== lastWidth) {
            lastWidth = window.innerWidth;
            scroll_img();
        }
    });
}


//登入註冊相關功能

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

function getUserData(){
    let token = localStorage.getItem('token');
    if (!token) {
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
        if(responseData.statusCode === 200){
            let id = responseData.data.data.id; //取得會員資訊
            let name = responseData.data.data.name;
            let account = responseData.data.data.email;
            
            signin_signup_button.style.display = "none";
            signout_button.style.display = "flex";
            return{"id":id,"name":name,"accpunt":account}
        } 
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
    });
}

//登出

function logout(){
    signout_button.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        signin_signup_button.style.display = "flex";
        signout_button.style.display = "none";
    })
}



async function excute(){
    await loading_attraction_data();
    change_book_price_text();
    back_to_home_page(); 
    handleResize();
    getUserData();
    show_login_block();
    close_login_block();
    change_to_signup_block();
    change_to_login_block();
    signin();
    signup();
    erase_error_message();
    logout();  
}
excute();

