const ciJobNumber = require("ci-job-number");

process.exit(ciJobNumber() === 1 ? 0 : 1);
