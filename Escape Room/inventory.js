// This file manages the toolbox shown at the bottom of the screen.
export class Inventory {
  constructor(container) {
    this.container = container;
    this.items = [];
    this.selectedId = null;
    this.onChange = null;
    this.render();
  }

  setChangeHandler(handler) {
    this.onChange = handler;
  }

  clear() {
    this.items = [];
    this.selectedId = null;
    this.render();
    this.notifyChange();
  }

  has(itemId) {
    return this.items.some((item) => item.id === itemId);
  }

  add(item) {
    if (this.has(item.id)) {
      return false;
    }

    this.items.push(item);
    this.render();
    this.notifyChange();
    return true;
  }

  remove(itemId) {
    const nextItems = this.items.filter((item) => item.id !== itemId);
    if (nextItems.length === this.items.length) {
      return false;
    }

    this.items = nextItems;
    if (this.selectedId === itemId) {
      this.selectedId = null;
    }

    this.render();
    this.notifyChange();
    return true;
  }

  getSelectedItem() {
    return this.items.find((item) => item.id === this.selectedId) || null;
  }

  getItems() {
    return this.items.slice();
  }

  toggleSelect(itemId) {
    this.selectedId = this.selectedId === itemId ? null : itemId;
    this.render();
    this.notifyChange();
  }

  selectByIndex(index) {
    const item = this.items[index];
    if (!item) {
      return null;
    }

    this.toggleSelect(item.id);
    return this.getSelectedItem();
  }

  notifyChange() {
    if (this.onChange) {
      this.onChange(this.getSelectedItem(), this.items.slice());
    }
  }

  render() {
    this.container.innerHTML = "";

    if (this.items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "inventory-empty";
      empty.textContent = "No tools yet. Look around the room for clues.";
      this.container.appendChild(empty);
      return;
    }

    for (const item of this.items) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "inventory-item";
      button.dataset.itemId = item.id;
      if (item.id === this.selectedId) {
        button.classList.add("selected");
      }

      const thumb = document.createElement("span");
      thumb.className = "inventory-thumb";
      thumb.textContent = this.getItemIcon(item);

      const label = document.createElement("span");
      label.className = "inventory-label";
      label.textContent = item.label;

      button.appendChild(thumb);
      button.appendChild(label);
      button.title = item.description || item.label;
      button.addEventListener("click", () => this.toggleSelect(item.id));
      this.container.appendChild(button);
    }
  }

  getItemIcon(item) {
    const icons = {
      hammer: "🔨",
      livingKey: "🔑",
      uvTorch: "🔦",
      livingKnife: "🔪",
      cabinetHandle: "🪝",
      battery: "🔋",
      apple: "🍎",
      banana: "🍌",
      pear: "🍐",
      spoon: "🥄",
      smallKey: "🗝️",
      knife: "🔪",
      headphones: "🎧",
      audioCable: "🔌",
      guitarPick: "🔺",
      noteCard: "🎵",
      vinylRecord: "💿",
      blueBall: "🔵",
      redBall: "🔴",
      yellowBall: "🟡",
      greenBall: "🟢",
      badmintonRacket: "🏸",
      shuttlecock: "🪽",
      tennisRacket: "🎾",
      tennisBallItem: "🎾",
      blockP: "🟩",
      blockL: "🟨",
      blockA: "🟦",
      blockY: "🟥",
      room4UvTorch: "🔦",
    };

    return icons[item.id] || "🧩";
  }
}
