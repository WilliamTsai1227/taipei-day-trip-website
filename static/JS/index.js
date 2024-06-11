function append_mrt_station(){
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
    })
    .catch((error) => {
        console.log(error)
    })
}

let page = 0;
let keyword = "";
let isLoading = false; // 建立標籤，表示是否正在加載數據
function fetch_attractions(){
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
    console.log(list_items);
    let id = 0;
    list_items.forEach(item => {
        item.addEventListener("click", () =>{
            id = item.querySelector(".attraction_id").textContent;
            window.location.replace(`http://34.223.129.79:8000/attraction/${id}`)
            // fetch(`http://34.223.129.79:8000/attraction/${id}`);
            // console.log(`http://34.223.129.79:8000/attraction/${id}`);
        })
    })
}

function back_to_home_page(){
    let homepage_btn = document.querySelector(".navigation_title")
    homepage_btn.addEventListener("click",() => {
        window.location.replace("http://34.223.129.79:8000")
    })
}


document.addEventListener('DOMContentLoaded', () => {
    append_mrt_station();
    fetch_attractions();
    scrolling_add_attractions();
    search();
    scroll_list();
    back_to_home_page();
    setTimeout(monitor_attraction_clicks, 3000);
    setTimeout(monitor_mrt_click, 1000); 
});




