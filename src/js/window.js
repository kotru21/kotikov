const appButtons = document.querySelectorAll(".app-button");
const appWindows = document.querySelectorAll(".app-window");

appButtons.forEach(function (appButton) {
  appButton.addEventListener("click", function () {
    // получаем значение атрибута data-app-window у текущей кнопки
    const appWindowClass = appButton.getAttribute("data-app-window");
    // находим окно приложения с классом, соответствующим значению атрибута
    const appWindow = document.querySelector("." + appWindowClass);
    // показываем найденное окно
    appWindow.style.display = "block";

    // скрываем окно приложения, если пользователь кликнул вне окна и кнопки
    document.addEventListener("click", function (e) {
      if (!appWindow.contains(e.target) && !appButton.contains(e.target)) {
        appWindow.style.display = "none";
      }
    });
  });
});
