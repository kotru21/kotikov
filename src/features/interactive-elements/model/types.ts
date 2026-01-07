export interface InteractiveTextRegistry {
  register: (el: HTMLElement) => void;
  unregister: (el: HTMLElement) => void;
}
