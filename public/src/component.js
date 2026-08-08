const VALID_STATES = new Set([
  "collapsed-pristine",
  "expanded-pristine",
  "collapsed-error",
  "expanded-error",
  "collapsed-ready",
  "expanded-ready",
  "completed"
]);

export class DisclosureErrorPattern {
  constructor(root, { onReadyForAcquisition = () => {} } = {}) {
    this.root = root;
    this.onReadyForAcquisition = onReadyForAcquisition;
    this.toggle = root.querySelector("#disclosure-toggle");
    this.panel = root.querySelector("#disclosure-panel");
    this.checkbox = root.querySelector("#confirmation");
    this.completeButton = root.querySelector("#complete-button");
    this.error = root.querySelector("#validation-error");
    this.errorJump = root.querySelector(".error-jump");
    this.status = root.querySelector("#completion-status");
    this.badge = root.querySelector(".state-badge");
    this.open = false;
    this.checked = false;
    this.hasError = false;
    this.completed = false;

    this.bindEvents();
    this.render();
  }

  bindEvents() {
    this.toggle.addEventListener("click", () => {
      this.completed = false;
      this.open = !this.open;
      this.render();
    });

    this.panel.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      this.open = false;
      this.render();
      this.toggle.focus();
    });

    this.checkbox.addEventListener("change", () => {
      this.checked = this.checkbox.checked;
      this.hasError = false;
      this.completed = false;
      this.render();
    });

    this.checkbox.addEventListener("blur", () => {
      this.checkbox.classList.remove("is-programmatic-focus");
    });

    this.completeButton.addEventListener("click", () => {
      if (!this.checked) {
        this.open = true;
        this.hasError = true;
        this.completed = false;
        this.render();
        this.focusCheckbox();
        return;
      }

      this.open = false;
      this.hasError = false;
      this.completed = true;
      this.render();
      this.onReadyForAcquisition();
    });

    this.errorJump.addEventListener("click", () => {
      this.open = true;
      this.render();
      this.focusCheckbox();
    });
  }

  focusCheckbox() {
    this.checkbox.classList.add("is-programmatic-focus");
    this.checkbox.focus();
  }

  get state() {
    if (this.completed) return "completed";
    const visibility = this.open ? "expanded" : "collapsed";
    const condition = this.hasError ? "error" : this.checked ? "ready" : "pristine";
    return `${visibility}-${condition}`;
  }

  render() {
    const state = this.state;
    this.root.dataset.state = state;
    this.toggle.setAttribute("aria-expanded", String(this.open));
    this.panel.hidden = !this.open;
    this.checkbox.checked = this.checked;
    this.checkbox.setAttribute("aria-invalid", String(this.hasError));
    this.error.hidden = !this.hasError;
    this.status.hidden = !this.completed;
    this.badge.textContent = this.hasError ? "要確認" : this.checked ? "確認済み" : "未確認";
  }

  setState(state) {
    if (!VALID_STATES.has(state)) throw new Error(`Unknown state: ${state}`);

    this.open = state.startsWith("expanded");
    this.checked = state.includes("ready") || state === "completed";
    this.hasError = state.includes("error");
    this.completed = state === "completed";
    this.render();
  }
}

export const TEST_STATES = Object.freeze([...VALID_STATES]);
