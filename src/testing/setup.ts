import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  HTMLFormElement.prototype.requestSubmit = function (
    this: HTMLFormElement,
    submitter?: HTMLElement,
  ) {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    if (submitter) {
      Object.defineProperty(event, 'submitter', { value: submitter });
    }
    this.dispatchEvent(event);
  };

  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const submitter = target?.closest(
        'button[type="submit"], input[type="submit"]',
      ) as HTMLButtonElement | HTMLInputElement | null;
      if (!submitter || submitter.disabled) return;
      const form = submitter.form;
      if (!form) return;
      form.requestSubmit(submitter);
    },
    true,
  );

  class PointerEventFake extends Event {
    pointerId = 1;
    pointerType = 'mouse';
    isPrimary = true;

    constructor(type: string, props?: PointerEventInit) {
      super(type, props);
      if (props) {
        if (props.pointerId !== undefined) this.pointerId = props.pointerId;
        if (props.pointerType !== undefined)
          this.pointerType = props.pointerType;
        if (props.isPrimary !== undefined) this.isPrimary = props.isPrimary;
      }
    }
  }

  window.PointerEvent = PointerEventFake as unknown as typeof PointerEvent;

  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
}
