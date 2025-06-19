$(function () {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    $(".section_line").on("click", function (e) {
        e.preventDefault();

        // 모든 section 숨기기
        $(".section").hide();

        // #line 보여주기
        $("#line").fadeIn();

        // 애니메이션 실행
        gsap.fromTo(".horizontal-line",
            { width: 0 },
            { width: "60%", duration: 1.2, ease: "power3.out" }
        );

        gsap.fromTo(".animated-text",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, delay: 0.5 }
        );

        // 스크롤 이동
        gsap.to(window, {
            scrollTo: "#line",
            duration: 0.6,
            ease: "power2.inOut"
        });
    });

    // 초기 상태 설정
    gsap.set(".dot.left", { x: 0, y: 0 });
    gsap.set(".dot.right", { x: 0 });
    gsap.set(".line_center", { scaleX: 0, opacity: 0 });
    gsap.set(".text-up", { opacity: 0, y: 70 });
    gsap.set(".text-down", { opacity: 0, y: -70 });
    gsap.set(".circle-mask", {
        opacity: 0,
        maskImage: "conic-gradient(white 0deg, transparent 0deg)",
        webkitMaskImage: "conic-gradient(white 0deg, transparent 0deg)"
    });
    gsap.set(".circle-svg circle", { strokeDashoffset: 565 });
    gsap.set(".dot-container", { rotation: 0, transformOrigin: "50% 50%" });
    gsap.set(".history", { opacity: 0 }); // ✅ history 초기에 숨김

    // 첫 번째 스크롤 타임라인
    gsap.timeline({
        scrollTrigger: {
            trigger: ".fake-scroll",
            start: "top top",
            end: "+=300%",
            scrub: false
        }
    })
        .to(".dot.left", { x: -350, duration: 0.7 }, 0)
        .to(".dot.right", { x: 350, duration: 0.7 }, 0)
        .to(".line_center", { scaleX: 1, opacity: 1, duration: 0.7 }, 0.01)
        .to(".text-up", { opacity: 1, y: -30, duration: 1 }, 0.7)
        .to(".text-down", { opacity: 1, y: 20, duration: 1 }, 0.9)
        .to(".circle-mask", { opacity: 1, duration: 0.1 }, 1.4)
        .to(".dot-container", {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
                const rotation = gsap.getProperty(".dot-container", "rotation");
                const mask = `conic-gradient(white ${rotation}deg, transparent ${rotation}deg)`;
                document.querySelector(".circle-mask").style.maskImage = mask;
                document.querySelector(".circle-mask").style.webkitMaskImage = mask;
            }
        }, 1.5)
        .to(".circle-svg circle", { strokeDashoffset: 0, duration: 1.5 }, 1.5)
        .to(".dot.left", { x: 0, duration: 0.8 }, 2.6)
        .to(".dot.right", { x: 0, duration: 0.8 }, 2.6)
        .to(".line_center", { scaleX: 0, opacity: 0, duration: 0.8 }, 2.6)
        .set([".text-up", ".text-down"], { opacity: 0, display: "none" })
        .set(".dot-container", { rotation: 0 })
        .set(".circle-mask", {
            maskImage: "conic-gradient(white 0deg, transparent 0deg)",
            webkitMaskImage: "conic-gradient(white 0deg, transparent 0deg)"
        })
        .set(".text-up", { y: 70 })
        .set(".text-down", { y: -70 });

    // 두 번째 모션
    ScrollTrigger.create({
        trigger: ".second-scroll-trigger",
        start: "top center",
        end: "+=300%",
        onEnter: () => {
            gsap.set([".dot.right", ".line_center", ".dot.left"], { opacity: 0 });
            gsap.set(".dot-rotate-wrapper", { opacity: 1 });

            const circle = document.querySelector(".dot-rotate-wrapper circle");
            const length = circle.getTotalLength();
            gsap.set(circle, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            gsap.to(".dot-rotate-wrapper", {
                rotation: 360,
                x: -380,
                duration: 2,
                ease: "power2.inOut",
                onStart: () => {
                    gsap.set(".spin-dot", { opacity: 1 });

                    gsap.fromTo(".spin-dot",
                        { opacity: 1, y: 0, scale: 1 },
                        {
                            delay: 0.6,
                            opacity: 0,
                            scale: 0,
                            duration: 1.2,
                            ease: "power2.out"
                        }
                    );

                    gsap.to(circle, {
                        strokeDashoffset: 0,
                        duration: 2,
                        ease: "power2.inOut"
                    });

                    gsap.to(".spin-dot", {
                        opacity: 0,
                        scale: 0,
                        delay: 1.2,
                        duration: 1.2,
                        ease: "power2.out"
                    });

                    gsap.to(".circle-fill-image", {
                        opacity: 1,
                        duration: 1,
                        delay: 1,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.fromTo(".vertical-line",
                                { backgroundSize: "100% 0%" },
                                {
                                    backgroundSize: "100% 100%",
                                    duration: 1,
                                    ease: "power2.out",
                                    delay: 1
                                }
                            );

                            showStyledText(); // 텍스트 타이핑 + 다음 스크롤 연동 포함
                        }
                    });
                }
            });
        }
    });

    // 텍스트 타이핑 → 가로선 → 아이콘 → 세 번째 스크롤 트리거
    function showStyledText() {
        const target = document.querySelector(".text p");
        const plainText = `점에서 시작해\n선을 그리고, 면을 더해\n입체적 창조로\n나아가는 디자이너입니다.`;
        const totalLength = plainText.length;

        target.textContent = "";
        target.style.opacity = 1;

        let i = 0;
        let horizontalLineDrawn = false;

        const typingInterval = setInterval(() => {
            const currentText = plainText.slice(0, i);
            target.innerHTML = currentText.replace(/\n/g, "<br>");
            i++;

            if (i >= Math.floor(totalLength * 0.85) && !horizontalLineDrawn) {
                horizontalLineDrawn = true;
                gsap.to(".horizontal-line", {
                    width: 87,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }

            if (i > totalLength) {
                clearInterval(typingInterval);

                target.innerHTML = `
          <span>점</span>에서 시작해<br>
          <span>선</span>을 그리고, <span>면</span>을 더해<br>
          <strong>입체적 창조</strong>로<br>
          나아가는 디자이너입니다.
        `;

                gsap.to(".horizontal_line_right", {
                    width: 607,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(".floating-icons", {
                            opacity: 1,
                            duration: 1,
                            ease: "power2.out",
                            onComplete: () => {
                                // ✅ 모든 모션 끝난 후, 스크롤 트리거로 history 등장
                                // ✅ 세 번째 스크롤 - history 등장 → 자동 사라짐까지 포함
                                ScrollTrigger.create({
                                    trigger: ".third-scroll-trigger",
                                    start: "top center",
                                    toggleActions: "play reverse play reverse",
                                    onEnter: () => {
                                        gsap.to([
                                            ".circle-fill-image", ".text", ".horizontal-line",
                                            ".horizontal_line_right", ".floating-icons",
                                            ".vertical-line", ".circle-path-svg"
                                        ], {
                                            opacity: 0,
                                            duration: 1,
                                            ease: "power2.out",
                                            onComplete: () => {
                                                gsap.to(".history", {
                                                    opacity: 1,
                                                    duration: 1.2,
                                                    ease: "power2.out",
                                                    onComplete: () => {
                                                        // ✅ 1.5초 후 자동 사라짐
                                                        gsap.to(".history", {
                                                            delay: 1.5,
                                                            opacity: 0,
                                                            duration: 1,
                                                            ease: "power2.out"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    },
                                    onLeaveBack: () => {
                                        gsap.to(".history", {
                                            opacity: 0,
                                            duration: 0.6,
                                            ease: "power2.out"
                                        });

                                        gsap.to([
                                            ".circle-fill-image", ".text", ".horizontal-line",
                                            ".horizontal_line_right", ".floating-icons",
                                            ".vertical-line", ".circle-path-svg"
                                        ], {
                                            opacity: 1,
                                            duration: 1,
                                            delay: 0.6,
                                            ease: "power2.out"
                                        });
                                    }
                                });

                                ScrollTrigger.create({
                                    trigger: ".fourth-scroll-trigger",
                                    start: "top center",
                                    toggleActions: "play reverse play reverse",
                                    onEnter: () => {
                                        const svgPath = document.querySelector(".experience svg path");
                                        const pathLength = svgPath.getTotalLength();

                                        // 이미지 나타나고
                                        gsap.to(".experience img", {
                                            opacity: 1,
                                            duration: 1.2,
                                            ease: "power2.out"
                                        });

                                        // 선 드로잉
                                        gsap.set(svgPath, {
                                            strokeDasharray: pathLength,
                                            strokeDashoffset: pathLength
                                        });

                                        gsap.to(svgPath, {
                                            strokeDashoffset: 0,
                                            duration: 2,
                                            ease: "power2.inOut"
                                        });
                                    },
                                    onLeaveBack: () => {
                                        // 다시 숨김
                                        gsap.to(".experience img", {
                                            opacity: 0,
                                            duration: 0.8
                                        });

                                        const svgPath = document.querySelector(".experience svg path");
                                        const pathLength = svgPath.getTotalLength();

                                        gsap.set(svgPath, {
                                            strokeDashoffset: pathLength
                                        });
                                    }
                                });




                            }
                        });
                    }
                });
            }
        }, 50);
    }
});
