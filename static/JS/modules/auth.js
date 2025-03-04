import { getUserData } from "./user";
let loginBlockButton = document.querySelector(".login_block .submit_btn");
let loginBlockAccountInput = document.querySelector(".login_block .account input");
let loginBlockPasswordInput = document.querySelector(".login_block .password input");
let loginBlockErrorMessage = document.querySelector(".login_block .error_message");
let loginBlockNameInput = document.querySelector(".login_block .name input");
let logoutButton = document.querySelector(".navigation_button_signout");

// Name format verification, must be in Chinese or English, at least two characters
function checkNameFormat(name) {
    const namePattern = /^[\u4e00-\u9fa5A-Za-z\s]{2,}$/;
    return namePattern.test(name);
}

// Account (email) format verification
function checkAccountFormat(account) {
    const accountPattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    return accountPattern.test(account);
}

// Password format verification, can only be numbers or letters, at least eight characters
function checkPasswordFormat(password) {
    const passwordPattern = /^[A-Za-z0-9]{8,}$/;
    return passwordPattern.test(password);
}


//Login function

function login(){
    let emailData = "";
    let passwordData = "";
    loginBlockButton.addEventListener("click", async () => {
        emailData = loginBlockAccountInput.value;
        passwordData = loginBlockPasswordInput.value;

        if (loginBlockButton.textContent == "登入帳戶") {
            // 驗證輸入
            if (emailData === "") {
                loginBlockErrorMessage.textContent = "帳號不得空白";
                loginBlockErrorMessage.style.color = "red";
                return;
            }
            if (passwordData === "") {
                loginBlockErrorMessage.textContent = "密碼不得空白";
                loginBlockErrorMessage.style.color = "red";
                return;
            }
            if (checkAccountFormat(emailData) === false) {
                loginBlockErrorMessage.textContent = "帳號格式錯誤";
                loginBlockErrorMessage.style.color = "red";
                return;
            }
            if (checkPasswordFormat(passwordData) === false) {
                loginBlockErrorMessage.textContent = "密碼格式錯誤,數字或字母,至少八個字";
                loginBlockErrorMessage.style.color = "red";
                return;
            }

            const data = {
                email: emailData,
                password: passwordData
            };

            try {
                const response = await fetch('https://taipeitrips.com/api/user/auth', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const statusCode = response.status;
                const responseData = await response.json(); 

                if (statusCode === 400 || statusCode === 500) {
                    loginBlockErrorMessage.textContent = responseData.message;
                    loginBlockErrorMessage.style.color = "red";
                    console.error(statusCode, responseData.message);
                } else if (statusCode === 200) {
                    const token = responseData.token;
                    localStorage.setItem('token', token);
                    clear_input();
                    const userData = await getUserData();
                    if (userData === false) {
                        console.error("user token procedure error.");
                    } else {
                        loginArea.style.display = "none"; 
                    }
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        }
    });
}





//Registration function

function signup(){
    let nameData = "";
    let emailData = "";
    let passwordData = "";
    loginBlockButton.addEventListener("click", async ()=>{
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
            try{
               const response = await fetch('https://taipeitrips.com/api/user' ,{
                    method: 'POST',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
               });

               const statusCode = response.status;
               const responseData = await response.json();
               
               if(statusCode === 400){
                  loginBlockErrorMessage.textContent = responseData.message;
                  loginBlockErrorMessage.style.color = "red";
               }
               if(statusCode === 500){
                  console.log(statusCode , responseData.message)
               }
               if(statusCode === 200 && responseData.ok === true){
                  loginBlockErrorMessage.textContent = "註冊成功";
                  loginBlockErrorMessage.style.color = "green";
               }
            }catch (error){
                console.error('Error signup procedure:', error); 
            }
            
        }
    })    
}


//Logout function

function logout(){
    logoutButton.addEventListener("click", ()=>{
        localStorage.removeItem('token');
        window.location.replace("https://taipeitrips.com");
    })
}


export { login, signup, logout };