function append_mrt_station(){
    listBarContent = document.querySelector(".list_bar_content");
    listItem = document.createElement("div");
    listItem.className = "list_item";
    fetch("http://34.223.129.79:8000/api/mrts")
    .then((response) =>{
        return response.json();
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error)
    })
}

append_mrt_station()
