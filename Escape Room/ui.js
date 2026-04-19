// This file keeps all DOM updates in one place so the game logic stays readable.
export class UI {
  constructor() {
    this.timerEl = document.getElementById("timer");
    this.roomLabelEl = document.getElementById("room-label");
    this.objectiveEl = document.getElementById("objective");
    this.messageEl = document.getElementById("message");
    this.crosshairEl = document.getElementById("crosshair");
    this.lookLabelEl = document.getElementById("look-label");
    this.helperNoteEl = document.getElementById("helper-note");
    this.inventoryPanelEl = document.getElementById("inventory-panel");
    this.inventoryHelpEl = document.getElementById("inventory-help");
    this.hudEl = document.getElementById("hud");
    this.startScreenEl = document.getElementById("start-screen");
    this.pauseTipEl = document.getElementById("pause-tip");
    this.codeScreenEl = document.getElementById("code-screen");
    this.codeTitleEl = document.getElementById("code-title");
    this.codeTextEl = document.getElementById("code-text");
    this.codeInputEl = document.getElementById("code-input");
    this.codeSubmitButtonEl = document.getElementById("code-submit-button");
    this.codeCancelButtonEl = document.getElementById("code-cancel-button");
    this.flowScreenEl = document.getElementById("flow-screen");
    this.flowPanelEl = document.getElementById("flow-panel");
    this.flowTitleEl = document.getElementById("flow-title");
    this.flowTextEl = document.getElementById("flow-text");
    this.flowPrimaryButtonEl = document.getElementById("flow-primary-button");
    this.flowSecondaryButtonEl = document.getElementById("flow-secondary-button");
    this.endScreenEl = document.getElementById("end-screen");
    this.endTitleEl = document.getElementById("end-title");
    this.endTextEl = document.getElementById("end-text");
    this.messageTimeout = null;
    this.objectiveTimeout = null;
    this.codeSubmitHandler = null;
    this.codeCancelHandler = null;
    this.flowPrimaryHandler = null;
    this.flowSecondaryHandler = null;

    this.codeSubmitButtonEl.addEventListener("click", () => {
      if (this.codeSubmitHandler) {
        this.codeSubmitHandler(this.codeInputEl.value.trim().toUpperCase());
      }
    });

    this.codeCancelButtonEl.addEventListener("click", () => {
      if (this.codeCancelHandler) {
        this.codeCancelHandler();
      }
    });

    this.flowPrimaryButtonEl.addEventListener("click", () => {
      if (this.flowPrimaryHandler) {
        this.flowPrimaryHandler();
      }
    });

    this.flowSecondaryButtonEl.addEventListener("click", () => {
      if (this.flowSecondaryHandler) {
        this.flowSecondaryHandler();
      }
    });

    this.codeInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && this.codeSubmitHandler) {
        this.codeSubmitHandler(this.codeInputEl.value.trim().toUpperCase());
      }
    });
  }

  setTimer(secondsLeft) {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const seconds = String(secondsLeft % 60).padStart(2, "0");
    this.timerEl.textContent = `Time: ${minutes}:${seconds}`;
  }

  setRoomLabel(text) {
    this.roomLabelEl.textContent = text;
  }

  showObjective(text, duration = 3500) {
    this.objectiveEl.textContent = text;
    this.objectiveEl.classList.remove("hidden");
    window.clearTimeout(this.objectiveTimeout);
    this.objectiveTimeout = window.setTimeout(() => {
      this.objectiveEl.classList.add("hidden");
    }, duration);
  }

  showMessage(text, duration = 15000) {
    this.messageEl.textContent = text;
    this.messageEl.classList.remove("hidden");
    window.clearTimeout(this.messageTimeout);
    this.messageTimeout = window.setTimeout(() => {
      this.messageEl.classList.add("hidden");
    }, Math.max(duration, 15000));
  }

  setCrosshairActive(active) {
    this.crosshairEl.classList.toggle("active", active);
  }

  setLookLabel(text) {
    if (!text) {
      this.lookLabelEl.classList.add("hidden");
      this.lookLabelEl.textContent = "";
      return;
    }

    this.lookLabelEl.textContent = text;
    this.lookLabelEl.classList.remove("hidden");
  }

  showStart(show) {
    this.startScreenEl.classList.toggle("hidden", !show);
  }

  setGameUiVisible(show) {
    const method = show ? "remove" : "add";
    this.hudEl.classList[method]("hidden");
    this.helperNoteEl.classList[method]("hidden");
    this.inventoryPanelEl.classList[method]("hidden");
    this.inventoryHelpEl.classList[method]("hidden");
    this.crosshairEl.classList[method]("hidden");
    this.lookLabelEl.classList[method]("hidden");
    this.objectiveEl.classList.add("hidden");
    this.messageEl.classList.add("hidden");
  }

  showPauseTip(show) {
    this.pauseTipEl.classList.toggle("hidden", !show);
  }

  openCodeEntry(config, onSubmit, onCancel) {
    this.codeTitleEl.textContent = config?.title || "Code";
    this.codeTextEl.textContent = config?.prompt || "Enter the code.";
    this.codeInputEl.maxLength = config?.maxLength || 4;
    this.codeSubmitButtonEl.textContent = config?.submitLabel || "Unlock";
    this.codeSubmitHandler = onSubmit;
    this.codeCancelHandler = onCancel;
    this.codeInputEl.value = "";
    this.codeScreenEl.classList.remove("hidden");
    this.codeInputEl.focus();
  }

  closeCodeEntry() {
    this.codeScreenEl.classList.add("hidden");
    this.codeInputEl.value = "";
    this.codeInputEl.maxLength = 4;
    this.codeSubmitButtonEl.textContent = "Unlock";
  }

  isCodeEntryOpen() {
    return !this.codeScreenEl.classList.contains("hidden");
  }

  showFlowPopup(config, onPrimary, onSecondary) {
    this.flowTitleEl.textContent = config?.title || "Do you wish to continue";
    this.flowTextEl.textContent = config?.text || "";
    this.flowPrimaryButtonEl.textContent = config?.primaryLabel || "Yes";
    this.flowSecondaryButtonEl.textContent = config?.secondaryLabel || "No";
    this.flowPanelEl.classList.toggle("final-flow-panel", Boolean(config?.celebration));
    this.flowScreenEl.classList.remove("hidden");
    this.flowPrimaryHandler = onPrimary;
    this.flowSecondaryHandler = onSecondary;
  }

  hideFlowPopup() {
    this.flowScreenEl.classList.add("hidden");
    this.flowPanelEl.classList.remove("final-flow-panel");
    this.flowPrimaryHandler = null;
    this.flowSecondaryHandler = null;
  }

  isFlowPopupOpen() {
    return !this.flowScreenEl.classList.contains("hidden");
  }

  showEnd(title, text) {
    this.endTitleEl.textContent = title;
    this.endTextEl.textContent = text;
    this.endScreenEl.classList.remove("hidden");
  }

  hideEnd() {
    this.endScreenEl.classList.add("hidden");
  }
}
