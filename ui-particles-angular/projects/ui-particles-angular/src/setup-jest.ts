Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      getPropertyValue: (prop: unknown) => {
        return '';
      },
    };
  },
});
/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

/**
 * ISSUE: https://github.com/thymikee/jest-preset-angular/issues/79
 *Q: "Could not find Angular Material core theme.." or "Could not find HammerJS" when testing components which used Material Design lib.
 */
const WARN_SUPPRESSING_PATTERNS = [/Could not find Angular Material core theme/, /Could not find HammerJS/];

const warn = console.warn;

Object.defineProperty(console, 'warn', {
  value: (...params: string[]) => {
    if (!WARN_SUPPRESSING_PATTERNS.some(pattern => pattern.test(params[0]))) {
      warn(...params);
    }
  },
});
