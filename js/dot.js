$(function () {
    document.addEventListener("introComplete", function () {
        const tl = gsap.timeline();

        // 1. 인트로 전체 fade out + 제거
        tl.to(".intro", {
            opacity: 0,
            duration: 0.3,
            onStart: () => {
                $(".intro *").off(); // hover 등 제거
            },
            onComplete: () => {
                const introText = document.querySelector('.intro_text');
                const progressBar = document.querySelector('.progress-bar');
                if (introText) introText.style.display = "none";
                if (progressBar) progressBar.style.display = "none";
                $(".intro").remove();
                // ✅ 여기서 dot_bg 확장 효과 트리거
                document.querySelector(".dot_bg").classList.add("expand");
            }
        })

            .to(".dot_bg", {
                scale: 1,
                opacity: 1,
                clipPath: "circle(150% at 50% 50%)",
                duration: 1,
                ease: "power2.out",
                onStart: () => {
                    const bg = document.querySelector(".dot_bg");
                    bg.style.transform = "scale(0)";
                    bg.style.opacity = "0";
                }
            }, "<")

            // 3. 점 회전
            .to(".dots_container", {
                opacity: 1,
                rotate: 360,
                duration: 2,
                ease: "power2.inOut"
            }, "<")

            // 4. 중앙 텍스트
            .to(".center_text", {
                opacity: 1,
                duration: 1,
                ease: "power1.out"
            }, "-=1.6")

            // ✅ 5. 고정 사이드 GNB 등장 (회전 도중)
            .fromTo(".side_gnb", {
                y: 80,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=1") // ← dots_container 회전 중간쯤부터

            // ✅ 6. scroll_hint 등장 (GNB 등장 직후)
            .fromTo(".scroll_hint", {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3"); // gnb 뜨고 바로 직후에 뜨게

        // ✅ 이후: 첫 번째 스크롤 시 모션
        setupScrollTrigger();
    });

    // ✅ 1. 전역 상태
    let isAnimating = false;

    // ✅ 2. 타임라인 정의
    const tl2 = gsap.timeline({
        paused: true,
        onStart: () => {
            isAnimating = true;
            document.body.style.overflow = 'hidden';
        },
        onComplete: () => {
            isAnimating = false;
            document.body.style.overflow = 'auto';
        }
    });

    // ✅ 3. 모션 정의

    // ✅ 8개의 점 이동을 위한 좌표 저장
    function setupScrollTrigger() {
        const dots = document.querySelectorAll(".dot_item");
        dots.forEach(dot => {
            const rect = dot.getBoundingClientRect();
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const offsetX = cx - (rect.left + rect.width / 2);
            const offsetY = cy - (rect.top + rect.height / 2) - 50;
            dot.dataset.x = offsetX;
            dot.dataset.y = offsetY;
        });

        let motionPlayed = false;
        let isAnimating = false;

        $(window).on("wheel.first", function (e) {
            if (motionPlayed || isAnimating) return;

            isAnimating = true;

            const tl2 = gsap.timeline({
                onComplete: () => {
                    motionPlayed = true;
                    isAnimating = false;
                }
            });

            // 중앙 텍스트 사라짐
            tl2.to(".center_text", {
                opacity: 0,
                duration: 0.3,
                ease: "power1.inOut"
            });

            // 점들이 중앙으로 모이기
            dots.forEach(dot => {
                const x = parseFloat(dot.dataset.x);
                const y = parseFloat(dot.dataset.y);
                tl2.to(dot, {
                    x,
                    y,
                    duration: 1.2,
                    ease: "power2.inOut"
                }, "<"); // 동시에
            });

            // 다음 텍스트 등장
            tl2.to(".next_text", {
                opacity: 1,
                duration: 1,
                ease: "power1.out"
            }, "-=0.4")
                // 큰 점과 작은 점 동시에 튀게
                .fromTo(".big_dot", {
                    y: 0,
                    scale: 0,
                    opacity: 0
                }, {
                    y: -150,
                    scale: 1.8,
                    opacity: 1,
                    duration: 0.8, // ← 더 빠르게
                    ease: "back.out(1.7)"
                }, "-=0.2") // 텍스트 거의 다 보일 타이밍에 맞춰

                .fromTo(".small_dot", {
                    y: 0,
                    scale: 0,
                    opacity: 0
                }, {
                    y: -220,
                    scale: 1,
                    opacity: 1,
                    duration: 0.8, // ← 동일하게
                    ease: "back.out(1.7)"
                }, "<")


                // 1. .next_text 위로 날아가듯 작아지며 사라짐
                .to(".next_text", {
                    y: "-=120vh",
                    scale: 0.05,
                    opacity: 0,
                    duration: 4.5,
                    ease: "power2.out"
                }, "explode+=0.3")

                // 2. 나머지 dot 숨기기
                .to(".dot_item:not(:nth-child(5))", {
                    opacity: 0,
                    duration: 0,
                    onComplete: () => {
                        document.querySelectorAll(".dot_item").forEach((el, i) => {
                            if (i !== 4) el.style.display = "none";
                        });
                    }
                }, "explode") // ← 동시에 시작됨

                // ✅ .dot_item:nth-child(5) → 가운데 아래로
                .to(".dot_item:nth-child(5)", {
                    x: 0,
                    y: -300,
                    duration: 1.2,
                    ease: "power2.out"
                }, "explode+=0.3")

                // ✅ big_dot → 왼쪽 위로
                .to(".big_dot", {
                    x: -200,
                    y: -150,
                    opacity: 1,
                    scale: 1.5,
                    duration: 1.2,
                    ease: "power2.out"
                }, "explode+=0.3")

                // ✅ small_dot → 오른쪽 위로
                .to(".small_dot", {
                    x: 180,
                    y: -120,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power2.out"
                }, "explode+=0.3")

            // .third_text 등장 + 점 다시 모이기 (동시에)
            tl2.fromTo(".third_text", {
                opacity: 0,
                top: 1000 // 시작 위치 (CSS와 일치해야 함)
            }, {
                opacity: 1,
                top: 300, // 도착 위치
                duration: 2,
                ease: "power2.out"
            }, ">-0.3");

            // 점 다시 모으기
            tl2.to(".dot_item:nth-child(5)", {
                x: 0,
                y: -550,
                duration: 1.2,
                ease: "power2.out"
            }, "<");

            tl2.to(".big_dot", {
                x: -20,
                y: -280,
                scale: 1.4,
                duration: 1.2,
                ease: "power2.out"
            }, "<");

            tl2.to(".small_dot", {
                x: -50,
                y: -300,
                scale: 1,
                duration: 1.2,
                ease: "power2.out"
            }, "<");

            // ✅ big/small 점 서서히 사라지기
            tl2.to([".big_dot", ".small_dot"], {
                opacity: 0,
                scale: 0.5,
                duration: 0.8,
                ease: "power1.inOut"
            }, "-=1"); // ← 약간 텀을 주고 사라지기 시작

            // ✅ 텍스트와 메인 점 함께 왼쪽으로 이동
            tl2.to([".third_text", ".dot_item:nth-child(5)"], {
                x: "-=500",  // ← 왼쪽으로 이동
                duration: 1.5,
                ease: "power2.inOut"
            }, "<"); // ← 동시에 시작

            tl2.add(() => {
                const originDot = document.querySelector(".dot_item:nth-child(5)");
                const jumpDot = document.getElementById("dot_jump");

                const rect = originDot.getBoundingClientRect();

                // fixed 기준 → viewport 기준 위치 그대로
                gsap.set(jumpDot, {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    opacity: 1,
                    transform: "translate(-50%, -50%)",
                    position: "fixed"
                });

                originDot.style.opacity = 0;
            });

            // 점프 1
            tl2.to("#dot_jump", {
                y: "-=120",
                duration: 0.2, // 빠르게
                ease: "power1.out"
            }, "jump1");

            tl2.to("#dot_jump", {
                x: "+=300",
                duration: 0.4, // 빠르게
                ease: "power1.inOut"
            }, "jump1");

            tl2.to("#dot_jump", {
                y: "+=120",
                duration: 0.2, // 빠르게
                ease: "power1.in"
            }, "jump1+=0.2");

            tl2.to(".group1", {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "jump1+=0.4");


            // 점프 2
            tl2.to("#dot_jump", {
                y: "-=120",
                duration: 0.2,
                ease: "power1.out"
            }, "jump2");

            tl2.to("#dot_jump", {
                x: "+=450",
                duration: 0.4,
                ease: "power1.inOut"
            }, "jump2");

            tl2.to("#dot_jump", {
                y: "+=120",
                duration: 0.2,
                ease: "power1.in"
            }, "jump2+=0.2");

            tl2.to(".group2", {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "jump2+=0.4");


            // 점프 3
            tl2.to("#dot_jump", {
                y: "-=120",
                duration: 0.2,
                ease: "power1.out"
            }, "jump3");

            tl2.to("#dot_jump", {
                x: "+=370",
                duration: 0.4,
                ease: "power1.inOut"
            }, "jump3");

            tl2.to("#dot_jump", {
                y: "+=120",
                duration: 0.2,
                ease: "power1.in"
            }, "jump3+=0.2");

            tl2.to(".group3", {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            }, "jump3+=0.4");


            // 점프 4 + 사라짐
            tl2.to("#dot_jump", {
                y: "-=120",
                duration: 0.2,
                ease: "power1.out"
            }, "jump4");

            tl2.to("#dot_jump", {
                x: "+=500",
                duration: 0.4,
                ease: "power1.inOut"
            }, "jump4");

            tl2.to("#dot_jump", {
                y: "+=120",
                duration: 0.2,
                ease: "power1.in"
            }, "jump4+=0.2");

            tl2.to("#dot_jump", {
                x: "+=200",
                y: "-=300",
                opacity: 0,
                duration: 0.4,
                ease: "power2.in"
            }, "jump4+=0.5");



            // ✅ 5. ScrollTrigger로 모션 트리거
            ScrollTrigger.create({
                trigger: ".section_dot", // 🔁 너의 첫 번째 섹션 ID
                start: "top top",
                pin: true,
                scrub: false,
                onEnter: () => {
                    if (!isAnimating) tl2.play();
                },
                onEnterBack: () => {
                    if (!isAnimating) tl2.restart();
                }
            });

            // ✅ 6. 휠/터치 이동 차단 (모션 중일 때만)
            window.addEventListener("wheel", e => {
                if (isAnimating) e.preventDefault();
            }, { passive: false });

            window.addEventListener("touchmove", e => {
                if (isAnimating) e.preventDefault();
            }, { passive: false });


        });

    }
});