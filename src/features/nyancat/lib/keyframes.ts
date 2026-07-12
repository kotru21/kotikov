const WAVE_CYCLES = 2.5;
const Y_AMPLITUDE = 26;
const BANK_DEG = 7;
const SCALE_AMPLITUDE = 0.02;
const KEYFRAME_STEP = 5;

function roundCss(value: number, digits = 3): string {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return String(rounded);
}

/** Header flight + bank keyframes (static; safe for style injection). */
export function buildNyancatKeyframes(): string {
  const flyFrames: string[] = [];
  const bankFrames: string[] = [];

  for (let percent = 0; percent <= 100; percent += KEYFRAME_STEP) {
    const t = percent / 100;
    const phase = t * WAVE_CYCLES * Math.PI * 2;
    const y = -Y_AMPLITUDE * Math.sin(phase);
    const rotate = -BANK_DEG * Math.cos(phase);
    const scale = 1 - SCALE_AMPLITUDE * Math.sin(phase);
    let x: string;
    if (percent === 0) x = "-150px";
    else if (percent === 100) x = "calc(100vw + 150px)";
    else x = `${String(percent)}vw`;

    flyFrames.push(`
          ${String(percent)}% {
            transform: translate3d(${x}, ${roundCss(y, 0)}px, 0);
          }`);
    bankFrames.push(`
          ${String(percent)}% {
            transform: rotate(${roundCss(rotate, 0)}deg) scale(${roundCss(scale)});
          }`);
  }

  return `
        @keyframes nyancat-fly {${flyFrames.join("")}
        }

        @keyframes nyancat-bank {${bankFrames.join("")}
        }
  `;
}

export const NYANCAT_KEYFRAMES_CSS = buildNyancatKeyframes();
