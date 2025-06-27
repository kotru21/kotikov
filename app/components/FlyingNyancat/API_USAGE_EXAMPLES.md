// Примеры правильного использования нового API FlyingNyancat

// 1. Простой импорт (как сейчас используется)
import FlyingNyancat from "@/app/components/FlyingNyancat";

// 2. Импорт с типами (если нужна типизация)
import FlyingNyancat, {
type FlyingNyancatProps,
type NyancatSize,
type Position,
EXPLOSION_COLORS,
SIZE_CONFIG
} from "@/app/components/FlyingNyancat";

// 3. Импорт только типов
import type { FlyingNyancatProps, NyancatSize } from "@/app/components/FlyingNyancat";

// 4. Импорт констант
import { EXPLOSION_COLORS, SIZE_CONFIG } from "@/app/components/FlyingNyancat";

// Примеры использования:

// Базовое использование (как сейчас)
<FlyingNyancat
size="xlarge"
position={{ top: "20%", left: "-150px" }}
animationName="nyancat-fly"
animationDuration="15s"
zIndex={1}
/>

// С использованием типов
const nyancatProps: FlyingNyancatProps = {
size: "medium",
position: { top: "10%", left: "20%" },
animationName: "bounce",
animationDuration: "2s",
zIndex: 5
};

// С использованием констант
const availableSizes = Object.keys(SIZE_CONFIG) as NyancatSize[];
const randomColor = EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)];
