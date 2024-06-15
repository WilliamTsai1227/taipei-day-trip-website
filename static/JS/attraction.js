function scroll_img() {
    let imgContent = document.querySelector('.image_content');
    let leftArrow = document.querySelector('.section_picture_left_btn img');
    let rightArrow = document.querySelector('.section_picture_right_btn img');
    let imgWapper = document.querySelector('.image_wrapper');
    let circle = document.querySelector('.circle');
    let currentIndex = 0;
    let scrollAmount = 0;
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

function updateCircle(){
    let imgContent = document.querySelector('.image_content');
    let imgWapper = document.querySelector('.image_wrapper');
    let scrollStep = Number(imgWapper.offsetWidth);
    let translate = Number(imgContent.style.transform);
    let index = (translate / scrollStep) + 1
    console.log(index);

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
    id = 12;
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
async function excute(){
    await loading_attraction_data();
    change_book_price_text();
    back_to_home_page(); 
    handleResize();  
}
excute();

