// src/utils.ts
var primitiveTypes = ["string", "number", "boolean"];
var isPrimitive = (value) => primitiveTypes.includes(typeof value);
var isNullish = (value) => value === null || value === undefined;
var isFunction = (value) => value instanceof Function;

// src/signals.ts
var signalIdentifier = Symbol();
var define = Object.defineProperty;
var signal = (value) => {
  const listeners = new Set;
  const signal2 = () => {
    if (currEffect) {
      listeners.add(currEffect);
    }
    return value;
  };
  define(signal2, signalIdentifier, {});
  signal2.set = (newValue) => {
    const updated = isFunction(newValue) ? newValue(value) : newValue;
    if (value === updated)
      return;
    else {
      value = updated;
      for (const fn of listeners)
        fn(value);
    }
  };
  return signal2;
};
define(signal, Symbol.hasInstance, { value(instance) {
  return signalIdentifier in instance;
} });
var currEffect;
var effect = (fn) => {
  currEffect = fn;
  fn();
  currEffect = undefined;
};
var compute = (fn) => {
  const computed = signal();
  effect(() => computed.set(fn()));
  return computed;
};

// src/index.ts
var index = 0;
var effects = [];
var h = (type, attributes, ...children) => {
  const i = ++index;
  if (isFunction(type)) {
    if (type.name === "Fragment") {
      return Fragment(children);
    }
    const node2 = type(attributes, children);
    effects[i]?.();
    return node2;
  }
  if (!type) {
    return Fragment(children);
  }
  const node = document.createElement(type);
  traverseAttributes(node, attributes);
  traverseChildren(node, children);
  return node;
};
var Fragment = (children) => {
  const node = new DocumentFragment;
  traverseChildren(node, children);
  return node;
};
var useRef = (value) => ({ current: value });
var useEffect = (fn) => effects[index] = fn;
var SignalElementTag = "signal-element";

class SignalElement extends HTMLElement {
  constructor() {
    super(...arguments);
  }
}
customElements.define(SignalElementTag, SignalElement);
var isSignal = (value) => value instanceof signal;
var traverseAttributes = (node, attributes) => {
  if (!attributes) {
    return;
  }
  const set = (key, value) => node.setAttribute(key, value);
  for (const [key, value] of Object.entries(attributes)) {
    if (isNullish(value) || value === false) {
      continue;
    } else if (value === true) {
      set(key, "");
    } else if (isPrimitive(value)) {
      set(key, `${value}`);
    } else if (isSignal(value)) {
      effect(() => set(key, value()));
    } else if (key === "style") {
      set(key, Object.entries(value).map(([k, v]) => v ? `${k}:${v};` : "").join(""));
    } else if (key === "ref") {
      isFunction(value) ? value(node) : value.current = node;
    } else if (isFunction(value)) {
      node[key] = value;
    }
  }
};
var traverseChildren = (node, children = []) => {
  const push = (item) => node.appendChild(item);
  for (const child of children) {
    if (isNullish(child)) {
      continue;
    } else if (isPrimitive(child)) {
      push(new Text(`${child}`));
    } else if (Array.isArray(child)) {
      traverseChildren(node, child);
    } else if (isSignal(child)) {
      const wrapper = document.createElement(SignalElementTag);
      effect(() => wrapper.replaceChildren(child()));
      push(wrapper);
    } else {
      push(child);
    }
  }
};

// example.tsx
var count = signal(0);
var inc = () => count.set((v) => ++v);
var dec = () => count.set((v) => --v);
var App = () => {
  const pre = useRef();
  useEffect(() => {
    console.log("App component mounted", pre.current);
  });
  return h("main", null, h(Header, {
    title: "Counter app h2",
    bold: true
  }), h("section", {
    style: { display: "flex", gap: "1rem" }
  }, h("button", {
    onclick: inc
  }, "+"), h("button", {
    onclick: dec
  }, "-"), h("pre", {
    ref: pre,
    style: { "margin-left": "auto" }
  }, count)));
};
var Header = ({ title, bold }) => {
  const label = compute(() => {
    const v = count();
    return title + " " + (v == 0 ? "null" : v > 0 ? "cool" : "oops");
  });
  const onMount = (h2) => {
    console.log("h2 element mounted", h2);
  };
  return h("h2", {
    ref: onMount,
    style: bold && { "font-weight": "bold", "text-align": "right" }
  }, label);
};
document.body.appendChild(h(App, null));
