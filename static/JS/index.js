import { login, signup, logout } from './modules/auth.js';
import { getUserData } from './modules/user.js';
import { backToHomePage, showLoginBlock, closeLoginBlock, changeToSignupBlock, changeToLoginBlock, eraseErrorMessage, changeToBookingPage } from './modules/ui.js';




async function appendMrtStation(){
    let listBarContent = document.querySelector(".list_bar_content");
    fetch("https://taipeitrips.com/api/mrts")
    .then((response) =>{
        return response.json();
    })
    .then((response) => {
        for (let i of response.data){
            let listItem = document.createElement("div");
            listItem.className = "list_item";
            listItem.textContent = i;
            listBarContent.appendChild(listItem);
        }
        monitorMrtClick();
    })
    .catch((error) => {
        console.log(error)
    })
}

let page = 0;
let keyword = "";
let isLoading = false; // Create a label to indicate whether data is loading
async function fetchAttractions(){
    if (isLoading) return; // If data is being loaded, the load operation is not triggered
    isLoading = true; // Start loading data, set isLoading to true
    let attractions = document.querySelector(".attractions")
    fetch(`https://taipeitrips.com/api/attractions?page=${page}&keyword=${keyword}`)
    .then((response) =>{
        return response.json();
    })
    .then((response) =>{
        page = response.nextPage;
        for (let i of response.data){
            let attraction = document.createElement("div");
            attraction.className = "attraction";
            let attractionContent = document.createElement("div");
            attractionContent.className = "attraction_content";
            let attractionId = document.createElement("div");
            attractionId.className = "attraction_id";
            let attractionImg = document.createElement("img");
            attractionImg.className = "attraction_img";
            let attractionName = document.createElement("div");
            attractionName.className = "attraction_name";
            let attractionMrtCategory = document.createElement("div");
            attractionMrtCategory.className = "attraction_mrt_cat";
            let attractionMrt = document.createElement("div");
            attractionMrt.className = "attraction_mrt";
            let attractionCategory = document.createElement("div");
            attractionCategory.className = "attraction_cat";
            let id = i.id;
            let name = i.name;
            let mrt = i.mrt;
            let category = i.category;
            let img = i.images[0];
            attractionId.textContent = id;
            attractionImg.src = img;
            attractionName.textContent = name;
            attractionMrt.textContent = mrt;
            attractionCategory.textContent = category;
            attractionMrtCategory.appendChild(attractionMrt);
            attractionMrtCategory.appendChild(attractionCategory);
            attractionContent.appendChild(attractionId);
            attractionContent.appendChild(attractionImg);
            attractionContent.appendChild(attractionName);
            attractionContent.appendChild(attractionMrtCategory);
            attraction.appendChild(attractionContent);
            attractions.appendChild(attraction);
        }
        isLoading = false; // Data loading is complete, set isLoading to false
        monitorAttractionClicks(); 
    })
    .catch((error) =>{
        console.log(error);
        isLoading = false; // Data loading error, set isLoading to false
    })
}



function scrollingAddAttractions(){
    let footer = document.querySelector(".footer");
    window.addEventListener("scroll", function () {
      const { bottom } = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (bottom <= windowHeight) {
        if (page != null){
            fetchAttractions();
        }
      }
    });
}
function search(){
    let button = document.querySelector(".hero_section_search_icon");
    let input = document.querySelector(".hero_section_search input");
    let attractions = document.querySelector(".attractions");
    button.addEventListener("click",async () => {
        page = 0;
        keyword = input.value;
        while(attractions.firstChild){
            attractions.removeChild(attractions.firstChild);
        }
        await fetchAttractions();
    })
}

function scrollMRTList(){
    let listBarContent = document.querySelector('.list_bar_content');
    let leftArrow = document.querySelector('.list_bar_left_arrow img');
    let rightArrow = document.querySelector('.list_bar_right_arrow img');
    let scrollAmount = 0;

    let scrollStep = 200; // Move pixels each time

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

function monitorMrtClick(){
    let listItems = document.querySelectorAll(".list_item");
    let input = document.querySelector(".hero_section_search input");
    let attractions = document.querySelector(".attractions");
    listItems.forEach(item => {
        item.addEventListener("click",() => {
            let searchInput = item.textContent;
            input.value = searchInput;
            page = 0;
            keyword = input.value;
            while(attractions.firstChild){
                attractions.removeChild(attractions.firstChild);
            }
            fetchAttractions();
        })
    })    
}

function monitorAttractionClicks(){
    let listItems = document.querySelectorAll(".attraction_content");
    let id = 0;
    listItems.forEach(item => {
        item.addEventListener("click", () =>{
            id = item.querySelector(".attraction_id").textContent;
            window.location.href = `https://taipeitrips.com/attraction/${id}`;
        })
    })
}




async function excute(){
    getUserData();
    await appendMrtStation();
    await fetchAttractions();
    monitorMrtClick();
    monitorAttractionClicks();
    scrollMRTList();
    search();
    scrollingAddAttractions();
    backToHomePage();
    showLoginBlock();
    closeLoginBlock();
    changeToSignupBlock();
    changeToLoginBlock();
    login();
    signup();
    eraseErrorMessage();
    logout();
    changeToBookingPage();
}
excute();








