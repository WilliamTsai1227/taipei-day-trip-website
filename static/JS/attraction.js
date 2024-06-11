function scroll_img(){
    let imgContent = document.querySelector('.section_picture');
    let leftArrow = document.querySelector('.section_picture_left_btn img');
    let rightArrow = document.querySelector('.section_picture_right_btn img');
    let scrollAmount = 0;
    

    let scrollStep = 600; // 每次移動像素

    leftArrow.addEventListener('click', () => {
        scrollAmount = Math.max(scrollAmount - scrollStep, 0);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
    });
    rightArrow.addEventListener('click', () => {
        let maxScroll = imgContent.scrollWidth - imgContent.clientWidth;
        scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
        imgContent.style.transform = `translateX(-${scrollAmount}px)`;
    });
    console.log(imgContent.clientWidth);
    console.log(imgContent.scrollWidth);
    console.log(scrollAmount);
}

scroll_img();