import { app } from "../../../scripts/app.js";
import { ComfyWidgets } from "../../../scripts/widgets.js";

const DISPLAY_NAME = "CLSM • Simple Path Formatter";
const TARGET_KEYS = new Set([
  "CLSM_SimplePathFormatter",
  DISPLAY_NAME,
  "Simple Path Formatter"
]);

const FALLBACK_GREEN = {
  color: "#2e7d32",
  bgcolor: "#1b5e20",
  boxcolor: "#66bb6a"
};

function matchesTarget(name) {
  if (!name) return false;
  if (TARGET_KEYS.has(name)) return true;
  return String(name).toLowerCase().includes("simple path formatter");
}

function palette() {
  return (window.LGraphCanvas && window.LGraphCanvas.node_colors && window.LGraphCanvas.node_colors.green) || FALLBACK_GREEN;
}

function applyColors(node, pal) {
  node.color = pal.color;
  node.bgcolor = pal.bgcolor;
  node.boxcolor = pal.boxcolor;
}

function ensureOutputWidget(node) {
  if (node.__clsmOutputWidget) {
    return node.__clsmOutputWidget;
  }

  const widgetInfo = ComfyWidgets["STRING"](node, "Salida", ["STRING", { multiline: true }], app);
  const widget = widgetInfo.widget;
  widget.name = "__clsm_output";
  widget.serialize = false;

  const input = widget.inputEl;
  if (input) {
    input.readOnly = true;
    input.placeholder = "La salida aparecera aqui al ejecutar";
    input.style.opacity = "0.85";
    input.style.whiteSpace = "pre-wrap";
    input.style.wordBreak = "break-word";
    input.style.overflowWrap = "anywhere";
    input.style.resize = "vertical"; // Allow manual vertical resizing
  }

  node.__clsmOutputWidget = widget;
  layoutOutputWidget(node);
  return widget;
}

function getNodeWidth(node) {
  if (!node || !node.size) return 0;
  if (Array.isArray(node.size)) {
    return node.size[0] || 0;
  }
  return typeof node.size === "number" ? node.size : 0;
}

function getNodeHeight(node) {
  if (!node || !node.size) return 0;
  if (Array.isArray(node.size)) {
    return node.size[1] || 0;
  }
  return 0;
}

function layoutOutputWidget(node) {
  setTimeout(() => {
    const widget = node.__clsmOutputWidget;
    const input = widget && widget.inputEl;
    if (!widget || !input) return;

    // Set width to fill the node, which user confirms is working.
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.margin = '0';

    // Height is now manually controlled by the user.
  }, 0);
}

function flattenToStrings(value, out) {
  if (value == null) {
    return;
  }
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      flattenToStrings(item, out);
    }
    return;
  }
  if (typeof value === "object") {
    if (Object.prototype.hasOwnProperty.call(value, "text")) {
      flattenToStrings(value.text, out);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(value, "full_prefix_path")) {
      flattenToStrings(value.full_prefix_path, out);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(value, "value")) {
      flattenToStrings(value.value, out);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(value, "outputs")) {
      flattenToStrings(value.outputs, out);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(value, "result")) {
      flattenToStrings(value.result, out);
      return;
    }
    for (const key of Object.keys(value)) {
      flattenToStrings(value[key], out);
    }
    return;
  }
  out.push(String(value));
}

function extractText(message) {
  const parts = [];
  flattenToStrings(message, parts);

  if (!parts.length) {
    return "";
  }
  if (parts.length === 1) {
    return parts[0];
  }
  const allSingleCharacters = parts.every((part) => typeof part === "string" && part.length === 1);
  if (allSingleCharacters) {
    return parts.join("");
  }
  const allSingleLine = parts.every((part) => typeof part === "string" && !part.includes("\n"));
  if (allSingleLine) {
    return parts.join(" ");
  }
  return parts.join("\n");
}

function updateOutput(node, value) {
  const widget = ensureOutputWidget(node);
  const textRaw = value == null ? "" : value;
  const text = typeof textRaw === "string" ? textRaw.replace(/\r?\n/g, "") : textRaw;
  widget.value = text;
  if (widget.inputEl && widget.inputEl.value !== text) {
    widget.inputEl.value = text;
  }
  node.__clsmLastOutput = text;
  layoutOutputWidget(node);
  if (typeof node.setDirtyCanvas === "function") {
    node.setDirtyCanvas(true, true);
  }
}

app.registerExtension({
  name: "CLSM.SimplePathFormatter.UI",
  beforeRegisterNodeDef(nodeType, nodeData) {
    const nodeName = nodeData && nodeData.name;
    if (!matchesTarget(nodeName)) {
      return;
    }

    const pal = palette();
    nodeData.color = pal.color;
    nodeData.bgcolor = pal.bgcolor;
    nodeData.boxcolor = pal.boxcolor;

    const originalOnNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      if (originalOnNodeCreated) originalOnNodeCreated.apply(this, arguments);
      applyColors(this, pal);
      this.title = DISPLAY_NAME;
      ensureOutputWidget(this);
      updateOutput(this, this.__clsmLastOutput || "");
    };

    const originalOnExecuted = nodeType.prototype.onExecuted;
    nodeType.prototype.onExecuted = function (message) {
      if (originalOnExecuted) originalOnExecuted.apply(this, arguments);
      const text = extractText(message);
      console.debug("[CLSM.SimplePathFormatter] onExecuted", message, "=>", text);
      updateOutput(this, text);
    };

    const originalOnConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function () {
      if (originalOnConfigure) originalOnConfigure.apply(this, arguments);
      ensureOutputWidget(this);
      updateOutput(this, this.__clsmLastOutput || "");
    };

    const originalOnResize = nodeType.prototype.onResize;
    nodeType.prototype.onResize = function () {
      const res = originalOnResize ? originalOnResize.apply(this, arguments) : undefined;
      layoutOutputWidget(this);
      return res;
    };
  }
});