$(function () {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  let hasPlayedSecondMotion = false;

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
  gsap.set(".history", { opacity: 0 });

  // ✅ 첫 번째 모션
  function playFirstMotion() {
    gsap.set(".dot.left", { x: 0, y: 0 });
    gsap.set(".dot.right", { x: 0 });
    gsap.set(".line_center", { scaleX: 0, opacity: 0 });
    gsap.set(".text-up", { opacity: 0, y: 70, display: "block" });
    gsap.set(".text-down", { opacity: 0, y: -70, display: "block" });
    gsap.set(".circle-mask", {
      opacity: 0,
      maskImage: "conic-gradient(white 0deg, transparent 0deg)",
      webkitMaskImage: "conic-gradient(white 0deg, transparent 0deg)"
    });
    gsap.set(".circle-svg circle", { strokeDashoffset: 565 });
    gsap.set(".dot-container", { rotation: 0 });

    document.body.classList.add("scroll-lock");

    gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("scroll-lock");
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
  }

  playFirstMotion();

  // ✅ 두 번째 모션
  function runSecondMotion() {
    if (hasPlayedSecondMotion) return;
    hasPlayedSecondMotion = true;

    document.body.classList.add("scroll-lock");

    gsap.set([".dot.right", ".line_center", ".dot.left"], { opacity: 0 });
    gsap.set(".dot-rotate-wrapper", { opacity: 1 });
    gsap.set(".spin-dot", { opacity: 1, scale: 1, y: 0 });
    gsap.set(".circle-fill-image", { opacity: 0 });
    gsap.set(".vertical-line", { backgroundSize: "100% 0%" });
    gsap.set(".horizontal-line", { width: 0, opacity: 0 });
    gsap.set(".horizontal_line_right", { width: 0, opacity: 0 });
    gsap.set(".floating-icons", { opacity: 0 });

    const circle = document.querySelector(".dot-rotate-wrapper circle");
    const length = circle.getTotalLength();
    gsap.set(circle, {
      strokeDasharray: length,
      strokeDashoffset: length
    });

    gsap.timeline({
      onComplete: () => {
        document.body.classList.remove("scroll-lock");
      }
    })
      .to(".dot-rotate-wrapper", {
        rotation: 360,
        x: -380,
        duration: 2,
        ease: "power2.inOut",
        onStart: () => {
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
                  delay: 1,
                  onComplete: showStyledText
                }
              );
            }
          });
        }
      });
  }

  ScrollTrigger.create({
    trigger: ".second-scroll-trigger",
    start: "top center",
    end: "+=300%",
    onEnter: runSecondMotion,
    onEnterBack: runSecondMotion
  });

  // ✅ 텍스트 타이핑 + 가로선 + 아이콘 등장
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
              ease: "power2.out"
            });
          }
        });
      }
    }, 50);
  }

  // ✅ 세 번째 섹션 모션
  ScrollTrigger.create({
    trigger: ".third-scroll-trigger",
    start: "top center",
    onEnter: () => {
      document.body.classList.add("scroll-lock");

      // ✅ 이전 요소들 사라짐 + history 등장
      // ScrollTrigger의 scrub 옵션을 사용하지 않고, opacity 애니메이션이 끝나자마자 바로 다음 섹션으로 자연스럽게 넘어가도록 scroll 위치를 강제로 이동
      gsap.to([
        ".circle-fill-image",
        ".text",
        ".horizontal-line",
        ".horizontal_line_right",
        ".floating-icons",
        ".vertical-line",
        ".dot-rotate-wrapper"
      ], {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          // 애니메이션이 끝나면 바로 다음 섹션(top 기준)으로 스크롤 이동
          const nextSection = document.querySelector('.third-scroll-trigger').nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      });

      gsap.fromTo(".history",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          onComplete: () => {
            document.body.classList.remove("scroll-lock");
          }
        }
      );
    },
    onEnterBack: () => {
      // 다시 올라왔을 때는 두 번째 모션 요소 다시 보이게
      gsap.to([
        ".circle-fill-image",
        ".text",
        ".horizontal-line",
        ".horizontal_line_right",
        ".floating-icons",
        ".vertical-line",
        ".dot-rotate-wrapper"
      ], {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      });

      gsap.to(".history", {
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });


    }



  });
  let fourthEntered = false;
  let lockedY = 0;

  ScrollTrigger.create({
    trigger: ".fourth-scroll-trigger",
    start: "top center",
    onEnter: () => {
      gsap.to(".history", { opacity: 0, duration: 1 });
      console.log("✅ fourth trigger entered");

      gsap.fromTo(".new-svg", { opacity: 0 }, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        onStart: () => {
          // ✅ path 초기화: 잘림 방지
          const paths = document.querySelectorAll(".new-svg path");
          paths.forEach(path => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length
            });
          });
        },
        onComplete: () => {
          // ✅ 스케치 애니메이션 실행
          const paths = document.querySelectorAll(".new-svg path");
          paths.forEach(path => {
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 2,
              ease: "power2.out"
            });
          });

                // ✅ .ex 텍스트 중앙 등장 애니메이션 추가
      gsap.fromTo(".ex", { opacity: 0 }, {
        opacity: 1,
        duration: 1.2,
        delay: 0.2,
        ease: "power2.out"
      });
        }
      });

      // ✅ 진입 시 현재 위치 저장하고 플래그 설정
      lockedY = window.scrollY;
      fourthEntered = true;
    },
    onEnterBack: () => {
      gsap.to(".new-svg", { opacity: 0, duration: 1 });
      gsap.to(".history", { opacity: 1, duration: 1 });

      // ✅ 다시 올라갈 수 있게 플래그 해제
      fourthEntered = false;
    },
    markers: false
  });

  // ✅ 위로 스크롤 막기 (추가 코드만!)
  window.addEventListener("scroll", () => {
    document.body.classList.remove("scroll-lock");

    if (fourthEntered && window.scrollY < lockedY) {
      window.scrollTo({ top: lockedY });
    }
  });

 let fifthEntered = false;
