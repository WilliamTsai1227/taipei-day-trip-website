import { getUserData } from "./user.js";
let loginArea = document.querySelector(".login");
let loginBlockClose = document.querySelector(".login_block_close_btn");
let loginSignupButton = document.querySelector(".navigation_button_signin_signup");
let loginBlockTitle = document.querySelector(".login_block .title");
let loginBlockName = document.querySelector(".login_block .name");
let loginBlockNameInput = document.querySelector(".login_block .name input");
let loginBlockAccountInput = document.querySelector(".login_block .account input");
let loginBlockPasswordInput = document.querySelector(".login_block .password input");
let loginBlockButton = document.querySelector(".login_block .submit_btn");
let loginBlockErrorMessage = document.querySelector(".login_block .error_message");
let loginBlockChangeToSignup = document.querySelector(".login_block .change_to_signup_btn");
let loginBlockChangeToLogin = document.querySelector(".login_block .change_to_login_btn");
let loginBlockStatus = "login";
let checkBookingButton = document.querySelector(".navigation_button_book");

function backToHomePage(){
    let homepageButton = document.querySelector(".navigation_title")
    homepageButton.addEventListener("click",() => {
        window.location.href = "https://taipeitrips.com" ;
    })
}

//Open login box
function showLoginBlock(){
    loginSignupButton.addEventListener("click", ()=>{
        loginArea.style.display = "flex";
        loginBlockAccountInput.value = "test@gmail.com";  // Test account for Demonstration
        loginBlockPasswordInput.value = "12345678";
    })
}

//Close login box
function closeLoginBlock(){
    loginBlockClose.addEventListener("click", ()=>{
        loginArea.style.display = "none";
    })
}

function changeToSignupBlock(){    
    loginBlockChangeToSignup.addEventListener("click", ()=>{
        clearInput();
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

function changeToLoginBlock(){
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



//Clear user input content
function clearInput(){
    loginBlockNameInput.value = "";
    loginBlockAccountInput.value = "";
    loginBlockPasswordInput.value = "";
}

//Clear error message text
function eraseErrorMessage(){
    loginSignupButton.addEventListener("click", ()=>{
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


//View scheduled itinerary button
function changeToBookingPage(){
    checkBookingButton.addEventListener("click", async ()=>{
        let loginResult = await getUserData();
        if(loginResult == false){
            loginArea.style.display = "flex";
        }else{
            loginArea.style.display = "none";
            window.location.href = "https://taipeitrips.com/booking";
        }
        
    })
}

export {backToHomePage, showLoginBlock, closeLoginBlock, changeToSignupBlock, changeToLoginBlock, clearInput,eraseErrorMessage, changeToBookingPage}