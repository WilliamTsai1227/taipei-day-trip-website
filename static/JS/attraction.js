import { login, signup, logout} from './modules/auth.js';
import { getUserData } from './modules/user.js';
import { backToHomePage, showLoginBlock, closeLoginBlock, changeToSignupBlock, changeToLoginBlock, eraseErrorMessage, changeToBookingPage } from './modules/ui.js';

function scrollImage() {
    let imgContent = document.querySelector('.image_content');
    let leftArrow = document.querySelector('.section_picture_left_btn img');
    let rightArrow = document.querySelector('.section_picture_right_btn img');
    let imgWapper = document.querySelector('.image_wrapper');
    let circle = document.querySelector('.circle');
    let currentIndex = 0;
    let scrollAmount = 0; //Pixels have been slid
    let scrollStep = imgWapper.offsetWidth; // Move pixels each time
    
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

    // Clear the original dots
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

//The function of check ID

function checkId(id) {
    // check if id is a number
    if (isNaN(id)) {
        window.location.replace("https://taipeitrips.com");
        return false;
    }
    // Check if id is in the range 1 to 58
    id = Number(id); // Convert id to number
    if (id < 1 || id > 58) {
        window.location.replace("https://taipeitrips.com")
        return false;  
    }
    return true;
}

async function loadingAttractionData(){
    let id = location.pathname.split("/").pop();
    let name = document.querySelector(".section_profile_name");
    let cat_mrt = document.querySelector(".section_profile_cat_mrt");
    let description = document.querySelector(".infors_description");
    let address = document.querySelector(".infors_location_content");
    let transport = document.querySelector(".infors_transportation_content");
    let imgContent = document.querySelector(".image_content");
    checkId(id);
    let response = await fetch(`https://taipeitrips.com/api/attraction/${id}`);
    let result = await response.json();
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
    setTimeout(scrollImage, 1000);

}




function changeBookPriceText(){
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
            scrollImage();
        }
    });
}


//Login and registration related functions


let loginArea = document.querySelector(".login");
let bookingButton = document.querySelector(".section_profile_book_form_button")





//Booking schedule
function booking(){
    bookingButton.addEventListener("click",async ()=>{
        let loginResult = await getUserData();
        if(loginResult === false){
            loginArea.style.display = "flex";
            return;
        }
        let token = localStorage.getItem('token');
        let data = getBookingData();
        if(data === false){
            console.error("Get booking data error(date/time/price).");
            return {"error":"Get booking data error(date/time/price)."};
        }
        fetch("https://taipeitrips.com/api/booking",{
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
                alert("輸入錯誤，預約失敗")
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`);
                return {"status_code":statusCode,"message":responseData.data.message};
            }
            if(statusCode === 403){
                alert("尚未登入，預約失敗")
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`);
                return {"status_code":statusCode,"message":responseData.data.message};
            }
            if(statusCode === 500){
                alert("預約失敗")
                console.error(`status_code: ${statusCode},message:${responseData.data.message}`);
                return {"status_code":statusCode,"message":responseData.data.message};
            }
            if(statusCode === 200 && responseData.data.ok === true){
                window.location.href = "https://taipeitrips.com/booking";
                return true;
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
    if(checkId(id) === false){  //If there is an error in the id, checkId(id) will automatically return to the home page.
        return;                 // stop this function
    }
    if (!dateInput.checkValidity()) { // If no date is selected, display the built-in warning message and return false.
        dateInput.reportValidity();
        return false;
    }
    if(time === "morning"){
        price = 2000;
    }
    if(time === "afternoon"){
        price = 2500;
    }
    if(price === 0){  //If the price is blank, return false and terminate.
        return false;
    }
    id = Number(id);
    return {"attractionId":id,"date":date,"time":time, "price":price};
}






async function excute(){
    getUserData();
    changeToBookingPage();
    backToHomePage(); 
    showLoginBlock();
    closeLoginBlock();
    changeToSignupBlock();
    changeToLoginBlock();
    login();
    signup();
    eraseErrorMessage();
    logout(); 
    booking(); 
    await loadingAttractionData();
    changeBookPriceText();
    handleResize();
}
excute();

