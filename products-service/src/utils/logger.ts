/* eslint-disable no-console */
const JEST = !!process.env.TS_JEST;

export default {
  error: (...args: unknown[]) => {
    if (!JEST) {
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (!JEST) {
      console.warn(...args);
    }
  },

  log: (...args: unknown[]) => {
    if (!JEST) {
      console.log(...args);
    }
  },
};
