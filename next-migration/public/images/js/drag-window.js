const appWindow = document.getElementsByClassName("app-window");

for (let i = 0; i < appWindows.length; i++) {
  const appWindow = appWindows[i];
  const appWindowHeader = appWindow.querySelector(".app-window-header");

  let isDragging = false;
  let mouseOffsetX = 0;
  let mouseOffsetY = 0;
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  function onMouseDown(event) {
    isDragging = true;
    mouseOffsetX = event.clientX - appWindow.offsetLeft;
    mouseOffsetY = event.clientY - appWindow.offsetTop;
  }

  function onTouchStart(event) {
    isDragging = true;
    const touch = event.touches[0];
    touchOffsetX = touch.clientX - appWindow.offsetLeft;
    touchOffsetY = touch.clientY - appWindow.offsetTop;

    // Disable scrolling
    document.body.style.overflow = "hidden";
  }
  function onMouseMove(event) {
    if (isDragging) {
      const newLeft = event.clientX - mouseOffsetX;
      const newTop = event.clientY - mouseOffsetY;
      appWindow.style.left = newLeft + "px";
      appWindow.style.top = newTop + "px";
    }
  }

  function onTouchMove(event) {
    if (isDragging) {
      const touch = event.touches[0];
      const newLeft = touch.clientX - touchOffsetX;
      const newTop = touch.clientY - touchOffsetY;
      appWindow.style.left = newLeft + "px";
      appWindow.style.top = newTop + "px";
    }
  }

  function onMouseUp() {
    isDragging = false;
  }

  function onTouchEnd() {
    // Enable scrolling again
    document.body.style.overflow = "auto";
    isDragging = false;
  }
  appWindowHeader.addEventListener("mousedown", onMouseDown);
  appWindowHeader.addEventListener("touchstart", onTouchStart);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchend", onTouchEnd);
}
