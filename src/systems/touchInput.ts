export type GameAction = "left" | "right" | "jump" | "attack" | "dash" | "skill";

class TouchInput {
  private state = new Map<GameAction, boolean>();
  private pressed = new Set<GameAction>();

  initialize(): void {
    const root = document.querySelector<HTMLElement>("#touch-controls");
    if (!root || root.dataset.ready) return;
    root.dataset.ready = "true";
    root.querySelectorAll<HTMLButtonElement>("button[data-action]").forEach((button) => {
      const action = button.dataset.action as GameAction;
      const down = (event: PointerEvent) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        if (!this.state.get(action)) this.pressed.add(action);
        this.state.set(action, true);
        button.classList.add("active");
        if (navigator.vibrate) navigator.vibrate(8);
      };
      const up = (event: PointerEvent) => {
        event.preventDefault();
        this.state.set(action, false);
        button.classList.remove("active");
      };
      button.addEventListener("pointerdown", down);
      button.addEventListener("pointerup", up);
      button.addEventListener("pointercancel", up);
      button.addEventListener("pointerleave", up);
    });
  }

  isDown(action: GameAction): boolean {
    return this.state.get(action) ?? false;
  }

  justPressed(action: GameAction): boolean {
    const result = this.pressed.has(action);
    this.pressed.delete(action);
    return result;
  }

  reset(): void {
    this.state.clear();
    this.pressed.clear();
  }
}

export const touchInput = new TouchInput();
