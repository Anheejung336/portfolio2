
$(function () {

    AOS.init(); // AOS 초기화


    //프로모션 슬라이드
    let p_slide = new Swiper('.pro_slide_wrap', {
        slidesPerGroup: 3,
        slidesPerView: 3,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.pro_slide_wrap .swiper-pagination',
            clickable: true,
        },
    });

    //이벤트 스크롤러
    $('#scroller_1').simplyScroll({
        speed: 100,
        direction: 'backwards',
        pauseOnHover: false,
        frameRate: 10,
    });

    $('#scroller_2').simplyScroll({
        speed: 10,
        // direction: 'backwards',
        pauseOnHover: false,
        frameRate: 10,
    });

    //인트로
    window.onload = function () {
        setTimeout(function () {
            document.querySelector('.intro').classList.add('hidden');
        }, 3000);

        // 5초 후 메인 배너 표시
        setTimeout(function () {
            document.querySelector('.main_visual').style.display = 'block';  // 메인 배너 표시
            document.querySelector('.main_visual').style.opacity = '1';  // 메인 배너의 불투명도를 1로 변경
        }, 2500); // 5초 후

        // 7초 후 GNB가 아래에서 위로 슬라이드하여 나타나기
        setTimeout(function () {
            document.querySelector('header').style.transform = 'translateY(0)';  // GNB가 슬라이드로 나타남
        }, 4000); // 7초 후
    };
});