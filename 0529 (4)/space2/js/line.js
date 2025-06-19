
$(function () {

  const water = document.getElementById("water");
  let percent = 0;
  const interval = setInterval(() => {
    percent++;
    water.style.transform = `translate(0, ${100 - percent}%)`;
    if (percent === 100) {
      clearInterval(interval);
    }
  }, 60);


});
