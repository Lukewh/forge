import { h, render } from "preact";
import type { ForgePromptOptions } from "./types";

/**
 * Focus trap: keeps Tab/Shift+Tab within the dialog element.
 */
function trapFocus(dialog: HTMLElement): () => void {
  const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;
    const elements = dialog.querySelectorAll<HTMLElement>(focusable);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === first) { event.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  };
  dialog.addEventListener("keydown", onKeyDown);
  // Auto-focus first focusable
  const first = dialog.querySelector<HTMLElement>(focusable);
  if (first) requestAnimationFrame(() => first.focus());
  return () => dialog.removeEventListener("keydown", onKeyDown);
}

export function showForgePrompt(options: ForgePromptOptions): Promise<string | null> {
  if (typeof document === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    let value = options.initialValue ?? "";
    let cleanup: (() => void) | null = null;
    const close = (result: string | null) => {
      cleanup?.();
      render(null, host);
      host.remove();
      resolve(result);
    };
    const submit = () => {
      if (options.requiredText && value !== options.requiredText) return close(null);
      close(value);
    };
    render(h("div", {
      class: "forge-v3-dialog-backdrop", role: "presentation",
      onMouseDown: (event: MouseEvent) => { if (event.target === event.currentTarget) close(null); },
      onKeyDown: (event: KeyboardEvent) => { if (event.key === "Escape") close(null); },
      ref: (el: HTMLElement | null) => { if (el) cleanup = trapFocus(el); },
    },
      h("section", { class: `forge-v3-dialog ${options.danger ? "danger" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": options.title },
        h("header", { class: "forge-v3-dialog-head" }, h("h2", null, options.title), h("button", { type: "button", onClick: () => close(null), "aria-label": "Close dialog" }, "×")),
        options.message ? h("p", { class: "forge-v3-dialog-message" }, options.message) : null,
        h("label", { class: "forge-v3-dialog-field" },
          h("span", null, options.label ?? "Response"),
          h("textarea", { autoFocus: true, value, placeholder: options.placeholder, onInput: (event: InputEvent) => { value = (event.currentTarget as HTMLTextAreaElement).value; }, onKeyDown: (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") submit(); } })
        ),
        options.requiredText ? h("p", { class: "forge-v3-dialog-hint" }, "Required confirmation text: ", h("code", null, options.requiredText)) : null,
        h("footer", { class: "forge-v3-dialog-actions" },
          h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => close(null) }, "Cancel"),
          h("button", { type: "button", class: `forge-v3-da ${options.danger ? "forge-v3-da-danger" : "forge-v3-da-primary"}`, onClick: submit }, options.confirmText ?? "Submit")
        )
      )
    ), host);
  });
}

export function showForgeConfirm({ title, message, confirmText = "Confirm", danger = false }: { title: string; message?: string; confirmText?: string; danger?: boolean }): Promise<boolean> {
  if (typeof document === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    let cleanup: (() => void) | null = null;
    const close = (result: boolean) => {
      cleanup?.();
      render(null, host);
      host.remove();
      resolve(result);
    };
    render(h("div", {
      class: "forge-v3-dialog-backdrop", role: "presentation",
      onMouseDown: (event: MouseEvent) => { if (event.target === event.currentTarget) close(false); },
      onKeyDown: (event: KeyboardEvent) => { if (event.key === "Escape") close(false); },
      ref: (el: HTMLElement | null) => { if (el) cleanup = trapFocus(el); },
    },
      h("section", { class: `forge-v3-dialog ${danger ? "danger" : ""}`, role: "dialog", "aria-modal": "true", "aria-label": title },
        h("header", { class: "forge-v3-dialog-head" }, h("h2", null, title), h("button", { type: "button", onClick: () => close(false), "aria-label": "Close dialog" }, "×")),
        message ? h("p", { class: "forge-v3-dialog-message" }, message) : null,
        h("footer", { class: "forge-v3-dialog-actions" },
          h("button", { type: "button", class: "forge-v3-da forge-v3-da-ghost", onClick: () => close(false) }, "Cancel"),
          h("button", { type: "button", class: `forge-v3-da ${danger ? "forge-v3-da-danger" : "forge-v3-da-primary"}`, onClick: () => close(true) }, confirmText)
        )
      )
    ), host);
  });
}

export function showForgeError({ title, message }: { title: string; message: string }): void {
  if (typeof document === "undefined") return;
  const host = document.createElement("div");
  document.body.appendChild(host);
  let cleanup: (() => void) | null = null;
  const close = () => { cleanup?.(); render(null, host); host.remove(); };
  render(h("div", {
    class: "forge-v3-dialog-backdrop", role: "presentation",
    onMouseDown: (event: MouseEvent) => { if (event.target === event.currentTarget) close(); },
    onKeyDown: (event: KeyboardEvent) => { if (event.key === "Escape") close(); },
    ref: (el: HTMLElement | null) => { if (el) cleanup = trapFocus(el); },
  },
    h("section", { class: "forge-v3-dialog danger", role: "alertdialog", "aria-modal": "true", "aria-label": title },
      h("header", { class: "forge-v3-dialog-head" }, h("h2", null, title), h("button", { type: "button", onClick: close, "aria-label": "Close dialog" }, "×")),
      h("p", { class: "forge-v3-dialog-message" }, message),
      h("footer", { class: "forge-v3-dialog-actions" },
        h("button", { type: "button", class: "forge-v3-da forge-v3-da-primary", onClick: close }, "Dismiss")
      )
    )
  ), host);
}
