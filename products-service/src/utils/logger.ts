/* eslint-disable no-console */
const JEST = !!process.env.TS_JEST;

export default {
  error: (...args) => {
    if (!JEST) {
      console.error(...args);
    }
  },

  warn: (...args) => {
    if (!JEST) {
      console.warn(...args);
    }
  },

  log: (...args) => {
    if (!JEST) {
      console.log(...args);
    }
  },
};
