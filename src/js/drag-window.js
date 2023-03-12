const appWindow = document.getElementsByClassName("app-window");

for (let i = 0; i < appWindows.length; i++) {
  const appWindow = appWindows[i];
  const appWindowHeader = appWindow.querySelector(".app-window-header");

  let isDragging = false;
  let mouseOffsetX = 0;
  let mouseOffsetY = 0;

  function onMouseDown(event) {
    isDragging = true;
    mouseOffsetX = event.clientX - appWindow.offsetLeft;
    mouseOffsetY = event.clientY - appWindow.offsetTop;
  }

  function onMouseMove(event) {
    if (isDragging) {
      const newLeft = event.clientX - mouseOffsetX;
      const newTop = event.clientY - mouseOffsetY;
      appWindow.style.left = newLeft + "px";
      appWindow.style.top = newTop + "px";
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  appWindowHeader.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}
