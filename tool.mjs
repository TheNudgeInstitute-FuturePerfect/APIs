let status;
if (process.env.ENV) {
  status = "disabled";
} else {
  status = "enabled";
}

global.log = function (...args) {
  if (status === "enabled") {
    for (let i = 0; i < args.length; i++) {
      console.log(args.join(" "));
    }
  }
};
