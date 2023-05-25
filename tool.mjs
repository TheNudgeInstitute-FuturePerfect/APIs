let enabled = true;
if (process.env.ENV) enabled = false;

global.log = function (...args) {
  if (enabled) console.log(...args);
};
