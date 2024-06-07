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
let nextPage = 0;
function fetch_attractions(){
    let attractions = document.querySelector(".attractions")
    fetch(`http://34.223.129.79:8000/api/attractions?page=${nextPage}`)
    .then((response) =>{
        return response.json();
    })
    .then((response) =>{
        nextPage = response.nextPage;
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
        console.log(nextPage)
    })
    .catch((error) =>{
        console.log(error)
    })
}
fetch_attractions()

window.addEventListener("scroll",function(e){
    // let{clientHeight,scrollHeight,scrollTop} = e.target.documentElement; //解構賦值
    let clientHeight = e.target.documentElement.clientHeight;
    let scrollHeight = e.target.documentElement.scrollHeight;
    let scrollTop = e.target.documentElement.scrollTop;
    console.log(scrollTop,scrollHeight,clientHeight)
    if(scrollTop+clientHeight >= scrollHeight ){
        if (nextPage != null){
            fetch_attractions()
        }
    }
})

append_mrt_station()

function scroll_list(){
    let listBarContent = document.querySelector('.list_bar_content');
    let leftArrow = document.querySelector('.list_bar_left_arrow img');
    let rightArrow = document.querySelector('.list_bar_right_arrow img');
    let scrollAmount = 0;

    let scrollStep = 800; // 每次移動像素

    leftArrow.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        listBarContent.style.transform = `translateX(-${scrollAmount}px)`;
    });

    rightArrow.addEventListener('click', () => {
        const maxScroll = listBarContent.scrollWidth - listBarContent.clientWidth;
        scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
        listBarContent.style.transform = `translateX(-${scrollAmount}px)`;
    });
}
scroll_list()





