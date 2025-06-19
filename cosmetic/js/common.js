$(function () {
  //햄버거 메뉴 클릭
  $('.ham').click(function () {
    $('header').toggleClass('on');
  });

  const $gnbLi = $('.fix .gnb>ul>li');
  for (let i = 0; i < $gnbLi.length; i++) {
    $gnbLi.eq(i).css({
      'transition-delay': 0.2 * (i + 1) + 's',
    });
  }

  $(window).on('scroll', function () {
    let st = $(this).scrollTop();
    // console.log(st);
    if (st >= 80) {
      $('header').addClass('sc');
    } else {
      $('header').removeClass('sc');
    }
  })

});