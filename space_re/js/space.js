$(function () {
  gsap.registerPlugin(MotionPathPlugin, ScrollToPlugin, ScrollTrigger);

  // 1. 인트로: dots-wrapper
  gsap.set(".dots-wrapper", { scale: 0 });

  gsap.to(".white-fill", {
    scale: 300,
    duration: 25,
    ease: "power3.out"
  });

  gsap.to(".dots-wrapper", {
    rotation: 1440,
    scale: 3.5,
    duration: 2,
    ease: "power3.out"
  });

  gsap.to(".text-wrapper", {
    opacity: 1,
    delay: 1,
    duration: 1,
    ease: "power2.out"
  });

  gsap.to([".dot1", ".dot2"], {
    left: "50%",
    x: "-50%",
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to([".mask-wrapper.left", ".mask-wrapper.right"], {
    opacity: 1,
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".text-wrapper", {
    clipPath: "inset(0% 50% 0% 50%)",
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".dot1, .dot2", {
    scale: 0,
    opacity: 0,
    delay: 3,
    duration: 1.5,
    ease: "power2.out"
  });

  gsap.to(".new-fill", {
    scale: 300,
    duration: 100,
    ease: "power2.out",
    delay: 3.5
  });

  gsap.to(".next-wrapper", {
    opacity: 1,
    delay: 3.7,
    duration: 1,
    ease: "power2.out"
  });

  // ✅ wave-fill 실행 포인트
  gsap.to(".background2", {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    delay: 4.8,
    onComplete: () => {
      showWaveFillSequence();
    }
  });

  gsap.to(".next-wrapper", {
    opacity: 0,
    delay: 5,
    ease: "power2.out"
  });

  // 2. 물 배경 translate 애니메이션
  const water = document.getElementById("water");
  let percent = 0;
  const interval = setInterval(() => {
    percent++;
    water.style.transform = `translate(0, ${100 - percent}%)`;
    if (percent === 100) clearInterval(interval);
  }, 60);

  // 3. wave-fill 그리기 타임라인
  const drawTimeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, paused: true });

  const paths = document.querySelectorAll('.wave-fill .draw-path');
  const fillRects = document.querySelectorAll('.fill-rect');
  const waveGroups = document.querySelectorAll('.water_wave');

  paths.forEach((pathEl) => {
    const pathLength = pathEl.getTotalLength();
    gsap.set(pathEl, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", 5);
    dot.setAttribute("fill", "white");
    dot.setAttribute("class", "draw_dot");
    dot.setAttribute("opacity", "0");
    pathEl.parentNode.appendChild(dot);

    drawTimeline.to(pathEl, { strokeDashoffset: 0, duration: 2 }, 0);
    drawTimeline.to(dot, { opacity: 1, duration: 0.2 }, 0);
    drawTimeline.to(dot, {
      motionPath: {
        path: pathEl,
        align: pathEl,
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      },
      duration: 2
    }, 0);
    drawTimeline.to(dot, { opacity: 0, duration: 0.2 }, ">0.1");
  });

  drawTimeline.add(() => {
    fillRects.forEach((rect) => {
      gsap.to(rect, {
        attr: { y: 0 },
        duration: 1.5,
        ease: "power2.out"
      });
    });
    waveGroups.forEach((wave) => {
      gsap.to(wave, {
        attr: { y: 0 },
        duration: 1.5,
        ease: "power2.out"
      });
    });
  }, ">0.3");

  // 4. wave-fill 시퀀스 실행
  function showWaveFillSequence() {
    const wrapper = document.querySelector(".wave-fill-wrapper");
    wrapper.style.display = "block";
    gsap.to(wrapper, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        drawTimeline.play();
      }
    });

    
  }
// ✅ 도형 애니메이션 모두 끝난 후 실행
drawTimeline.add(() => {
  // wave-fill-wrapper 사라짐
  gsap.to(".wave-fill-wrapper", {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      // ✅ 기존 요소 숨김 (gnb 제외!)
      gsap.to([
        ".shapes", ".square-group", ".up", ".background", ".background2", ".white-fill"
      ], {
        opacity: 0,
        duration: 0.2
      });

      // ✅ project 등장
      gsap.to(".project", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        onStart: () => {
          const project = document.querySelector(".project");
          project.style.pointerEvents = "auto";
        }
      });
    }
  });
}, ">4"); // ⬅ fill 끝나는 시간보다 살짝 늦게 실행
});