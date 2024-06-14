function scroll_img() {
    const imgContent = document.querySelector('.image_content');
    const leftArrow = document.querySelector('.section_picture_left_btn img');
    const rightArrow = document.querySelector('.section_picture_right_btn img');
    const imgWapper = document.querySelector('.image_wrapper');
    imgContent.style.transform = 'translateX(0px)';
    let scrollAmount = 0;

    let scrollStep = imgWapper.offsetWidth; // 每次移動像素

    leftArrow.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
    });

    rightArrow.addEventListener('click', () => {
        const maxScroll = imgContent.scrollWidth - imgContent.clientWidth;
        scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
    });
}


async function loading_attraction_data(){
    let id = location.pathname.split("/").pop();
    let name = document.querySelector(".section_profile_name");
    let cat_mrt = document.querySelector(".section_profile_cat_mrt");
    let description = document.querySelector(".infors_description");
    let address = document.querySelector(".infors_location_content");
    let transport = document.querySelector(".infors_transportation_content");
    let imgContent = document.querySelector(".image_content");
    id = 4;
    fetch(`http://34.223.129.79:8000/api/attraction/${id}`)
    .then((response) => {
        return response.json();
    })
    .then((result) => {
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

    })
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
    window.addEventListener("resize", () => {
        scroll_img();
    })
}
async function excute(){
    await loading_attraction_data();
    scroll_img();
    change_book_price_text();
    back_to_home_page(); 
    handleResize();  
}
excute();

