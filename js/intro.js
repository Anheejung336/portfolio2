$(function () {
    gsap.registerPlugin(MotionPathPlugin);

    $(window).on("load", function () {
        $("html, body").scrollTop(0);
    });

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    const bar = document.getElementById("bar");
    const ball = document.getElementById("intro_dot");
    const intro = document.querySelector(".intro");
    const colors = [
        "#7973F3", "#7973F3", "#7973F3", "#7973F3", "#7973F3", "#7973F3",
        "var(--main-color)", "var(--main-color)", "var(--main-color)", "var(--main-color)",
        "#99D0EF", "#99D0EF", "#99D0EF", "#99D0EF",
        "#C2E4F6", "#C2E4F6", "#C2E4F6"
    ];

    for (let i = 0; i < 17; i++) {
        const span = document.createElement("span");
        bar.appendChild(span);
    }

    const texts = document.querySelectorAll(".intro_text span");
    const spans = document.querySelectorAll(".progress-bar span");

    let bounceCount = 0;
    let textIndex = 0;
    let barIndex = 0;

    function playBounce() {
        bounceCount++;
        ball.classList.remove('bounce-default', 'bounce-final');
        void ball.offsetWidth;

        if (bounceCount < 5) {
            ball.classList.add('bounce-default');
            setTimeout(playBounce, 1300);
        } else {
            ball.classList.add('bounce-final');
        }
    }

    playBounce();

    const textInterval = setInterval(() => {
        texts.forEach(el => el.classList.remove("active"));
        if (texts[textIndex]) {
            texts[textIndex].classList.add("active");
            textIndex++;
        } else {
            clearInterval(textInterval);
        }
    }, 1300);

    const barInterval = setInterval(() => {
        if (spans[barIndex]) {
            spans[barIndex].style.background = colors[barIndex];
            barIndex++;
        } else {
            clearInterval(barInterval);
            clearInterval(textInterval);

            // ✅ 인트로 종료 후 커스텀 이벤트 발생시킴
            setTimeout(() => {
                document.querySelector('.progress-bar').style.display = "none";
                document.querySelector('.intro_text').style.display = "none";
                document.dispatchEvent(new Event("introComplete")); // <- dot.js 에서 받을 이벤트
            }, 1300);
        }
    }, 300);
    
});