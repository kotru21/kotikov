import "@testing-library/jest-dom/vitest";

// Bun's runtime injects native `localStorage`/`sessionStorage` globals that
// shadow jsdom's Storage. When no `--localstorage-file` is configured (the case
// under plain `bunx vitest`), they lack a working `clear()` and behave
// inconsistently, breaking browser-storage tests. Replace them with a
// spec-compliant in-memory Storage so tests behave like a real browser
// regardless of the runtime executing Vitest.
class MemoryStorage {
  private readonly store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return index >= 0 && index < keys.length ? keys[index] : null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const localStorageMock = new MemoryStorage();
const sessionStorageMock = new MemoryStorage();

for (const target of [globalThis, window]) {
  Object.defineProperty(target, "localStorage", {
    configurable: true,
    writable: true,
    value: localStorageMock,
  });
  Object.defineProperty(target, "sessionStorage", {
    configurable: true,
    writable: true,
    value: sessionStorageMock,
  });
}
