import { useState, useEffect, useCallback } from "react";
import { DeviceInfo } from "../components/windows/types";

const INITIAL_DEVICE_INFO: DeviceInfo = {
  processor: "Определяется...",
  memory: "Определяется...",
  platform: "Определяется...",
  userAgent: "Определяется...",
  screen: "Определяется...",
  language: "Определяется...",
  online: true,
  hardwareConcurrency: "Определяется...",
};

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(INITIAL_DEVICE_INFO);

  const getDeviceInfo = useCallback(() => {
    if (typeof window === "undefined") return;

    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      userAgentData?: { platform?: string };
    };
    const screen = window.screen;

    // Определение процессора (приблизительно)
    let processor = "Неизвестен";
    if (nav.hardwareConcurrency) {
      processor = `${nav.hardwareConcurrency}-ядерный процессор`;
    }

    // Определение памяти (если доступно)
    let memory = "Информация недоступна";
    if (nav.deviceMemory) {
      memory = `${nav.deviceMemory} ГБ`;
    } else if (nav.hardwareConcurrency) {
      // Примерная оценка на основе количества ядер
      const estimatedMemory =
        nav.hardwareConcurrency >= 8
          ? "16+ ГБ"
          : nav.hardwareConcurrency >= 4
          ? "8-16 ГБ"
          : "4-8 ГБ";
      memory = `~${estimatedMemory} (оценка)`;
    }

    // Определение платформы
    const platform =
      nav.platform || nav.userAgentData?.platform || "Неизвестна";

    // Определение ОС
    let os = "Неизвестная ОС";
    const userAgent = nav.userAgent;
    if (userAgent.includes("Windows NT 10.0")) os = "Windows 10/11";
    else if (userAgent.includes("Windows NT")) os = "Windows";
    else if (userAgent.includes("Mac OS X")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) os = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      os = "iOS";

    // Информация о экране
    const screenInfo = `${screen.width}x${screen.height}, ${screen.colorDepth}-бит`;

    setDeviceInfo({
      processor,
      memory,
      platform,
      userAgent: os,
      screen: screenInfo,
      language: nav.language || "Неизвестен",
      online: nav.onLine,
      hardwareConcurrency: nav.hardwareConcurrency?.toString() || "Неизвестно",
    });
  }, []);

  useEffect(() => {
    getDeviceInfo();
  }, [getDeviceInfo]);

  return deviceInfo;
}
