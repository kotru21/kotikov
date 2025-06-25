import React from "react";
import { WindowProps, DeviceInfo } from "./types";

interface PCSpecsWindowProps extends WindowProps {
  deviceInfo: DeviceInfo;
}

export default function PCSpecsWindow({
  windowId,
  position,
  isDragging,
  onMouseDown,
  onClose,
  deviceInfo,
}: PCSpecsWindowProps) {
  return (
    <div
      className="app-window show"
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onMouseDown={(e) => onMouseDown(e, windowId)}>
      <div className="app-window-header" style={{ cursor: "grab" }}>
        <i className="bx bx-info-circle"></i>О пека
        <button
          onClick={onClose}
          style={{
            float: "right",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}>
          ×
        </button>
      </div>
      <div className="app-window-body">
        <div className="window-content">
          <table>
            <tbody>
              <tr>
                <td className="pc_specs-special" colSpan={2}>
                  Характеристики устройства
                </td>
              </tr>
              <tr>
                <td>Процессор</td>
                <td>{deviceInfo.processor}</td>
              </tr>
              <tr>
                <td>Количество ядер</td>
                <td>{deviceInfo.hardwareConcurrency}</td>
              </tr>
              <tr>
                <td>Оперативная память</td>
                <td>{deviceInfo.memory}</td>
              </tr>
              <tr>
                <td>Платформа</td>
                <td>{deviceInfo.platform}</td>
              </tr>
              <tr>
                <td>Операционная система</td>
                <td>{deviceInfo.userAgent}</td>
              </tr>
              <tr>
                <td>Разрешение экрана</td>
                <td>{deviceInfo.screen}</td>
              </tr>
              <tr>
                <td>Язык системы</td>
                <td>{deviceInfo.language}</td>
              </tr>
              <tr>
                <td>Статус сети</td>
                <td>{deviceInfo.online ? "Онлайн" : "Офлайн"}</td>
              </tr>
              <tr>
                <td>Код устройства</td>
                <td>USER-DEVICE-{Date.now().toString().slice(-4)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
