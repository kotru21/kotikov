$(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar");
    var $bx = $(".bx");
    $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    $bx.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
  });
});
