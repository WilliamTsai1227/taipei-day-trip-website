async function append_mrt_station(){
    listBarContent = document.querySelector(".list_bar_content");
    fetch("http://34.223.129.79:8000/api/mrts")
    .then((response) =>{
        return response.json();
    })
    .then((response) => {
        for (let i of response.data){
            listItem = document.createElement("div");
            listItem.className = "list_item";
            listItem.textContent = i;
            listBarContent.appendChild(listItem);
        }
        monitor_mrt_click();
    })
    .catch((error) => {
        console.log(error)
    })
}

let page = 0;
let keyword = "";
let isLoading = false; // 建立標籤，表示是否正在加載數據
async function fetch_attractions(){
    if (isLoading) return; // 如果正在加載數據，則不觸發加載操作
    isLoading = true; // 開始加載數據，將 isLoading 設為 true
    let attractions = document.querySelector(".attractions")
    fetch(`http://34.223.129.79:8000/api/attractions?page=${page}&keyword=${keyword}`)
    .then((response) =>{
        return response.json();
    })
    .then((response) =>{
        page = response.nextPage;
        for (let i of response.data){
            let attraction = document.createElement("div");
            attraction.className = "attraction";
            let attraction_content = document.createElement("div");
            attraction_content.className = "attraction_content";
            let attraction_id = document.createElement("div");
            attraction_id.className = "attraction_id";
            let attraction_img = document.createElement("img");
            attraction_img.className = "attraction_img";
            let attraction_name = document.createElement("div");
            attraction_name.className = "attraction_name";
            let attraction_mrt_cat = document.createElement("div");
            attraction_mrt_cat.className = "attraction_mrt_cat";
            let attraction_mrt = document.createElement("div");
            attraction_mrt.className = "attraction_mrt";
            let attraction_cat = document.createElement("div");
            attraction_cat.className = "attraction_cat";
            let id = i.id;
            let name = i.name;
            let mrt = i.mrt;
            let category = i.category;
            let img = i.images[0];
            attraction_id.textContent = id;
            attraction_img.src = img;
            attraction_name.textContent = name;
            attraction_mrt.textContent = mrt;
            attraction_cat.textContent = category;
            attraction_mrt_cat.appendChild(attraction_mrt);
            attraction_mrt_cat.appendChild(attraction_cat);
            attraction_content.appendChild(attraction_id);
            attraction_content.appendChild(attraction_img);
            attraction_content.appendChild(attraction_name);
            attraction_content.appendChild(attraction_mrt_cat);
            attraction.appendChild(attraction_content);
            attractions.appendChild(attraction);
        }
        isLoading = false; // 數據加載完成，將 isLoading 設為 false
        monitor_attraction_clicks(); 
    })
    .catch((error) =>{
        console.log(error);
        isLoading = false; // 數據加載出錯，將 isLoading 設為 false
    })
}

// function scrolling_add_attractions(){
//     window.addEventListener("scroll",function(e){
//         // let{clientHeight,scrollHeight,scrollTop} = e.target.documentElement; //解構賦值
//         let clientHeight = e.target.documentElement.clientHeight;
//         let scrollHeight = e.target.documentElement.scrollHeight;
//         let scrollTop = e.target.documentElement.scrollTop;
//         // console.log(scrollTop,scrollHeight,clientHeight)
//         if(scrollTop+clientHeight >= scrollHeight ){
//             if (page != null){
//                 fetch_attractions();
//             }
//         }
//     })
// }

function scrolling_add_attractions(){
    let footer = document.querySelector(".footer");
    window.addEventListener("scroll", function () {
      const { bottom } = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (bottom <= windowHeight) {
        if (page != null){
            fetch_attractions();
        }
      }
    });
}
function search(){
    let button = document.querySelector(".hero_section_search_icon");
    let input = document.querySelector(".hero_section_search input");
    let attractions = document.querySelector(".attractions");
    button.addEventListener("click",() => {
        page = 0;
        keyword = input.value;
        while(attractions.firstChild){
            attractions.removeChild(attractions.firstChild);
        }
        fetch_attractions();
    })
}

function scroll_list(){
    let listBarContent = document.querySelector('.list_bar_content');
    let leftArrow = document.querySelector('.list_bar_left_arrow img');
    let rightArrow = document.querySelector('.list_bar_right_arrow img');
    let scrollAmount = 0;

    let scrollStep = 200; // 每次移動像素

    leftArrow.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        listBarContent.style.transform = `translateX(-${scrollAmount}px)`;
    });
    rightArrow.addEventListener('click', () => {
        let maxScroll = listBarContent.scrollWidth - listBarContent.clientWidth;
        scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
        listBarContent.style.transform = `translateX(-${scrollAmount}px)`;
    });
}

function monitor_mrt_click(){
    let list_items = document.querySelectorAll(".list_item");
    let input = document.querySelector(".hero_section_search input");
    let attractions = document.querySelector(".attractions");
    list_items.forEach(item => {
        item.addEventListener("click",() => {
            let searchInput = item.textContent;
            input.value = searchInput;
            console.log(input.value);
            page = 0;
            keyword = input.value;
            while(attractions.firstChild){
                attractions.removeChild(attractions.firstChild);
            }
            fetch_attractions();
        })
    })    
}

function monitor_attraction_clicks(){
    let list_items = document.querySelectorAll(".attraction_content");
    let id = 0;
    list_items.forEach(item => {
        item.addEventListener("click", () =>{
            id = item.querySelector(".attraction_id").textContent;
            window.location.replace(`http://34.223.129.79:8000/attraction/${id}`)
        })
    })
}

