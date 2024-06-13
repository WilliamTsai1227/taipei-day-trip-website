// function scroll_img(){
//     let imgContent = document.querySelector('.section_picture');
//     let leftArrow = document.querySelector('.section_picture_left_btn img');
//     let rightArrow = document.querySelector('.section_picture_right_btn img');
//     let scrollAmount = 0;
    

//     let scrollStep = 600; // 每次移動像素

//     leftArrow.addEventListener('click', () => {
//         scrollAmount = Math.max(scrollAmount - scrollStep, 0);
//         imgContent.style.transform = `translateX(-${scrollAmount}px)`;
//     });
//     rightArrow.addEventListener('click', () => {
//         let maxScroll = imgContent.scrollWidth - imgContent.clientWidth;
//         scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
//         imgContent.style.transform = `translateX(-${scrollAmount}px)`;
//     });
//     console.log(imgContent.clientWidth);
//     console.log(imgContent.scrollWidth);
//     console.log(scrollAmount);
// }

// scroll_img();



function scroll_img() {
    const imgContent = document.querySelector('.image_content');
    const leftArrow = document.querySelector('.section_picture_left_btn img');
    const rightArrow = document.querySelector('.section_picture_right_btn img');
    let scrollAmount = 0;

    let scrollStep = 600; // 每次移動像素

    leftArrow.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
    });

    rightArrow.addEventListener('click', () => {
        const maxScroll = imgContent.scrollWidth - imgContent.clientWidth;
        scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
    });

    console.log(imgContent.clientWidth);
    console.log(imgContent.scrollWidth);
    console.log(scrollAmount);
}


function loading_attraction_data(){
    let id = location.search;
    let name = document.querySelector(".section_profile_name");
    let cat_mrt = document.querySelector(".section_profile_cat_mrt");
    let description = document.querySelector(".infors_description");
    let address = document.querySelector(".infors_location_content");
    let transport = document.querySelector(".infors_transportation_content");
    id = 1;
    fetch(`http://34.223.129.79:8000/api/attraction/${id}`)
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        let attraction = result.data;
        console.log(attraction);
        let attractionId = attraction.id;
        let attractionName = attraction.name;
        let attractionAddress = attraction.address;
        let attractionCategory = attraction.category;
        let attractionMrt = attraction.mrt;
        let attractionDescription = attraction.description;
        let attractionTrasport = attraction.transport;
        let attractionImgList = attraction.images;

        name.textContent = attractionName;
        cat_mrt.textContent = attractionCategory+"at"+attractionMrt;
        description.textContent = attractionDescription;
        address.textContent = attractionAddress;
        transport.textContent = attractionTrasport;

    })
}
function back_to_home_page(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.replace("http://34.223.129.79:8000")
    })
}

back_to_home_page();
loading_attraction_data();
scroll_img();
