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