function back_to_home_page(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.replace("http://34.223.129.79:8000")
    })
}



//登入註冊相關功能

let loginArea = document.querySelector(".login");
let loginBlock = document.querySelector(".login_block");
let loginBlockClose = document.querySelector(".login_block_close_btn");
let navigation_button = document.querySelector(".navigation_button_right");
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


function show_login_block(){
    navigation_button.addEventListener("click", ()=>{
        loginArea.style.display = "flex";
    })
}

function close_login_block(){
    loginBlockClose.addEventListener("click", ()=>{
        loginArea.style.display = "none";
    })
}

function change_to_signup_block(){    
    loginBlockChangeToSignup.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
        loginBlockTitle.textContent = "註冊會員帳號";
        loginBlockName.style.display = "flex";
        loginBlockAccountInput.placeholder = "輸入電子郵件";
        loginBlockButton.textContent = "註冊新帳戶";
        loginBlockChangeToSignup.style.display = "none";
        loginBlockChangeToLogin.style.display = "flex";
        loginBlock.style.height = "332px";
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
        loginBlock.style.height = "275px";
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

// 密碼格式驗證，只能是數字及字母，至少八個字元
function checkPasswordFormat(password) {
    const passwordPattern = /^[A-Za-z0-9]{8,}$/;
    return passwordPattern.test(password);
}

function erase_error_message(){
    loginBlockNameInput.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
        loginBlock.style.height = "275px"; 
    })
    loginBlockAccountInput.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
        loginBlock.style.height = "275px"; 
    })
    loginBlockPasswordInput.addEventListener("click", ()=>{
        loginBlockErrorMessage.textContent="";
        loginBlock.style.height = "275px"; 
    })
}



function login(){
    let emailData = "";
    let passwordData = "";
    loginBlockButton.addEventListener("click", ()=>{
        emailData = loginBlockAccountInput.value;
        passwordData = loginBlockPasswordInput.value;
        if(emailData===""){
            loginBlockErrorMessage.textContent = "帳號不得空白";
            loginBlock.style.height = "322px";
            return
        }
        if(passwordData === ""){
            loginBlockErrorMessage.textContent = "密碼不得空白";
            loginBlock.style.height = "322px";
            return
        }
        if(checkAccountFormat(emailData)=== false){
            loginBlockErrorMessage.textContent = "帳號格式錯誤";
            loginBlock.style.height = "322px";
            return
        }
        if(checkPasswordFormat(passwordData)=== false){
            loginBlockErrorMessage.textContent = "密碼格式錯誤";
            loginBlock.style.height = "322px";
            return
        }
    
        const data = {
            email: emailData,
            password: passwordData
        };
        
        fetch('http://127.0.0.1:8000/api/user/auth', {
            method: 'PUT',  // 使用 PUT 方法
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            const token = data.token;  // 
            // 將 token 儲存到 LocalStorage
            localStorage.setItem('token', token);
            getLoginUserData();
        })
        .catch(error => {
            console.error('Error fetching token:', error);
        });
    })

}

function signup(){
    let nameData = "";
    let emailData = "";
    let passwordData = "";
    loginBlockButton.addEventListener("click", ()=>{
        emailData = loginBlockAccountInput.value;
        passwordData = loginBlockPasswordInput.value;
        if(emailData===""){
            loginBlockErrorMessage.textContent = "帳號不得空白";
            loginBlock.style.height = "379px";
            return
        }
        if(nameData===""){
            loginBlockErrorMessage.textContent = "姓名不得空白";
            loginBlock.style.height = "379px";
            return
        }
        if(passwordData === ""){
            loginBlockErrorMessage.textContent = "密碼不得空白";
            loginBlock.style.height = "379px";
            return
        }
        if(checkAccountFormat(emailData)=== false){
            loginBlockErrorMessage.textContent = "帳號格式錯誤";
            loginBlock.style.height = "379px";
            return
        }
        if(checkPasswordFormat(passwordData)=== false){
            loginBlockErrorMessage.textContent = "密碼格式錯誤";
            loginBlock.style.height = "379px";
            return
        }
    
        const data = {
            email: emailData,
            password: passwordData
        };
        
        fetch('http://127.0.0.1:8000/api/user/auth', {
            method: 'POST',  // 使用 PUT 方法
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            const token = data.token;  // 
            // 將 token 儲存到 LocalStorage
            localStorage.setItem('token', token);
            getLoginUserData();
        })
        .catch(error => {
            console.error('Error fetching token:', error);
        });
    })

    
}

function getLoginUserData(){
    let token = localStorage.getItem('token');
    if (!token) {
        console.error('Token not found in LocalStorage');
        return;
    }
    fetch('http://127.0.0.1:8000/api/user/auth', {
        method: 'GET',  // 使用 GET 方法获取用户信息
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('User info:', data);
        // 在此处可以将返回的用户信息显示在前端页面上
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
    });
}

function logout(){
    localStorage.removeItem('token');
    getLoginUserData();
}


async function excute(){
    await append_mrt_station();
    await fetch_attractions();
    monitor_mrt_click();
    monitor_attraction_clicks();
    scroll_list();
    search();
    scrolling_add_attractions();
    back_to_home_page();
    show_login_block();
    close_login_block();
    change_to_signup_block();
    change_to_login_block();
    login();
    signup();
    erase_error_message();
}
excute();








