$(function () {

  // dots-wrapper 처음 스케일 세팅
  gsap.set(".space_dots_wrapper", { scale: 0 });

  gsap.to(".white_fill", {
    scale: 300,
    duration: 25,
    ease: "power3.out"
  });

  gsap.to(".space_dots_wrapper", {
    rotation: 1440,
    scale: 3.5,
    duration: 2,
    ease: "power3.out"
  });

  gsap.to(".sapce_text_wrapper", {
    opacity: 1,
    delay: 1,
    duration: 1,
    ease: "power2.out"
  });

  gsap.to(".space_dot1", {
    left: "50%",
    x: "-50%",
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".space_dot2", {
    left: "50%",
    x: "-50%",
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".mask-wrapper.left", {
    opacity: 1,
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".mask-wrapper.right", {
    opacity: 1,
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".sapce_text_wrapper", {
    clipPath: "inset(0% 50% 0% 50%)",
    delay: 2,
    duration: 1,
    ease: "power2.inOut"
  });

  gsap.to(".space_dot1, .space_dot2", {
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

  gsap.to(".background2", {
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    delay: 4.8
  });

  gsap.to(".next-wrapper", {
    opacity: 0,
    delay: 5,
    ease: "power2.out"
  });
/* 
  gsap.to(".draw_path", {
    strokeDashoffset: 0,
    duration: 2,
    ease: "power2.out",
    delay: 1,
    stagger: 0.3 
  });
 */

    gsap.registerPlugin(MotionPathPlugin);

    const drawTimeline = gsap.timeline({ delay: 5.3 });

    const shapes = [
      { id: "#shape1", path: "path", reverse: false },
      { id: "#shape2", path: "path", reverse: false },
      { id: "#shape3", path: "path", reverse: false },
      { id: "#shape4", path: "path", reverse: false }
    ];


    shapes.forEach(({ id, path, reverse }) => {
      const pathEl = document.querySelector(`${id} ${path}`);
      const svgEl = pathEl.closest("svg");

      svgEl.style.overflow = "visible";

      const pathLength = pathEl.getTotalLength();
      gsap.set(pathEl, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength
      });

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("r", 5);
      dot.setAttribute("fill", "white");
      dot.setAttribute("class", "draw_dot");
      dot.setAttribute("opacity", "0");
      pathEl.parentNode.appendChild(dot);

      // 선 그리기
      drawTimeline.to(pathEl, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut"
      }, 0);

      // 점 이동 (방향 조건 분기)
      drawTimeline.to(dot, {
        opacity: 1,
        duration: 0.2
      }, 0);

      drawTimeline.to(dot, {
        motionPath: {
          path: pathEl,
          align: pathEl,
          autoRotate: false,
          alignOrigin: [0.5, 0.5],
          start: reverse ? 1 : 0,
          end: reverse ? 0 : 1
        },
        duration: 2,
        ease: "power2.inOut"
      }, 0);

      drawTimeline.to(dot, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out"
      }, ">0.1");
    });

    // 도형 그리는 애니메이션 이후 실행
    gsap.to(".wave-fill-wrapper", {
      opacity: 1,
      delay: 2, // 도형이 그려지는 타이밍에 맞게 조절
      duration: 0.5
    });

    gsap.to(".wave-group", {
      y: 0,
      opacity: 1,
      delay: 2,
      duration: 2,
      ease: "power2.out"
    });









});