jQuery(document).ready(function ($) {
  $(".svg").viewportChecker({
    classToAdd: "svg-animated",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".card-img-bottom").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".card-img-top").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".card").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".dsc-img").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".h2xld").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".h2xl").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".h3d").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".h3").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
  $(".rounded").viewportChecker({
    classToAdd: "visible",
    classToRemove: "",
    invertBottomOffset: true,
    repeat: false,
    callbackFunction: function (elem, action) {},
    scrollHorizontal: false,
  });
});
function msieversion() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf("MSIE ");

  if (msie > 0) {
    window.location.href = "IE-warning.html";
  } // If another browser, return 0

  return false;
}
msieversion();