let lockedY2 = 0;

ScrollTrigger.create({
  trigger: ".fifth-scroll-trigger",
  start: "top center",
  onEnter: () => {
    console.log("✅ fifth trigger entered");

    // ✅ 이전 네 번째 모션 요소 제거
    gsap.to([".new-svg", ".ex"], { opacity: 0, duration: 1 });

    // ✅ 새 SVG 등장 + 스케치 애니메이션
    gsap.fromTo(".new-svg-2", { opacity: 0 }, {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      onStart: () => {
        const paths = document.querySelectorAll(".new-svg-2 path");
        paths.forEach(path => {
          const length = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
          });
        });
      },
      onComplete: () => {
        const paths = document.querySelectorAll(".new-svg-2 path");
        paths.forEach(path => {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.out"
          });
        });

        // ✅ 이어서 ex2 SVG 등장
        gsap.fromTo(".ex2", { opacity: 0 }, {
          opacity: 1,
          duration: 1.2,
          delay: 0.3,
          ease: "power2.out",
          onStart: () => {
            const paths2 = document.querySelectorAll(".ex2 path");
            paths2.forEach(path => {
              const length = path.getTotalLength();
              gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length
              });
            });
          },
          onComplete: () => {
            const paths2 = document.querySelectorAll(".ex2 path");
            paths2.forEach(path => {
              gsap.to(path, {
                strokeDashoffset: 0,
                duration: 2,
                ease: "power2.out"
              });
            });
          }
        });
      }
    });

    // ✅ 진입 위치 저장 + 위로 못 올라가게
    lockedY2 = window.scrollY;
    fifthEntered = true;
  },

  onEnterBack: () => {
    gsap.to([".new-svg-2", ".ex2"], { opacity: 0, duration: 1 });
    gsap.to([".new-svg", ".ex"], { opacity: 1, duration: 1 }); // 네 번째 복귀 시 원래 상태로
    fifthEntered = false;
  },

  markers: false
});

window.addEventListener("scroll", () => {
  if (fifthEntered && window.scrollY < lockedY2) {
    window.scrollTo({ top: lockedY2 });
  }
});



});
