"use client";

export default function TestMobile() {
  return (
    <>
      {/* Тест 1: базовый элемент */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          background: "red",
          color: "white",
          padding: "10px",
          zIndex: 9999,
        }}>
        Всегда видимый тест
      </div>

      {/* Тест 2: pc-hide элемент */}
      <div
        className="pc-hide"
        style={{
          position: "fixed",
          top: "50px",
          left: "10px",
          background: "blue",
          color: "white",
          padding: "10px",
          zIndex: 9999,
        }}>
        PC-HIDE тест
      </div>

      {/* Тест 3: мобильные социальные сети */}
      <div
        className="pc-hide my-social"
        style={{
          position: "fixed",
          top: "90px",
          left: "10px",
          background: "green",
          color: "white",
          padding: "10px",
          zIndex: 9999,
          width: "auto",
        }}>
        <i className="bx bxl-vk"></i>
        <i className="bx bxl-youtube"></i>
        MY-SOCIAL тест
      </div>
    </>
  );
}
